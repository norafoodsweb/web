"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  LogOut,
  LayoutDashboard,
  Loader2,
  ShieldCheck,
} from "lucide-react";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Get Current User Session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth"); // Redirect if not logged in
        return;
      }

      // 2. Fetch Profile Details from Database
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/"); // Go to home
    router.refresh(); // Force refresh to update Navbar state
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 1. HEADER & GREETING */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              {profile?.name || "Valued Customer"}
            </h1>
            <p className="text-stone-500 mt-1">
              Manage your account and view your order history.
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-stone-900 font-medium hover:bg-red-50 transition-colors shadow-sm self-start md:self-auto"
            >
              <LogOut className="h-4 w-4" /> Home
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors shadow-sm self-start md:self-auto"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* 2. USER INFO CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <User className="h-10 w-10" />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-stone-800">
                {profile?.name || "Valued Customer"}
              </h2>
              <p className="text-stone-500 flex items-center gap-2 mt-1">
                {profile?.email}
              </p>
              {profile?.role === "admin" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mt-3">
                  <ShieldCheck className="h-3 w-3" /> Administrator
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. QUICK LINKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Dashboard Link (Conditional) */}
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="group bg-indigo-600 p-6 rounded-2xl shadow-md hover:bg-indigo-700 transition-all text-white flex flex-col justify-between h-40"
            >
              <div className="p-3 bg-white/20 rounded-xl w-fit">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Admin Dashboard</h3>
                <p className="text-indigo-100 text-sm">
                  Manage products & orders
                </p>
              </div>
            </Link>
          )}

          {/* Orders Link */}
          <Link
            href="/profile/orders"
            className="group bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-800 group-hover:text-indigo-600">
                My Orders
              </h3>
              <p className="text-stone-500 text-sm">
                Track active & past orders
              </p>
            </div>
          </Link>

          {/* Saved Addresses (Optional Future Page) */}
          <Link
            href="/profile/address"
            className="group bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-800 group-hover:text-indigo-600">
                Saved Addresses
              </h3>
              <p className="text-stone-500 text-sm">Manage in Checkout</p>
            </div>
          </Link>
          
          {/* */}
          <Link
            href="/auth/update-password"
            className="group bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-800 group-hover:text-indigo-600">
                Update Password
              </h3>
              <p className="text-stone-500 text-sm">Change Your Password</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
