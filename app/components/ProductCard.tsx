"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className={`w-4 h-4 ${star <= Math.floor(rating) ? "text-[#FFC107]" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-500 ml-1 font-medium">{rating}</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: any }) {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();

  const productId = product?.id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      cover: product.image_url || 'https://via.placeholder.com/150'
    });
  };

  if (!productId) return null; 

  return (
    <div 
      className="group/card relative flex flex-col h-full bg-white rounded-[24px] border border-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[1/1] bg-white overflow-hidden p-3">
          <Link href={`/product/${productId}`} className="flex items-center justify-center w-full h-full rounded-[18px] overflow-hidden">
            <img 
              src={product.image_url || "/images/default-book.png"} 
              alt={product.title} 
              className="object-cover w-full h-full group-hover/card:scale-110 transition-transform duration-700 ease-out" 
              draggable="false"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/default-book.png";
              }}
            />
          </Link>

        <div className={`absolute inset-0 z-10 bg-black/10 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${hovered ? "opacity-100" : "opacity-0"}`}>
           <button 
             onClick={handleAddToCart} 
             className="bg-white text-[#5BCDE9] w-14 h-14 rounded-full flex items-center justify-center hover:bg-[#5BCDE9] hover:text-white hover:scale-110 transition-all shadow-xl pointer-events-auto"
             title="Add to Cart"
           >
             <ShoppingCart size={24} />
           </button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <Link href={`/product/${productId}`}>
          <h3 className="text-[18px] font-black text-[#1A2E35] line-clamp-2 leading-tight mb-1 group-hover/card:text-[#5BCDE9] transition-colors tracking-tight">
            {product.title}
          </h3>
        </Link>
        <p className="text-[14px] font-medium text-[#8A9A9D] truncate mb-4">{product.details?.author || t("unknown_author")}</p>
        
        <div className="flex items-center gap-2 mb-6">
           <StarRating rating={5} />
           <span className="text-[12px] font-bold text-gray-400 mt-0.5">5</span>
        </div>

        <div className="mt-auto">
          <span className="text-[26px] font-black text-[#5BCDE9] tracking-tighter">
            {Number(product.price || 0).toFixed(2)} €
          </span>
        </div>
      </div>
    </div>
  );
}