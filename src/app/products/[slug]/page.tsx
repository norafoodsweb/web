"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { useParams } from "next/navigation";
// Ensure the import path matches where you saved your products array
import { products } from "@/app/config";

export default function ProductDetailPage() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);

  // useParams returns the dynamic segment from your folder structure, e.g., [slug]
  const slug = params.slug as string;

  // Finding the product from our exported array
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <a href="/" className="text-primary underline">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image Section */}
          <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden shadow-inner border border-stone-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
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
              <p className="text-lg text-stone-600 leading-relaxed">
                {product.description}
              </p>
              <div className="mt-6 p-4 bg-stone-50 rounded-lg space-y-3 text-sm">
                <p>
                  <strong>Ingredients:</strong> Locally sourced premium spices,
                  sea salt, and traditional cold-pressed oils.
                </p>
                <p>
                  <strong>Shelf Life:</strong> 6 months. Keep in a cool, dry
                  place.
                </p>
                <p>
                  <strong>Weight:</strong> 250g Standard Pack.
                </p>
              </div>
            </div>

            {/* Interactive Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-10">
              {/* Quantity Selector */}
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

              {/* Add to Cart Button */}
              <button
                className="w-full sm:flex-grow bg-primary text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg active:scale-95"
                onClick={() =>
                  alert(`Added ${quantity} ${product.name} to cart!`)
                }
              >
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
