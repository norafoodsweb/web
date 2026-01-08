import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // Default to root, but we will override this based on role later
    let next = searchParams.get("next") ?? "/";

    if (code) {
      // 1. Await cookies (Next.js 15 Fix)
      const cookieStore = await cookies();

      // 2. Create the Redirect Response FIRST
      // We create it now so we can attach cookies to it directly
      const response = NextResponse.redirect(`${origin}${next}`);

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => {
                  // 3. CRITICAL FIX: Set cookies on the RESPONSE object
                  // This ensures the browser actually receives the session cookie
                  response.cookies.set(name, value, options);
                });
              } catch {
                // Ignored
              }
            },
          },
        }
      );

      // 4. Exchange the Code for a Session
      // This triggers 'setAll' above, which attaches cookies to 'response'
      const { data: authData, error } =
        await supabase.auth.exchangeCodeForSession(code);

      if (!error && authData.user) {
        // 5. ROLE BASED REDIRECT CHECK
        // Now that we have a session, let's check if they are an Admin
        const { data: profile } = await supabase
          .from("profile")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profile?.role === "admin") {
          // If admin, force redirect to admin panel
          // We need to clone the response to change the URL, or just return a new one with same cookies
          // The easiest way is to rely on middleware, OR just overwrite the URL here:
          return NextResponse.redirect(`${origin}/admin`, {
            headers: response.headers, // Keep the Set-Cookie headers we just made!
          });
        }

        // If not admin (or standard user), return the original response (goes to /)
        return response;
      } else {
        console.error("Supabase Auth Error:", error?.message);
      }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  } catch (err) {
    console.error("Callback Route Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
