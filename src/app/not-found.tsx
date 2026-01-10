import Link from "next/link";
import { Home, Store } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-nora-beige flex flex-col items-center justify-center p-4 text-center">
      {/* 1. Brand Header */}
      <div className="mb-8 animate-in fade-in zoom-in duration-500">
        <div className="flex items-center justify-center gap-3 text-primary mb-2">
          <Store className="w-10 h-10" />
          <h1 className="font-serif font-bold text-4xl tracking-tight">Nora</h1>
        </div>
        <p className="text-secondary font-medium tracking-wide uppercase text-xs">
          Authentic Homemade Goodness
        </p>
      </div>

      {/* 2. 404 Content */}
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-primary/10">
        <h2 className="text-8xl font-serif font-bold text-primary/20 mb-6">
          404
        </h2>

        <h3 className="text-2xl font-bold text-secondary mb-3">
          Page Not Found
        </h3>

        <p className="text-stone-500 mb-8 leading-relaxed">
          It looks like the page you are looking for has been moved or doesn't
          exist. Don't worry, the kitchen is still open!
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-primary hover:bg-[#3d5635] text-nora-beige font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
        >
          <Home className="w-5 h-5" />
          Return to Home
        </Link>
      </div>

      {/* 3. Footer Decor */}
      <div className="mt-12 opacity-40">
        <p className="text-stone-400 text-sm">
          Lost? Give us a call at +91 73068 74286
        </p>
      </div>
    </div>
  );
}
