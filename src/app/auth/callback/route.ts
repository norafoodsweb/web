import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    // Default to homepage if 'next' is missing
    const next = searchParams.get("next") ?? "/";

    if (code) {
      const cookieStore = await cookies();

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!, // Ensure this matches your .env file
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => {
                  cookieStore.set(name, value, options);
                });
              } catch {
                // Handled by middleware
              }
            },
          },
        }
      );

      const { data: authData, error } =
        await supabase.auth.exchangeCodeForSession(code);

      if (!error && authData.user) {
        // --- 1. PRIORITY CHECK: Password Reset ---
        // If the user is here to update their password, let them pass immediately!
        if (next === "/auth/update-password") {
          return NextResponse.redirect(`${origin}${next}`);
        }

        // --- 2. ROLE CHECK ---
        // Only run this if it's a normal login, NOT a password reset
        const { data: profile } = await supabase
          .from("profile") // Ensure table name is 'profile' or 'profiles'
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profile?.role === "admin") {
          return NextResponse.redirect(`${origin}/admin`);
        } else {
          return NextResponse.redirect(`${origin}${next}`); // Go to target or home
        }
      }
    }

    // Code exchange failed
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  } catch (err) {
    console.error("Callback Route Error:", err);
    return NextResponse.redirect(
      `${new URL(request.url).origin}/auth?error=Internal Server Error`
    );
  }
}
