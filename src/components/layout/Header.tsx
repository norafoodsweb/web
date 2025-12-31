'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-100 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-serif font-bold text-primary tracking-tight">
                                Nora
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-sm font-medium text-stone-600 hover:text-primary transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                className="text-sm font-medium text-stone-600 hover:text-primary transition-colors"
                            >
                                Shop
                            </Link>
                            {/* Add more links as needed */}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mobile menu button could go here */}
                    </div>
                </div>
            </div>
        </header>
    );
}
