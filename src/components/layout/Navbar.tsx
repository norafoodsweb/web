"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react"; // 1. Added useEffect
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Settings,
  LogOut,
  LogIn, // 2. Added LogIn icon
  Menu,
  Store,
  Home,
  BookOpen,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { User } from "@supabase/supabase-js"; // Type definition

// --- Configuration ---
const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const customerLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingCart },
  { href: "/about", label: "Our Story", icon: BookOpen },
  { href: "/contact", label: "Contact", icon: Phone },
];

interface NavbarProps {
  type: "admin" | "customer";
}

export function Navbar({ type }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  // 3. New State: Track the logged-in user
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const links = type === "admin" ? adminLinks : customerLinks;

  // 4. Check Authentication on Mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    };

    getUser();

    // Optional: Listen for auth changes (e.g. if they log out in another tab)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Clear state immediately for UI responsiveness
    router.replace("/auth");
    setOpen(false); // Close mobile menu if open
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 1. LOGO */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link
              href={type === "admin" ? "/admin" : "/"}
              className="flex items-center gap-2 font-serif font-bold text-xl text-indigo-600"
            >
              <Store className="w-6 h-6" />
              <span>{type === "admin" ? "Nora Admin" : "Nora"}</span>
            </Link>
          </div>

          {/* 2. DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-indigo-600",
                    isActive ? "text-indigo-600" : "text-slate-600"
                  )}
                >
                  {isActive && <Icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              );
            })}

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {/* 5. Desktop Auth Logic */}
            {!loadingAuth &&
              (user ? (
                // IF LOGGED IN: Show Logout
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                // IF LOGGED OUT: Show Sign In
                <Link href="/auth">
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              ))}
          </div>

          {/* 3. MOBILE MENU TRIGGER */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-600">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-72 bg-white p-0">
                <div className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Navigation</SheetDescription>
                </div>

                <div className="h-full flex flex-col">
                  {/* Mobile Header */}
                  <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <span className="font-serif font-bold text-xl text-indigo-600">
                      Menu
                    </span>
                  </div>

                  {/* Mobile Links List */}
                  <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>

                  {/* 6. Mobile Auth Logic */}
                  <div className="p-4 border-t border-slate-100">
                    {!loadingAuth &&
                      (user ? (
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      ) : (
                        <Link href="/auth" onClick={() => setOpen(false)}>
                          <Button className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white">
                            <LogIn className="w-4 h-4 mr-2" />
                            Sign In
                          </Button>
                        </Link>
                      ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
