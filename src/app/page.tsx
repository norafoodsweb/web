"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

// COMPONENTS
import ProductCard from "@/components/shop/ProductCard";
import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
// Icons
import {
  Leaf,
  Award,
  Heart,
  ShieldCheck,
  Users,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClient();

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
    <div className="min-h-screen bg-nora-beige flex flex-col font-sans text-foreground">
      <Navbar type="customer" />

      <main className="flex-grow">
        {/* --- 1. HERO SECTION --- */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <Image
            src="/hero2.jpg"
            alt="Nora Homemade Foods"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay: Darkened slightly with a green tint for brand cohesion */}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl text-nora-beige font-serif font-bold mb-6 leading-tight drop-shadow-lg">
              Authentic Homemade <br /> Goodness
            </h1>
            <p className="text-xl md:text-2xl text-stone-100 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
              Handcrafted snacks and culinary powders made with love, tradition,
              and natural ingredients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-primary hover:bg-[#3d5635] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Shop Now
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-nora-beige text-base font-bold rounded-full text-nora-beige bg-transparent hover:bg-nora-beige/10 transition-all"
              >
                Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* --- 2. BESTSELLERS SECTION --- */}
        <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-nora-beige">
          <div className="text-center mb-16">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-3 block">
              Customer Favorites
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Bestsellers
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              The tastes that bring you home. Made fresh in small batches.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/products"
              className="inline-block border-b-2 border-secondary text-secondary font-bold hover:text-primary hover:border-primary transition-colors pb-1"
            >
              View All Products
            </Link>
          </div>
        </section>

        {/* --- 3. OUR STORY & COMMUNITY SECTION --- */}
        <section id="about" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Top Row: Story & Community */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center mb-24">
              {/* Left: The Story */}
              <div>
                <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block text-shadow-sm">
                  The Journey
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-8">
                  From Our Kitchen <br /> to Yours
                </h2>
                <div className="prose prose-lg text-stone-600 leading-relaxed space-y-6">
                  <p>
                    What began as a personal journey to turn quiet moments into
                    something meaningful has blossomed into Nora. We started
                    this venture not just to fill leisure time, but to fulfill a
                    creative passion: the art of making authentic, wholesome
                    food.
                  </p>
                  <p>
                    Driven by a desire to contribute positively to society, we
                    turned our kitchen into a workshop of flavors. What started
                    as a spark of creativity is now a government-registered
                    small-scale enterprise, dedicated to bringing the nostalgic
                    taste of home back to your dining table.
                  </p>
                </div>
              </div>

              {/* Right: Kudumbashree Card */}
              <div className="bg-nora-beige p-8 md:p-12 rounded-[2rem] border border-primary/10 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mb-8 shadow-sm">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-4 font-serif">
                    Empowered by Community
                  </h3>
                  <p className="text-stone-600 mb-8 leading-relaxed">
                    We are proud to be a{" "}
                    <strong>Kudumbashree-supported unit</strong>. Receiving
                    legal and promotional backing from Kudumbashree was a
                    turning point that transformed a home passion project into a
                    professional endeavor.
                  </p>
                  <div className="flex items-center gap-3 text-sm font-bold text-primary bg-white px-5 py-3 rounded-full w-fit shadow-sm border border-primary/10">
                    <ShieldCheck className="w-5 h-5" />
                    Govt. Registered Enterprise
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: What We Offer Grid */}
            <div className="text-center mb-12">
              <h3 className="text-3xl font-serif font-bold text-secondary">
                Our Specialties
              </h3>
              <p className="text-stone-500 mt-3 text-lg">
                Categories crafted with absolute care
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: Pickles (Green Theme) */}
              <div className="bg-nora-beige p-8 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300 text-center group">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Leaf className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">Pickles</h4>
                <p className="text-stone-600 leading-relaxed">
                  Spicy, tangy, and preserved with natural ingredients for that
                  authentic kick.
                </p>
              </div>

              {/* Card 2: Masala (Brown Theme) */}
              <div className="bg-nora-beige p-8 rounded-3xl border border-transparent hover:border-secondary/20 hover:bg-white hover:shadow-xl transition-all duration-300 text-center group">
                <div className="w-20 h-20 mx-auto bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Award className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-bold text-secondary mb-3">
                  Masala & Spices
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  The secret to a perfect curry, ground to perfection using
                  premium spices.
                </p>
              </div>

              {/* Card 3: Snacks (Yellow Theme) */}
              <div className="bg-nora-beige p-8 rounded-3xl border border-transparent hover:border-accent/50 hover:bg-white hover:shadow-xl transition-all duration-300 text-center group">
                <div className="w-20 h-20 mx-auto bg-accent/20 rounded-full flex items-center justify-center text-[#d4a017] mb-6 group-hover:bg-accent group-hover:text-secondary transition-colors">
                  <Heart className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-bold text-stone-800 mb-3">
                  Snacks
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  Crunchy salted and fried delicacies made for your tea-time
                  cravings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. WHY CHOOSE NORA --- */}
        <section id="features" className="py-24 bg-nora-beige">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/images/ingredients.jpg"
                  alt="Natural Ingredients"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
                  The Nora Standard
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-8">
                  Why Choose Nora?
                </h2>
                <div className="space-y-8">
                  {/* Feature 1 */}
                  <div className="flex gap-6 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent flex items-center justify-center text-secondary font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                        Natural Ingredients
                      </h3>
                      <p className="text-stone-600 leading-relaxed">
                        No Illegal preservatives, artificial colors, or additives. Just
                        pure goodness straight from nature.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex gap-6 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent flex items-center justify-center text-secondary font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                        Authentic Recipes
                      </h3>
                      <p className="text-stone-600 leading-relaxed">
                        Traditional recipes handed down through generations,
                        preserving the true taste of Kerala.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex gap-6 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent flex items-center justify-center text-secondary font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                        Made with Love
                      </h3>
                      <p className="text-stone-600 leading-relaxed">
                        Handcrafted in small batches to ensure every packet
                        meets our premium quality standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. CONTACT & OFFICIAL DETAILS SECTION --- */}
        {/* Background changed to Brand Primary (Green) for a strong finish */}
        <section id="contact" className="py-20 bg-primary text-nora-beige">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
              {/* Left: Business Details */}
              <div>
                <h2 className="text-4xl font-serif font-bold text-white mb-2">
                  Nora Foods
                </h2>
                <p className="text-lg mb-10 leading-relaxed text-primary-foreground/80">
                  East Pandikkad, Kudumbasree ME Unit,
                  <br /> Pandikkad.
                </p>

                <div className="space-y-4 max-w-md">
                  {/* License Badges */}
                  <div className="p-4 rounded-2xl bg-[#3d5635] border border-white/10 flex items-center gap-5 hover:bg-[#354b2e] transition-colors">
                    <div className="bg-white/10 p-3 rounded-full text-accent">
                      <FileCheck size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-1">
                        FSSAI License
                      </p>
                      <p className="text-white font-mono font-medium text-lg tracking-wide">
                        21324222000021
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#3d5635] border border-white/10 flex items-center gap-5 hover:bg-[#354b2e] transition-colors">
                    <div className="bg-white/10 p-3 rounded-full text-accent">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-1">
                        Udyam Registration
                      </p>
                      <p className="text-white font-mono font-medium text-lg tracking-wide">
                        KL-09-0067515
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Contact & Socials */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    Get in Touch
                  </h3>
                  <div className="space-y-6 mb-12">
                    <div className="flex items-center gap-5 group">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-medium hover:text-accent transition-colors cursor-pointer">
                        +91 73068 74286
                      </span>
                    </div>
                    <div className="flex items-center gap-5 group">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
                        <Mail className="h-5 w-5" />
                      </div>
                      <a
                        href="mailto:norafoods@gmail.com"
                        className="text-lg font-medium hover:text-accent transition-colors"
                      >
                        norafoodsweb@gmail.com
                      </a>
                    </div>
                    <div className="flex items-start gap-5 group">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mt-1 group-hover:bg-accent group-hover:text-primary transition-all shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="text-lg hover:text-accent transition-colors leading-relaxed">
                        East Pandikkad, Malappuram Dist,
                        <br /> Kerala - 676522
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-6">
                    Connect on Social Media
                  </h4>
                  <div className="flex gap-4">
                    <a
                      href="https://wa.me/+917306874286"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-[#25D366] text-white rounded-full hover:scale-110 hover:-translate-y-1 transition-all shadow-lg"
                      title="WhatsApp"
                    >
                      <MessageCircle size={24} />
                    </a>
                    <a
                      href="#"
                      className="p-4 bg-[#1877F2] text-white rounded-full hover:scale-110 hover:-translate-y-1 transition-all shadow-lg"
                      title="Facebook"
                    >
                      <Facebook size={24} />
                    </a>
                    <a
                      href="https://www.instagram.com/nora._.foods/"
                      className="p-4 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-full hover:scale-110 hover:-translate-y-1 transition-all shadow-lg"
                      title="Instagram"
                    >
                      <Instagram size={24} />
                    </a>
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
