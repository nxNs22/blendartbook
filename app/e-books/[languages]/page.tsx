"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Filter, ShoppingCart, ChevronDown, Loader2, BookOpen } from "lucide-react";
import { useCart } from "../../context/CartContext"; 
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; // 🌟 Supabase bağlantısını ekle
import ProductCard from "../../components/ProductCard";

export default function DigitalCategoryPage() {
  const params = useParams();
  // URL yapına göre 'language' veya 'languages' kontrol et
  const currentLang = (params?.language as string) || (params?.languages as string) || "Unknown";
  
  const [products, setProducts] = useState<any[]>([]); // 🌟 Veritabanından gelen ürünler
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(100);

  const { addToCart } = useCart();

  // 🌟 VERİ ÇEKME (FETCH): Supabase'den E-kitapları çekiyoruz
  useEffect(() => {
    const fetchEBooks = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', 2); // 🌟 2: E-Books kategorisi

        if (dbError) throw dbError;
        setProducts(data || []);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchEBooks();
  }, []);

  // Filtreleme Mantığı: Hem Fiyat hem Dil
  const filteredProducts = products.filter(product => {
    const priceMatch = product.price <= priceRange;
    // details içindeki language URL'deki dille eşleşiyor mu? (Küçük/Büyük harf duyarsız)
    const langMatch = currentLang.toLowerCase() === "all" || 
                     product.details?.language?.toLowerCase() === currentLang.toLowerCase();
    return priceMatch && langMatch;
  });

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      cover: product.image_url // Placeholder yerine gerçek image_url
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-8 bg-gray-50 p-6 rounded-xl h-fit border border-gray-100 shrink-0">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b pb-2 tracking-tight text-gray-800">
          <Filter size={20} className="text-teal-600" /> Digital Filters
        </h3>
        <div className="mb-8">
          <label className="text-sm font-bold text-gray-700 block mb-3">Max Price: €{priceRange}</label>
          <input 
            type="range" min="0" max="250" value={priceRange} 
            onChange={(e) => setPriceRange(Number(e.target.value))} 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <h1 className="text-2xl font-black uppercase italic text-gray-900">
            Digital Library: <span className="text-teal-600 capitalize">{currentLang}</span>
          </h1>
          <p className="text-xs text-gray-400 font-bold">{filteredProducts.length} items available</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={40} /></div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400 bg-white rounded-xl border-2 border-dashed border-gray-100">
             <p>No e-books found for your selection.</p>
          </div>
        )}
      </main>
    </div>
  );
}