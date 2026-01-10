// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { Menu } from "lucide-react";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"; // Import shadcn components

// export default function Header() {
//   const [isOpen, setIsOpen] = useState(false);

//   // Helper to close the sheet when a link is clicked
//   const closeSheet = () => setIsOpen(false);

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-stone-100 bg-white/80 backdrop-blur-md">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           {/* --- LOGO --- */}
//           <div className="flex items-center gap-8">
//             <Link href="/" className="flex items-center gap-2">
//               <span className="text-2xl font-serif font-bold text-nora-green tracking-tight">
//                 Nora
//               </span>
//             </Link>

//             {/* --- DESKTOP NAV --- */}
//             <nav className="hidden md:flex items-center gap-6">
//               <Link
//                 href="/shop"
//                 className="text-sm font-medium text-stone-600 hover:text-yellow-800 transition-colors"
//               >
//                 Shop
//               </Link>
//               <Link
//                 href="/about"
//                 className="text-sm font-medium text-stone-600 hover:text-yellow-800 transition-colors"
//               >
//                 About
//               </Link>
//             </nav>
//           </div>

//           {/* --- MOBILE HAMBURGER (SHADCN SHEET) --- */}
//           <div className="md:hidden">
//             <Sheet open={isOpen} onOpenChange={setIsOpen}>
//               <SheetTrigger asChild>
//                 <button
//                   className="p-2 text-stone-600 hover:bg-stone-100 rounded-md transition outline-none"
//                   aria-label="Toggle Menu"
//                 >
//                   <Menu size={24} />
//                 </button>
//               </SheetTrigger>

//               <SheetContent side="left" className="w-[300px] sm:w-[350px]">
//                 <SheetHeader>
//                   <SheetTitle className="text-left font-serif font-bold text-2xl text-indigo-600">
//                     Nora
//                   </SheetTitle>
//                 </SheetHeader>

//                 {/* Mobile Links */}
//                 <div className="flex flex-col gap-6 mt-8">
//                   <Link
//                     href="/"
//                     onClick={closeSheet}
//                     className="text-lg font-medium text-stone-700 hover:text-indigo-600 transition-colors"
//                   >
//                     Home
//                   </Link>
//                   <Link
//                     href="/shop"
//                     onClick={closeSheet}
//                     className="text-lg font-medium text-stone-700 hover:text-indigo-600 transition-colors"
//                   >
//                     Shop
//                   </Link>
//                   <Link
//                     href="/about"
//                     onClick={closeSheet}
//                     className="text-lg font-medium text-stone-700 hover:text-indigo-600 transition-colors"
//                   >
//                     About
//                   </Link>
//                   <Link
//                     href="/contact"
//                     onClick={closeSheet}
//                     className="text-lg font-medium text-stone-700 hover:text-indigo-600 transition-colors"
//                   >
//                     Contact
//                   </Link>
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
