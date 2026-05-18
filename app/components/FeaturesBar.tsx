"use client";

import Link from "next/link";
import { 
  BookOpen, 
  LayoutGrid, 
  PenTool, 
  Briefcase, 
  BookCopy, 
  Library, 
  Palette,
  Gift
} from "lucide-react";

export default function FeaturesBar() {
  const quickLinks = [
    { name: "All Products", icon: <BookOpen size={24} />, href: "/explore/all-products" },
    { name: "Categories", icon: <LayoutGrid size={24} />, href: "/explore/categories" },
    { name: "Authors", icon: <PenTool size={24} />, href: "/explore/authors" },
    { name: "Brands", icon: <Briefcase size={24} />, href: "/explore/brands" },
    { name: "Magazines", icon: <BookCopy size={24} />, href: "/explore/magazines" },
    { name: "Catalogs", icon: <Library size={24} />, href: "/explore/catalogs" },

  ];

  return (
    <div className="w-full bg-white border-b border-gray-100 py-6 md:py-8 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobilde sağa kaydırılabilir, masaüstünde ortalanmış esnek yapı */}
        <div className="flex items-center justify-start md:justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-4 md:pb-2">
          {quickLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[100px] gap-3 text-[#1A2E35] hover:text-[#C8102E] transition-colors group"
            >
              {/* Yuvarlak İkon Alanı */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center group-hover:bg-red-50 group-hover:border-red-100 group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md text-gray-600 group-hover:text-[#C8102E]">
                {link.icon}
              </div>
              {/* Alt Metin */}
              <span className="text-[11px] md:text-xs font-bold text-center uppercase tracking-widest">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}