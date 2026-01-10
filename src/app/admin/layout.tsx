"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
// 1. Import MobileSidebar to use the hamburger menu
import { MobileSidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Loader2, Store } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) throw new Error("No user found");

        const { data: profile, error: profileError } = await supabase
          .from("profile")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError || !profile || profile.role !== "admin") {
          throw new Error("Not authorized");
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Admin Check Failed:", error);
        await supabase.auth.signOut();
        router.replace("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Verifying Admin Access...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col">
        {/* --- 1. DESKTOP NAVBAR (Hidden on Mobile) --- */}
        <div className="hidden md:block">
          <Navbar type="admin" />
        </div>

        {/* --- 2. MOBILE HEADER (Visible only on Mobile) --- */}
        <div className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* The Hamburger Icon triggers the Sidebar Sheet */}
            <MobileSidebar type="admin" />

            <div className="flex items-center gap-2 font-serif font-bold text-lg text-indigo-600">
              <Store className="w-5 h-5" />
              <span>Nora Admin</span>
            </div>
          </div>
        </div>

        {/* --- 3. PAGE CONTENT --- */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </div>
    </div>
  );
}
