"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/app/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Settings,
  LogOut,
  LogIn,
  Menu,
  Store,
  Home,
  BookOpen,
  Phone,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { User } from "@supabase/supabase-js";

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
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/#about", label: "Our Story", icon: BookOpen },
  { href: "/#contact", label: "Contact", icon: Phone },
];

interface NavbarProps {
  type: "admin" | "customer";
}

export function Navbar({ type }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Cart Store Hook
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  const links = type === "admin" ? adminLinks : customerLinks;

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Calculate Cart Count
  const cartCount = mounted
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/auth");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-nora-beige/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* 1. LOGO */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link
              href={type === "admin" ? "/admin" : "/"}
              className="flex items-center gap-2 font-serif font-bold text-2xl text-primary hover:text-primary/80 transition-colors"
            >
              <Store className="w-7 h-7" />
              <span>{type === "admin" ? "Nora Admin" : "Nora"}</span>
            </Link>
          </div>

          {/* 2. DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-bold transition-all hover:text-primary",
                    isActive
                      ? "text-primary border-b-2 border-primary pb-0.5"
                      : "text-stone-500"
                  )}
                >
                  {isActive && <Icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              );
            })}

            <div className="h-6 w-px bg-stone-300 mx-2" />

            {/* 3. CART ICON (Only for customers) */}
            {type === "customer" && (
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-stone-600 hover:text-primary hover:bg-primary/5"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-nora-beige border-2 border-nora-beige transform translate-x-1 -translate-y-1">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* 4. Desktop Auth Logic */}
            {!loadingAuth &&
              (user ? (
                // IF LOGGED IN: Show My Orders & Logout
                <div className="flex items-center gap-2">
                  {type === "customer" && (
                    <Link href="/profile/orders">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-stone-600 font-medium hover:text-primary hover:bg-primary/5"
                      >
                        My Orders
                      </Button>
                    </Link>
                  )}
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-stone-600 font-medium hover:text-primary hover:bg-primary/5"
                    >
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-stone-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                // IF LOGGED OUT: Show Sign In
                <Link href="/auth">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-[#3d5635] text-nora-beige font-bold shadow-sm"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              ))}
          </div>

          {/* 5. MOBILE MENU TRIGGER */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Cart Icon */}
            {type === "customer" && (
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-stone-600 hover:text-primary"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-nora-beige border-2 border-nora-beige transform translate-x-1 -translate-y-1">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-stone-600 hover:text-primary"
                >
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-72 bg-nora-beige border-r-primary/10 p-0"
              >
                <div className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Navigation</SheetDescription>
                </div>

                <div className="h-full flex flex-col">
                  {/* Mobile Header */}
                  <div className="h-20 flex items-center px-6 border-b border-primary/10 bg-white/50">
                    <span className="font-serif font-bold text-2xl text-primary flex items-center gap-2">
                      <Store className="w-6 h-6" /> Nora
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
                            "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all",
                            isActive
                              ? "bg-primary/10 text-primary shadow-sm border border-primary/5"
                              : "text-stone-600 hover:bg-white hover:text-primary hover:shadow-sm"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-5 h-5",
                              isActive ? "text-primary" : "text-stone-400"
                            )}
                          />
                          {link.label}
                        </Link>
                      );
                    })}

                    {/* Mobile "My Orders" Link (Only if logged in) */}
                    {user && type === "customer" && (
                      <Link
                        href="/profile/orders"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-stone-600 hover:bg-white hover:text-primary transition-all hover:shadow-sm"
                      >
                        <Package className="w-5 h-5 text-stone-400" />
                        My Orders
                      </Link>
                    )}
                    {user && type === "customer" && (
                      <Link href="/profile">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-4 px-4 py-3.5 ml-1.5 rounded-xl text-sm font-bold text-stone-600 hover:bg-white hover:text-primary transition-all hover:shadow-sm"
                        >
                          <UserRound className="w-5 h-5 text-stone-400" />
                          Profile
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Mobile Auth Logic */}
                  <div className="p-6 border-t border-primary/10 bg-white/50">
                    {!loadingAuth &&
                      (user ? (
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="w-full justify-start text-stone-500 hover:text-red-600 hover:bg-red-50 gap-3 font-medium"
                        >
                          <LogOut className="w-5 h-5" />
                          Sign Out
                        </Button>
                      ) : (
                        <Link href="/auth" onClick={() => setOpen(false)}>
                          <Button className="w-full justify-start bg-primary hover:bg-[#3d5635] text-nora-beige font-bold h-12 rounded-xl shadow-md">
                            <LogIn className="w-5 h-5 mr-3" />
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
