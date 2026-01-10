"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { useCartStore } from "@/app/context/CartContext"; // Ensure path is correct
import { Navbar } from "@/components/layout/Navbar";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabaseClient = createClient();

  // Cart Store Hooks
  const { items, addItem, updateQuantity } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false); // For visual feedback

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);

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
  }, [slug]);

  // --- ADD TO CART LOGIC ---
  const handleAddToCart = () => {
    if (!product) return;

    // 1. Find out how many we ALREADY have in the cart
    const existingItem = items.find((item) => item.id === product.id);
    const currentCartQty = existingItem ? existingItem.quantity : 0;

    // 2. Calculate the proposed total
    const proposedTotal = currentCartQty + quantity;

    // 3. CHECK: Does this exceed stock?
    if (proposedTotal > product.stock) {
      // Logic: If they already have some, only let them add the remainder
      const remainingStock = product.stock - currentCartQty;

      if (remainingStock <= 0) {
        alert(
          `You already have all available stock (${product.stock}) in your cart.`
        );
      } else {
        alert(
          `You have ${currentCartQty} in cart. You can only add ${remainingStock} more.`
        );
        // Optional: Automatically adjust the selection to the max possible
        setQuantity(remainingStock);
      }
      return; // STOP execution
    }

    // 4. If Check Passes, Proceed to Add
    if (existingItem) {
      updateQuantity(product.id, proposedTotal);
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
      });
      // If user selected more than 1 initially
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
    }

    // Visual Feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar type="customer" />
        <div className="grow flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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
        <Navbar type="customer" />
        <div className="grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-stone-800">
              Product not found
            </h1>
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar type="customer" />
      <main className="grow container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image Section */}
          <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden shadow-inner border border-stone-200 relative">
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
          <div className="flex flex-col h-full justify-center">
            <div className="mb-2 text-sm font-bold uppercase tracking-wider text-indigo-600">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-stone-900 mb-8">
              ₹{product.price.toFixed(2)}
            </p>

            <div className="prose prose-stone mb-8 max-w-none text-stone-600">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
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

            {/* --- CART ACTIONS --- */}
            <div className="mt-auto pt-6 border-t border-stone-100">
              {product.stock > 0 ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-stone-50 text-stone-600 transition disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 font-bold text-lg w-12 text-center text-stone-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="px-4 py-3 hover:bg-stone-50 text-stone-600 transition disabled:opacity-50"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-grow w-full sm:w-auto py-4 px-8 rounded-lg font-bold text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                      isAdded
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-5 w-5" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" /> Add to Cart — ₹
                        {(product.price * quantity).toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Out of Stock Button */
                <button
                  disabled
                  className="w-full bg-stone-200 text-stone-500 py-4 px-8 rounded-lg font-bold text-lg cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}

              {/* Stock Warning */}
              {product.stock > 0 && product.stock < 10 && (
                <p className="mt-3 text-sm text-red-500 font-medium">
                  Hurry! Only {product.stock} items left in stock.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
