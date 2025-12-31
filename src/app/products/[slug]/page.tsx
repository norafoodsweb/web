'use client';

// Note: In Next.js App Router, dynamic pages should be server components if possible for SEO data, 
// but we need interactivity for 'Add to Cart' or we can leave this as Server Component and use Client Component for the button.
// For simplicity and quick prototyping with mock data (mock data is static here), I'll use client or server.
// Since we have 'use client' components nested, server component is fine.
// But we need to find the product based on slug.

import React from 'react';
import Header from "@/components/layout/Header";
import { Product } from '@/types';
import { useParams } from 'next/navigation'; // Only works in Client Components

// Mock Data duplicate (shared source needed in real app)
const products: Product[] = [
    {
        id: "1",
        name: "Golden Turmeric Blend",
        description: "An ancient immunity-boosting recipe passed down through generations. Perfect for golden milk or curries. Made with high-curcumin turmeric, black pepper, and ginger.",
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

// We'll make this a client component to use params easily with static data in this demo context
// For production, use generateStaticParams or fetch data in server component.

export default function ProductDetailPage() {
    // using Client Component hook for simplicity in this specific task context
    const params = useParams();
    const slug = params.slug as string;
    const product = products.find(p => p.slug === slug);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <h1 className="text-2xl">Product not found</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image Gallery Placeholder */}
                    <div className="aspect-square bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 text-xl font-medium">
                        [Image: {product.name}]
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">{product.category}</div>
                        <h1 className="text-4xl font-serif font-bold text-secondary mb-4">{product.name}</h1>
                        <p className="text-2xl font-bold text-stone-900 mb-6">${product.price.toFixed(2)}</p>

                        <div className="prose prose-stone mb-8">
                            <p>{product.description}</p>
                            <p><strong>Ingredients:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.</p>
                            <p><strong>Nutritional Info:</strong> 120 kcal per serving.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
