"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Filter, ShoppingCart, ChevronDown, Loader2, Mic2, Clock } from "lucide-react";
import { useCart } from "../../context/CartContext"; 
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import ProductCard from "../../components/ProductCard";

export default function AudiobookCategoryPage() {
  const params = useParams();
  // URL parametresini hem 'language' hem 'languages' olarak kontrol ediyoruz
  const currentLang = (params?.language as string) || (params?.languages as string) || "Unknown";
  
  // State Yönetimi
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(150);

  const { addToCart } = useCart();

  // 🌟 VERİ ÇEKME (FETCH): Supabase'den Audiobooks (ID: 3) çekiyoruz
  useEffect(() => {
    const fetchAudiobooks = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', 3); // 🌟 3: Audiobooks kategorisi

        if (dbError) throw dbError;
        setProducts(data || []);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobooks();
  }, []);

  // 🔍 Filtreleme Mantığı: Dil ve Fiyat
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const priceMatch = product.price <= priceRange;
      const langMatch = currentLang.toLowerCase() === "all" || 
                       product.details?.language?.toLowerCase() === currentLang.toLowerCase();
      return priceMatch && langMatch;
    });
  }, [products, currentLang, priceRange]);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      cover: product.image_url // Gerçek görsel URL'si
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-8 bg-gray-50 p-6 rounded-xl h-fit border border-gray-100 shrink-0">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b pb-2 tracking-tight text-gray-800">
          <Filter size={20} className="text-red-700" /> Audio Filters
        </h3>
        <div className="mb-8">
          <label className="text-sm font-bold text-gray-700 block mb-3 italic">
            Max Price: €{priceRange}
          </label>
          <input 
            type="range" min="0" max="300" value={priceRange} 
            onChange={(e) => setPriceRange(Number(e.target.value))} 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <h1 className="text-2xl font-black uppercase italic text-gray-900">
            Audio Library: <span className="text-emerald-600 capitalize">{currentLang}</span>
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            {loading ? "Syncing..." : `${filteredProducts.length} Audiobooks`}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="text-sm text-gray-400 animate-pulse">Tuning frequencies...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <Mic2 className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-medium">No audiobooks found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}