"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react"; // Assuming you have lucide-react, or use simple text
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabaseClient = createClient();

  const [quantity, setQuantity] = useState(1);
  // We only need to store one product, not an array
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;

      setLoading(true);

      // OPTIMIZATION: Fetch only the specific product where slug matches
      // .single() expects exactly one row to be returned
      const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } else {
        setProduct(data);
      }

      setLoading(false);
    }

    fetchProduct();
  }, [slug]); // Dependency array ensures this runs only when 'slug' changes

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="grow flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-stone-500">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Not Found State
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-stone-800">
              Product not found
            </h1>
            <p className="text-stone-500 mb-6">
              The product you are looking for does not exist.
            </p>
            <a
              href="/"
              className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-700 transition"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. Success State
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="grow container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image Section */}
          <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden shadow-inner border border-stone-200">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div>
            <div className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-stone-900 mb-8">
              ₹{product.price.toFixed(2)}
            </p>

            <div className="prose prose-stone mb-8 max-w-none">
              <p className="text-lg text-stone-600 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>

              <div className="mt-6 p-4 bg-stone-50 rounded-lg space-y-3 text-sm border border-stone-100">
                {product.ingredients && (
                  <p>
                    <strong className="text-stone-800">Ingredients:</strong>{" "}
                    {product.ingredients}
                  </p>
                )}

                {product.shelflife && (
                  <p>
                    <strong className="text-stone-800">Shelf Life:</strong>{" "}
                    {product.shelflife}
                  </p>
                )}

                <p>
                  <strong className="text-stone-800">Net Qty:</strong>{" "}
                  {product.quantity}
                </p>
              </div>
            </div>

            {/* Uncomment below when you are ready to implement cart logic */}
            {/* <div className="flex flex-col sm:flex-row gap-4 items-center mt-10">
               <div className="flex items-center border border-stone-300 rounded-lg">
                 <button
                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
                   className="px-4 py-3 hover:bg-stone-100 transition"
                 >
                   −
                 </button>
                 <span className="px-4 font-bold text-lg w-12 text-center">
                   {quantity}
                 </span>
                 <button
                   onClick={() => setQuantity(quantity + 1)}
                   className="px-4 py-3 hover:bg-stone-100 transition"
                 >
                   +
                 </button>
               </div>

               <button
                 className="w-full sm:flex-grow bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                 onClick={() =>
                   alert(`Added ${quantity} ${product.name} to cart!`)
                 }
               >
                 Add to Cart — ₹{(product.price * quantity).toFixed(2)}
               </button>
             </div>  */}
            <div className="w-full flex flex-col sm:flex-row gap-4 items-center mt-10">
              <div className="w-full flex flex-col sm:flex-row gap-4 items-center mt-10">
                <a
                  // Replace 919876543210 with your actual WhatsApp number (include country code)
                  href={`https://wa.me/+917306874286?text=${encodeURIComponent(
                    `Hello, I would like to buy ${
                      product.name
                    } - Price: ₹${(product.price * quantity).toFixed(2)}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:w-[50%] w-full bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg active:scale-95 text-center flex justify-center items-center"
                >
                  Buy Now — ₹{(product.price * quantity).toFixed(2)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
