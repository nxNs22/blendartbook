"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { ChevronLeft, ChevronRight, Loader2, CalendarHeart } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "./ProductCard";

export default function MonthlySet() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchMonthlySet = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order('stock', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        setProducts(data || []);
      } catch (err: unknown) {
        console.error("Monthly Set Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlySet();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth;
    carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!loading && products.length === 0) return null;
  const gridAlignment = products.length < 6 ? "justify-center" : "justify-start";

  return (
    <section className="py-16 bg-teal-50/30 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <CalendarHeart size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">{t("book_set_of_month")}</h2>
              <p className="text-gray-500 mt-1 text-sm font-medium">{t("carefully_selected")}</p>
            </div>
          </div>
          {!loading && products.length > 6 && (
            <div className="flex items-center gap-2">
              <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white shadow-sm text-gray-600 hover:bg-teal-600 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
              <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white shadow-sm text-gray-600 hover:bg-teal-600 hover:text-white transition-colors"><ChevronRight size={24} /></button>
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
              className={`flex items-stretch gap-6 ${gridAlignment} overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-8 ${isDragging ? 'cursor-grabbing active:cursor-grabbing' : 'cursor-grab'}`}
            >
              {products.map((product) => (
                <div key={product.id} className="flex-none flex w-[calc(60%-12px)] sm:w-[calc(40%-16px)] md:w-[calc(33.333%-16px)] lg:w-[calc(16.666%-20px)] snap-start select-none">
                  <div className={`w-full h-full ${isDragging ? "pointer-events-none" : ""}`}>
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