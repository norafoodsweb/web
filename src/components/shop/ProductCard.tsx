"use client";

import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-stone-100">
      <div className="aspect-square relative overflow-hidden bg-stone-50">
        {/* Placeholder for actual image. In real app, use product.image */}
        {/* <div className="absolute inset-0 bg-stone-200 flex items-center justify-center text-stone-400">
          [Image: {product.name}]
        </div> */}
        {
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        }

        {/* Tag Position (e.g. New, Bestseller) could go here */}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-serif font-medium text-secondary">
          <a href={`/products/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </a>
        </h3>
        <p className="text-sm text-stone-600 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-semibold text-primary">
            ₹{product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
