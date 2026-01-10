"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // --- HANDLERS ---

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        // --- SIGN UP LOGIC ---
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }, // Stores name in metadata
          },
        });
        if (signUpError) throw signUpError;
        alert("Check your email for the confirmation link!");
        setLoading(false);
      } else {
        // --- LOG IN LOGIC (Updated) ---

        // 1. Authenticate
        const { data: authData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (loginError) throw loginError;

        // 2. Check Role (Only if login succeeded)
        if (authData.user) {
          const { data: profile } = await supabase
            .from("profile")
            .select("role")
            .eq("id", authData.user.id)
            .single();

          router.refresh(); // Update server components

          // 3. Conditional Redirect
          if (profile?.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }
      }
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      {/* ... (The rest of your JSX remains exactly the same) ... */}

      <div className="bg-white w-full max-w-[900px] h-[600px] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row">
        {/* LEFT SECTION */}
        <div
          className={`hidden md:flex w-1/2 bg-indigo-600 text-white flex-col justify-center items-center p-12 transition-all duration-500 relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150"></div>
          <div className="z-10 text-center space-y-6">
            <h2 className="text-4xl font-serif font-bold tracking-tight">
              {mode === "signup" ? "Join the Family" : "Welcome Back"}
            </h2>
            <p className="text-indigo-100 text-lg leading-relaxed">
              {mode === "signup"
                ? "Start your journey with authentic homemade flavors. Create an account to manage orders."
                : "Sign in to access your dashboard, manage your inventory, and view your latest bestsellers."}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white relative">
          {/* Toggles */}
          <div className="flex w-full h-16 border-b border-stone-100">
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 text-sm font-bold uppercase tracking-wider transition-colors ${
                mode === "signup"
                  ? "text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setMode("login")}
              className={`flex-1 text-sm font-bold uppercase tracking-wider transition-colors ${
                mode === "login"
                  ? "text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              Log In
            </button>
          </div>

          {/* Sliding Form */}
          <div className="flex-grow relative overflow-hidden p-8 sm:p-12">
            <div
              className="absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-500 ease-in-out"
              style={{
                transform:
                  mode === "signup" ? "translateX(0%)" : "translateX(-50%)",
              }}
            >
              {/* Sign Up Form */}
              <div className="w-1/2 h-full px-12 py-8 flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-stone-800 mb-2">
                    Create Account
                  </h3>
                  <p className="text-sm text-stone-500">
                    Enter your details to get started.
                  </p>
                </div>
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 uppercase">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 uppercase">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 uppercase">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <>
                        Sign Up <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-stone-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                <GoogleButton onClick={handleGoogleLogin} loading={loading} />
              </div>

              {/* Log In Form */}
              <div className="w-1/2 h-full px-12 py-8 flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-stone-800 mb-2">
                    Welcome Back
                  </h3>
                  <p className="text-sm text-stone-500">
                    Please enter your details.
                  </p>
                </div>
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 uppercase">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                  {/* Find this block inside the "Log In" form section */}
                  <div className="space-y-1">
                    {/* NEW: Flex container to hold Label on left, Link on right */}
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-stone-600 uppercase">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Log In"
                    )}
                  </button>
                </form>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-stone-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                <GoogleButton onClick={handleGoogleLogin} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full border border-stone-300 hover:bg-stone-50 bg-white text-stone-700 font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Google
    </button>
  );
}
