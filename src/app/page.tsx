import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import Header from "@/components/layout/Header";
import { Product } from "@/types";
import Image from "next/image";

// Mock Data
const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Golden Turmeric Blend",
    description: "An ancient immunity-boosting recipe passed down through generations. Perfect for golden milk or curries.",
    price: 12.99,
    image: "/images/turmeric.jpg",
    category: "powder",
    slug: "golden-turmeric-blend",
  },
  {
    id: "2",
    name: "Spicy Chakli Mix",
    description: "Crunchy, savory, and perfectly spiced. A traditional tea-time favorite made with rice flour and gram flour.",
    price: 8.50,
    image: "/images/chakli.jpg",
    category: "snack",
    slug: "spicy-chakli-mix",
  },
  {
    id: "3",
    name: "Homemade Garam Masala",
    description: "Aromatic blend of roasted whole spices. Adds a rich, authentic flavor to any dish.",
    price: 14.00,
    image: "/images/garam-masala.jpg",
    category: "powder",
    slug: "homemade-garam-masala",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center bg-stone-100 overflow-hidden">
          <Image src="/hero2.jpg" alt="Hero" fill className="object-cover" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl text-white font-serif font-bold text-nora-green mb-6 leading-tight drop-shadow-sm">
              Authentic Homemade <br /> Goodness
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto font-light">
              Handcrafted snacks and culinary powders made with love and traditional recipes.
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
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-base font-medium rounded-full text-primary bg-transparent hover:bg-primary/5 transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-4">Bestsellers</h2>
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
            <Link href="/shop" className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 decoration-2">
              View All Products
            </Link>
          </div>
        </section>

        {/* Why Choose Nora Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Image src="/images/ingredients.jpg" alt="Natural Ingredients" width={600} height={600} className="w-full h-full object-cover" />
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-6">Why Choose Nora?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-nora-beige flex items-center justify-center text-primary font-bold text-xl">1</div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">Natural Ingredients</h3>
                      <p className="text-stone-600">No preservatives, artificial colors, or additives. Just pure, wholesome ingredients you'd use in your own kitchen.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-nora-beige flex items-center justify-center text-primary font-bold text-xl">2</div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">Authentic Recipes</h3>
                      <p className="text-stone-600">We rely on time-honored family recipes that have been perfected over generations to bring you the true taste of tradition.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-nora-beige flex items-center justify-center text-primary font-bold text-xl">3</div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">Handmade with Love</h3>
                      <p className="text-stone-600">Every batch is made by hand with care and attention to detail, ensuring the highest quality in every bite.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary text-nora-beige py-12 text-center">
        <p>&copy; {new Date().getFullYear()} Nora. All rights reserved.</p>
      </footer>
    </div>
  );
}
