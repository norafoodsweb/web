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
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  Store,
  Home,
  BookOpen,
  Phone,
} from "lucide-react";

// --- 1. Define Links for Both Roles ---
const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package }, // Adjust route if your admin page is just /admin
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const customerLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop Products", icon: ShoppingCart },
  { href: "/about", label: "Our Story", icon: BookOpen },
  { href: "/contact", label: "Contact Us", icon: Phone },
];

interface SidebarProps {
  type: "admin" | "customer";
}

// --- 2. Nav Content Component ---
function NavContent({
  type,
  setOpen,
}: {
  type: "admin" | "customer";
  setOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Select links based on type
  const links = type === "admin" ? adminLinks : customerLinks;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-900 border-r border-slate-200">
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-white">
        <Link
          href="/"
          className="flex items-center gap-2 font-serif font-bold text-xl tracking-tight text-indigo-600"
        >
          <Store className="w-6 h-6" />
          <span>{type === "admin" ? "Nora Admin" : "Nora"}</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/" && pathname?.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen?.(false)}
              className="block"
            >
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

// --- 3. Exported Sidebar Components ---

export function Sidebar({ type }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 z-30">
      <NavContent type={type} />
    </aside>
  );
}

export function MobileSidebar({ type }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-600 hover:text-indigo-600"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="p-0 w-72 bg-[#f8fafc] border-r-slate-200"
      >
        <div className="sr-only">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navigation</SheetDescription>
        </div>
        <NavContent type={type} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
