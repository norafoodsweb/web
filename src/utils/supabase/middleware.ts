import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Initialize the response
  // We start with a default response that we might modify (add cookies/headers) later.
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Create the Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Refresh Session & Get User
  // supabase.auth.getUser() is safer than getSession() for middleware
  // It automatically refreshes the Auth token if needed (triggering setAll above)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. PROTECTED ROUTES LOGIC

  // === ADMIN ROUTE PROTECTION ===
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // A. If user is not logged in, redirect to Login
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // B. If user IS logged in, check their Role in your "profiles" table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // C. If role is NOT admin, redirect them to Home
    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // === OPTIONAL: USER ROUTE PROTECTION ===
  // Example: prevent non-logged users from seeing /profile or /checkout
  // if ((request.nextUrl.pathname.startsWith('/checkout') || request.nextUrl.pathname.startsWith('/profile')) && !user) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // 5. Return the final response (which contains the updated cookies)
  return supabaseResponse;
}

// 6. Matcher Config
// This tells Next.js which routes to run this middleware on.
// We exclude static files, images, and the favicon to save performance.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
