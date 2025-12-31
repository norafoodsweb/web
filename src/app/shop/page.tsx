"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import Header from "@/components/layout/Header";
import { Product } from "@/types";

// Mock Data (Ideally fetch from API/DB)
const products: Product[] = [
    {
        id: "1",
        name: "Golden Turmeric Blend",
        description: "An ancient immunity-boosting recipe passed down through generations.",
        price: 12.99,
        image: "/images/turmeric.jpg",
        category: "powder",
        slug: "golden-turmeric-blend",
    },
    {
        id: "2",
        name: "Spicy Chakli Mix",
        description: "Crunchy, savory, and perfectly spiced.",
        price: 8.50,
        image: "/images/chakli.jpg",
        category: "snack",
        slug: "spicy-chakli-mix",
    },
    {
        id: "3",
        name: "Homemade Garam Masala",
        description: "Aromatic blend of roasted whole spices.",
        price: 14.00,
        image: "/images/garam-masala.jpg",
        category: "powder",
        slug: "homemade-garam-masala",
    },
    {
        id: "4",
        name: "Sweet Potato Chips",
        description: "Thinly sliced, crispy sweet potatoes seasoned with sea salt.",
        price: 6.00,
        image: "/images/chips.jpg",
        category: "snack",
        slug: "sweet-potato-chips",
    },
    {
        id: "5",
        name: "Coriander Powder",
        description: "Freshly ground coriander seeds for vibrant flavor.",
        price: 5.50,
        image: "/images/coriander.jpg",
        category: "powder",
        slug: "coriander-powder",
    },
];

export default function ShopPage() {
    const [filter, setFilter] = useState<'all' | 'snack' | 'powder'>('all');

    const filteredProducts = products.filter(product =>
        filter === 'all' ? true : product.category === filter
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <h1 className="text-4xl font-serif font-bold text-secondary mb-8">Shop All Products</h1>

                {/* Filter */}
                <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('snack')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'snack'
                                ? 'bg-primary text-white'
                                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                    >
                        Snacks
                    </button>
                    <button
                        onClick={() => setFilter('powder')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'powder'
                                ? 'bg-primary text-white'
                                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                    >
                        Powders
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
        </div>
    );
}
