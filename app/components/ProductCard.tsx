"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
    });
  };

  return (
    <Link 
      href={`/product/${product.id}`} 
      className="group flex flex-col bg-white border border-gray-100 rounded-xl p-4 hover:shadow-2xl transition-all duration-300 cursor-pointer w-full h-full"
    >
      <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden mb-4 bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image_url || "https://via.placeholder.com/150x220?text=Gorsel+Yok"} 
          alt={product.title} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
        />
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
      
      <div className="flex flex-col flex-grow">
        <h4 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">{product.title}</h4>
        
        <p className="text-xs text-gray-500 mb-3 italic line-clamp-1">
            {product.details?.author || "Bilinmiyor"}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span className="text-lg font-extrabold text-teal-600">${product.price?.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}