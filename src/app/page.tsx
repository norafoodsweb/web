"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

// COMPONENTS
import ProductCard from "@/components/shop/ProductCard";
import Footer from "@/components/layout/Footer";
// 1. UPDATED IMPORT: Use the responsive Navbar
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClient();

  // 2. Fetch Logic (Unchanged)
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("bestseller", "true");

      if (error) {
        console.log(error);
      } else {
        setProducts(data);
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const featuredProducts = products;

  return (
    // 3. Simplified Layout Container
    <div className="min-h-screen bg-background flex flex-col">
      {/* --- A. RESPONSIVE NAVBAR --- */}
      {/* Handles both Desktop Topbar and Mobile Hamburger */}
      <Navbar type="customer" />

      {/* --- B. MAIN CONTENT --- */}
      {/* No 'md:pl-72' needed anymore */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center bg-stone-100 overflow-hidden">
          <Image
            src="/hero2.jpg"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl text-white font-serif font-bold mb-6 leading-tight drop-shadow-md">
              Authentic Homemade <br /> Goodness
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto font-light drop-shadow-sm">
              Handcrafted snacks and culinary powders made with love and
              traditional recipes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-full text-white bg-transparent hover:bg-white/10 transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-4">
              Bestsellers
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Our customers' favorite treats, made fresh in small batches.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-stone-500">Loading bestsellers...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 decoration-2"
            >
              View All Products
            </Link>
          </div>
        </section>

        {/* Why Choose Nora Section */}
        <section id="about" className="py-20 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                {/* Ensure image path is correct */}
                <Image
                  src="/images/ingredients.jpg"
                  alt="Natural Ingredients"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-6">
                  Why Choose Nora?
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">
                        Natural Ingredients
                      </h3>
                      <p className="text-stone-600">
                        No preservatives, artificial colors, or additives.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">
                        Authentic Recipes
                      </h3>
                      <p className="text-stone-600">
                        Traditional recipes handed down through generations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">
                        Made with Love
                      </h3>
                      <p className="text-stone-600">
                        Handcrafted in small batches for premium quality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
