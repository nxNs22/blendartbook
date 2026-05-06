"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2, Sparkles, ShoppingCart } from "lucide-react";
import { supabase } from "../lib/supabaseClient"; 
import { useCart } from "../context/CartContext";

// 🌟 GÖRSELDEKİ YILDIZ TASARIMI İÇİN YARDIMCI BİLEŞEN
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating) ? "text-[#FFC107]" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-500 ml-1 font-medium">{rating}</span>
    </div>
  );
}

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  
  // Sürükle-Kaydır Eyaletleri
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchNewProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false }) 
          .limit(12);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("New Arrivals Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      cover: product.image_url || 'https://via.placeholder.com/150'
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* BAŞLIK VE OKLAR */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                New Arrivals
              </h2>
              <p className="text-gray-500 mt-1 text-sm">Freshly added to our collection</p>
            </div>
          </div>

          {!loading && products.length > 0 && (
            <div className="flex items-center gap-2">
              <button onClick={() => scroll('left')} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-teal-600 hover:text-white transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button onClick={() => scroll('right')} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-teal-600 hover:text-white transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-10 h-10 animate-spin text-teal-600" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">No new products available right now.</div>
        ) : (
          <div className="relative overflow-hidden group">
            <div 
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex gap-6 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-8 ${isDragging ? 'cursor-grabbing active:cursor-grabbing' : 'cursor-grab'}`}
            >
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex-none w-[calc(60%-12px)] sm:w-[calc(40%-16px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-20px)] snap-start select-none"
                >
                  {/* 🌟 İSTEDİĞİN ÖZEL KART TASARIMI BURADA BAŞLIYOR */}
                  <div 
                    className={`group/card relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden ${isDragging ? "pointer-events-none" : ""}`}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Üst Kısım: Geniş Gri Arka Plan ve Resim */}
                    <div className="relative aspect-[4/5] bg-[#F8F9FA] flex items-center justify-center p-6 overflow-hidden">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.title} 
                          className="object-contain w-full h-full drop-shadow-md group-hover/card:scale-105 transition-transform duration-500" 
                          draggable="false"
                        />
                      ) : (
                        <span className="text-6xl group-hover/card:scale-105 transition-transform duration-300">📚</span>
                      )}

                      {/* Sepete Ekle Butonu (Görseli bozmamak için üzerine gelince hafifçe belirir) */}
                      <div className={`absolute inset-0 bg-black/5 flex items-center justify-center transition-opacity duration-300 ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}>
                         <button 
                           onClick={(e) => handleAddToCart(product, e)} 
                           className="bg-white text-teal-700 w-12 h-12 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white hover:scale-110 transition-all shadow-lg"
                           title="Add to Cart"
                         >
                           <ShoppingCart size={20} />
                         </button>
                      </div>
                    </div>

                    {/* Alt Kısım: Beyaz Arka Plan ve Metinler */}
                    <div className="p-5 flex flex-col flex-1 bg-white">
                      <h3 className="text-[17px] font-bold text-[#1A2E35] line-clamp-2 leading-snug mb-1">
                        {product.title}
                      </h3>
                      <p className="text-[15px] text-[#8A9A9D] truncate mb-2">
                        {product.details?.author || 'Unknown Author'}
                      </p>
                      
                      <StarRating rating={5} />
                      
                      <div className="mt-auto pt-4">
                        <span className="text-[22px] font-black text-teal-700 tracking-tight">
                          {product.price} €
                        </span>
                      </div>
                    </div>

                  </div>
                  {/* KART TASARIMI BİTİŞ */}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}