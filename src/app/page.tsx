'use client';

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import Header from "@/components/layout/Header";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClient();

  async function fetchProducts() {
    const { data, error } = await supabaseClient.from("products").select("*").eq("bestseller", "true");
    if (error) {
      console.log(error);
    } else {
      setProducts(data);
      setLoading(false);
    }
  }

  fetchProducts();
  // Select only the first 3 products from your config file
  const featuredProducts = products;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center bg-stone-100 overflow-hidden">
          {/* Ensure this image exists in your /public folder */}
          <Image
            src="/hero2.jpg"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />{" "}
          {/* Added overlay for better text readability */}
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
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg"
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

        {/* Bestsellers Section (Dynamic) */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-4">
              Bestsellers
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Our customers' favorite treats, made fresh in small batches.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

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
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">
                        Natural Ingredients
                      </h3>
                      <p className="text-stone-600">
                        No preservatives, artificial colors, or additives. Just
                        pure ingredients you'd use in your own kitchen.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">
                        Authentic Recipes
                      </h3>
                      <p className="text-stone-600">
                        Time-honored family recipes perfected over generations
                        to bring you the true taste of tradition.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">
                        Handmade with Love
                      </h3>
                      <p className="text-stone-600">
                        Every batch is made by hand with care, ensuring the
                        highest quality in every bite.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}
