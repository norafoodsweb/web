"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Loader2,
} from "lucide-react";
// Ensure this path matches your project structure
import { useCartStore } from "@/app/context/CartContext";

export default function CartPage() {
  const supabase = createClient();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  // --- STATE ---
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // --- EFFECT: HYDRATION & AUTH CHECK ---
  useEffect(() => {
    setIsMounted(true);

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setCheckingAuth(false);
    };

    checkUser();
  }, [supabase]);

  // --- 1. HYDRATION LOADING ---
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // --- 2. EMPTY CART STATE ---
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center max-w-md w-full border border-stone-100">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-stone-500 mb-8">
            Looks like you haven't added any homemade treats yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full shadow-lg shadow-indigo-200"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // --- 3. MAIN CART UI ---
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8">
          Shopping Cart ({items.length} items)
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: ITEMS */}
          <div className="lg:w-2/3 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex gap-4 sm:gap-6 items-center transition-all hover:shadow-md"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-bold text-stone-800 truncate">
                    {item.name}
                  </h3>
                  <p className="text-indigo-600 font-medium">₹{item.price}</p>
                  {/* Optional: Show stock warning if close to limit */}
                  {item.quantity >= (item.stock || 999) && (
                    <p className="text-xs text-red-500 mt-1">
                      Max stock reached
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center bg-stone-50 rounded-lg p-1 border border-stone-200">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-white rounded-md transition-shadow text-stone-600 disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="w-10 text-center font-bold text-sm text-stone-800">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-white rounded-md transition-shadow text-stone-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 sticky top-24">
              <h3 className="text-xl font-bold text-stone-800 mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 border-b border-stone-100 pb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-800">
                    ₹{getTotalPrice()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping Estimate</span>
                  <span className="text-green-600 font-bold uppercase text-xs tracking-wider bg-green-50 px-2 py-1 rounded">
                    Free
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-stone-800">Total</span>
                <span className="text-3xl font-serif font-bold text-indigo-600">
                  ₹{getTotalPrice()}
                </span>
              </div>

              {/* Dynamic Action Button */}
              {checkingAuth ? (
                <button
                  disabled
                  className="w-full bg-stone-200 text-stone-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Loader2 className="animate-spin h-5 w-5" /> Checking...
                </button>
              ) : (
                <Link
                  href={isLoggedIn ? "/checkout" : "/auth?next=/checkout"}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group active:scale-95"
                >
                  {isLoggedIn ? "Proceed to Checkout" : "Log in to Checkout"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              {!isLoggedIn && !checkingAuth && (
                <p className="text-xs text-center text-stone-400 mt-4">
                  You can create an account during the next step.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
