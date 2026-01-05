"use client";

import { useState, useEffect } from "react"; // Fixed import (added useEffect)
import Header from "@/components/layout/Header";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
// Optional: Import an icon if you want one inside the ribbon
// import { XCircle } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClient();

  useEffect(() => {
    // Wrapped in useEffect to prevent infinite loop
    async function fetchProducts() {
      const { data, error } = await supabaseClient.from("products").select("*");
      if (error) {
        console.log(error);
      } else {
        setProducts(data);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="grow container mx-auto px-4 py-12">
        {/* Add a loading state */}
        {loading && (
          <p className="text-center text-stone-500">Loading products...</p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 items-start">
          {!loading &&
            products.map((product) => {
              // Helper boolean for cleaner JSX
              // Assuming 'stock' is a number column in your Supabase DB
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  // Added conditional opacity if out of stock
                  className={`group relative bg-white rounded-xl shadow-sm transition-all duration-300 overflow-hidden border border-stone-100 ${
                    isOutOfStock
                      ? "opacity-75 hover:shadow-none"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="aspect-square relative overflow-hidden bg-stone-50">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        // Added grayscale effect if out of stock
                        className={`object-cover object-center transition-transform duration-500 ${
                          isOutOfStock
                            ? "grayscale group-hover:scale-100"
                            : "group-hover:scale-105"
                        }`}
                      />
                    )}

                    {/* --- OUT OF STOCK RIBBON START --- */}
                    {isOutOfStock && (
                      <div className="absolute top-0 left-0 z-20 overflow-hidden w-28 h-28 pointer-events-none">
                        {/* This div creates the rotated ribbon effect */}
                        <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider text-center py-1.5 w-[140%] -ml-[20%] mt-7 -rotate-45 shadow-md">
                          Out of Stock
                        </div>
                      </div>
                    )}
                    {/* --- OUT OF STOCK RIBBON END --- */}
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="text-lg font-serif font-medium text-secondary">
                      {/* Disable link if out of stock (optional but recommended) */}
                      {isOutOfStock ? (
                        <span className="text-stone-500">{product.name}</span>
                      ) : (
                        <a href={`/products/${product.slug}`}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.name}
                        </a>
                      )}
                    </h3>
                    <p className="text-sm text-stone-600 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <p
                        className={`text-lg font-semibold ${
                          isOutOfStock
                            ? "text-stone-400 line-through"
                            : "text-primary"
                        }`}
                      >
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}
