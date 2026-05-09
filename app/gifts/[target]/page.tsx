"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect, useMemo } from "react";
import { 
  Filter, Star, ShoppingCart, ChevronDown, 
  Search, Book, Loader2, Gift
} from "lucide-react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import { useCart } from "../../context/CartContext"; 
import ProductCard from "../../components/ProductCard";

export default function GiftsTargetPage() {
  const { t } = useLanguage();
  const params = useParams();
  const target = (params?.target as string) || "Gifts";
  
  // Eyalet Yönetimi
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ from: 0, to: 250 });
  const [searchQuery, setSearchQuery] = useState("");

  const displayTitle = target.charAt(0).toUpperCase() + target.slice(1).replace("-", " ");

  const { addToCart } = useCart();

  // 🌟 VERİ ÇEKME (FETCH): 'products' tablosundan Gift kategorisini çekiyoruz
  useEffect(() => {
    const fetchGifts = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', 5); // 🌟 5: Gifts kategorisi

        if (dbError) throw dbError;
        setProducts(data || []);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, []);

  // Sepete Ekleme Fonksiyonu
  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      cover: product.image_url // Veritabanındaki sütun adın
    });
  };

  // Filtreleme Mantığı: Target (women/men vb.) ve Arama
// 🌟 KRİTİK DÜZELTME: Kurşun Geçirmez Filtreleme
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. URL'den gelen hedef (Örn: "women", "men", "gifts", "all")
      const urlTarget = target.toLowerCase();

      // 2. Veritabanındaki hedef. Eğer boşsa, "unisex" veya "all" kabul et.
      // JSONB bazen string (metin) olarak gelebilir, onu da güvenli hale getiriyoruz.
      let dbTarget = "all"; 
      if (product.details && typeof product.details === 'object') {
         dbTarget = (product.details.target || product.details.target_audience || "all").toLowerCase();
      }

      // 3. Eşleşme Mantığı
      // Eğer kullanıcı ana /gifts sayfasındaysa -> Hepsini göster
      // Eğer kullanıcının URL'si ürünün hedefiyle aynıysa -> Göster
      // Eğer ürünün hedefi "all" veya "unisex" ise ve kullanıcı spesifik bir şeye bakmıyorsa -> Göster
      const isMainPage = urlTarget === "gifts" || urlTarget === "all";
      const targetMatch = isMainPage || dbTarget === urlTarget || dbTarget === "all" || dbTarget === "unisex";
      
      // 4. Fiyat ve Arama Filtresi
      const priceMatch = product.price <= priceRange.to;
      const searchMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return targetMatch && priceMatch && searchMatch;
    });
  }, [products, target, priceRange, searchQuery]);
  return (
    <div className="bg-[#F9FBF9] min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="text-[11px] text-gray-400 mb-4 flex items-center gap-2">
            <span>Home</span> <span>/</span> <span>Gifts</span> <span>/</span> <span className="text-gray-600 font-bold">{displayTitle}</span>
          </nav>
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 border border-teal-100">
               <Gift size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] tracking-tight flex items-baseline gap-4 italic uppercase">
                {displayTitle}
                <span className="text-sm font-normal text-gray-400 not-italic lowercase tracking-normal">
                    {loading ? "..." : `${filteredProducts.length} products`}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full md:w-72 space-y-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search in gifts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-300" size={16} />
          </div>

          <section>
            <h3 className="font-bold text-sm text-[#1A2E35] mb-4 border-b border-gray-100 pb-2">Price Range</h3>
            <input 
              type="range" 
              min="0" 
              max="250" 
              value={priceRange.to}
              onChange={(e) => setPriceRange({...priceRange, to: Number(e.target.value)})}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold">
              <span>€0</span>
              <span>€{priceRange.to}</span>
            </div>
          </section>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="animate-spin text-teal-500" size={48} />
               <p className="text-gray-400 animate-pulse">Loading special gifts...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-6 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-2xl">
              <Gift className="mx-auto mb-4 opacity-20" size={48} />
              <p>No gifts found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}