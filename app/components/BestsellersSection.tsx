"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2, TrendingUp, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { supabase, getErrorMessage } from "../lib/supabaseClient";
import { useCart } from "../context/CartContext"; 

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

export default function BestsellersSection() {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { addToCart } = useCart(); 

  const handleAddToCart = (book: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      cover: book.image_url || 'https://via.placeholder.com/150' 
    });
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from('collection_products')
          .select('products ( * )')
          .eq('collection_id', 2) 
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;
        
        const cleanBooks = data?.map((item: any) => {
          const p = Array.isArray(item.products) ? item.products[0] : item.products;
          return p;
        }).filter(Boolean) || [];

        setBooks(cleanBooks);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
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

  if (!loading && books.length === 0) return null;
  const gridAlignment = books.length < 5 ? "justify-center" : "justify-start";

  return (
    <section className="py-16 bg-gray-50 border-b border-gray-100" id="bestsellers-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white shadow-sm text-teal-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-teal-900 uppercase tracking-tight">Bestsellers</h2>
              <p className="text-teal-600/80 mt-1 text-sm font-medium">Most loved books by our readers</p>
            </div>
          </div>
          {!loading && books.length > 4 && (
            <div className="flex items-center gap-2">
              <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white shadow-sm text-gray-600 hover:bg-teal-600 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
              <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white shadow-sm text-gray-600 hover:bg-teal-600 hover:text-white transition-colors"><ChevronRight size={24} /></button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-10 h-10 animate-spin text-teal-600" /></div>
        ) : error ? (
          <p className="text-red-500 text-center py-10">Error: {error}</p>
        ) : (
          <div className="relative overflow-hidden group">
            <div 
              ref={carouselRef}
              onMouseDown={handleMouseDown} 
              onMouseLeave={handleMouseLeave} 
              onMouseUp={handleMouseUp} 
              onMouseMove={handleMouseMove}
              className={`flex gap-4 md:gap-6 ${gridAlignment} overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4 ${isDragging ? 'cursor-grabbing active:cursor-grabbing' : 'cursor-grab'}`}
            >
              {books.map((book) => (
                <div key={book.id} className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(16.666%-20px)] snap-start select-none">
                  {/* Tıklamaların linkleri tetiklemesi için isDragging kontrolü burada da yapılıyor */}
                  <div
                    className={`group relative hover:-translate-y-1 transition-transform duration-300 rounded-xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl ${isDragging ? "pointer-events-none" : ""}`}
                    onMouseEnter={() => setHoveredBook(book.id)}
                    onMouseLeave={() => setHoveredBook(null)}
                  >
                    {book.stock < 30 && (
                      <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                        Only {book.stock} left!
                      </div>
                    )}

                    <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                      {/* LİNK: Artık kartın içini doğrudan kapsıyor */}
                      <Link href={`/product/${book.id}`} className="block w-full h-full">
                        {book.image_url ? (
                          <img src={book.image_url} alt={book.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" draggable="false" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">📚</div>
                        )}
                      </Link>

                      <div className={`absolute inset-0 z-10 bg-teal-900/60 flex items-center justify-center gap-2 transition-opacity duration-300 pointer-events-none ${hoveredBook === book.id ? "opacity-100" : "opacity-0"}`}>
                        <button onClick={(e) => handleAddToCart(book, e)} className="bg-white text-teal-700 p-3 rounded-full hover:bg-teal-50 hover:scale-110 transition-all shadow-lg pointer-events-auto" title="Add to Cart">
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <Link href={`/product/${book.id}`}>
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-teal-600 transition-colors">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mt-1 mb-1 truncate">{book.details?.author || 'Unknown Author'}</p>
                      <StarRating rating={5} />
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-base font-black text-teal-700">{Number(book.price || 0).toFixed(2)} €</span>
                      </div>
                    </div>

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