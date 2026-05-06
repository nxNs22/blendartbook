"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2, Globe } from "lucide-react";
import { supabase } from "../lib/supabaseClient"; 
import ProductCard from "./ProductCard";

export default function WorldLiterature() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchWorldLiterature = async () => {
      setLoading(true);
      try {
        // İleride Supabase'den sadece dünya edebiyatı olanları çektirebilirsin.
        // Örn: .eq("subcategory", "world-literature")
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq('category_id', 1) 
          .limit(12);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("World Lit Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorldLiterature();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth;
    carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
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
    const walk = (e.pageX - carouselRef.current.offsetLeft - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 text-emerald-600 rounded-lg">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-teal-900 uppercase tracking-tight">
                World Literature
              </h2>
              <p className="text-gray-500 mt-1 text-sm">Timeless classics from around the globe</p>
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
        ) : (
          <div className="relative overflow-hidden group">
            <div 
              ref={carouselRef}
              onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
              className={`flex gap-6 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden pb-8 ${isDragging ? 'cursor-grabbing active:cursor-grabbing' : 'cursor-grab'}`}
            >
              {products.map((product) => (
                <div key={product.id} className="flex-none w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(16.666%-20px)] snap-start select-none">
                  <div className={isDragging ? "pointer-events-none" : ""}>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}