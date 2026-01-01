"use client";

import { useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import Header from "@/components/layout/Header";
import { products } from "@/app/config";

// Define a type for our valid categories based on the config data
type CategoryFilter = "all" | "Pickles" | "Powders" | "Snacks" | "Salted";

export default function ShopPage() {
  const [filter, setFilter] = useState<CategoryFilter>("all");

  // Filter logic: matches the category string exactly as it appears in config.ts
  const filteredProducts = products.filter((product) =>
    filter === "all" ? true : product.category === filter
  );

  // Helper to render filter buttons consistently
  const FilterButton = ({
    label,
    value,
  }: {
    label: string;
    value: CategoryFilter;
  }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        filter === value
          ? "bg-primary text-white shadow-md"
          : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
            Our Collection
          </h1>
          <p className="text-stone-500 max-w-2xl">
            Discover authentic flavors delivered from our kitchen to your
            doorstep. From spicy pickles to aromatic spice blends.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-10 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          <FilterButton label="All Products" value="all" />
          <FilterButton label="Pickles" value="Pickles" />
          <FilterButton label="Masala Powders" value="Powders" />
          <FilterButton label="Traditional Snacks" value="Snacks" />
          <FilterButton label="Salted Treats" value="Salted" />
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-stone-200 rounded-2xl">
            <p className="text-stone-400">
              No products found in this category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
