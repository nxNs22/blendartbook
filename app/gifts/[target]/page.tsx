"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect, useMemo } from "react";
import { 
  Filter, ChevronDown, Search, Loader2, Gift
} from "lucide-react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import ProductCard from "../../components/ProductCard";

import { demoGifts } from "../../data/demoProducts";

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

  const displayTitle = target === "all" || target === "gifts"
    ? t("gift_tips") || "Gift Tips"
    : t(target) || target.charAt(0).toUpperCase() + target.slice(1).replace("-", " ");

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

  // Filtreleme Mantığı
  const filteredProducts = useMemo(() => {
    const urlTarget = target.toLowerCase();

    // 1. Database ürünlerini filtrele
    let filtered = products.filter(product => {
      const dbTarget = (product.details?.target || "all").toLowerCase();
      const targetMatch = urlTarget === "all" || urlTarget === "gifts" || dbTarget === urlTarget;
      
      const priceMatch = product.price >= priceRange.from && product.price <= priceRange.to;
      const searchMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());

      return targetMatch && priceMatch && searchMatch;
    });

    // 2. Eğer bu hedef için ürün yoksa demo ürünleri göster
    if (filtered.length === 0 && !loading) {
      filtered = demoGifts.filter(product => {
        const dbTarget = (product.details?.target || "all").toLowerCase();
        const targetMatch = urlTarget === "all" || urlTarget === "gifts" || dbTarget === urlTarget;
        const priceMatch = product.price >= priceRange.from && product.price <= priceRange.to;
        const searchMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        return targetMatch && priceMatch && searchMatch;
      });
    }

    return filtered;
  }, [products, target, priceRange, searchQuery, loading]);

  return (
    <div className="bg-[#F9FBF9] min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="text-[11px] text-gray-400 mb-4 flex items-center gap-2">
            <span>Home</span> <span>/</span> <span>{t("gift_tips") || "Gift Tips"}</span> <span>/</span> <span className="text-gray-600 font-bold">{displayTitle}</span>
          </nav>
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 border border-pink-100 shadow-sm">
               <Gift size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] tracking-tighter flex items-baseline gap-4 italic uppercase">
                {displayTitle}
                <span className="text-sm font-normal text-gray-400 not-italic lowercase tracking-normal">
                    {loading ? "..." : `${filteredProducts.length} ${t("items_found") || "products"}`}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-10">
        
        {/* SOL TARAF: FİLTRELER */}
        <aside className="w-full md:w-80 space-y-8 bg-white p-8 rounded-[32px] h-fit border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search in gifts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5BCDE9] transition-all"
            />
            <Search className="absolute right-4 top-3.5 text-gray-400" size={16} />
          </div>

          <div>
            <h3 className="font-black text-sm mb-6 flex items-center gap-3 border-b pb-4 text-[#1A2E35] tracking-widest uppercase opacity-60">
              <Filter size={16} /> {t("properties") || "Price Range"}
            </h3>

            <div className="mb-8">
              <label className="text-sm font-bold text-[#1A2E35] block mb-4">
                {t("price_up_to") || "Max Price: "}€{priceRange.to}
              </label>
              <input 
                type="range" 
                min="0" 
                max="250" 
                value={priceRange.to}
                onChange={(e) => setPriceRange({...priceRange, to: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5BCDE9]"
              />
              <div className="flex justify-between mt-3 text-[10px] text-gray-400 font-black tracking-widest uppercase">
                <span>€0</span>
                <span>€250</span>
              </div>
            </div>
          </div>
        </aside>

        {/* SAĞ TARAF: LİSTELEME */}
        <main className="flex-1">
          <header className="flex justify-between items-center mb-8 bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-black uppercase text-[#1A2E35] italic tracking-tighter">
                {displayTitle}
              </h1>
              <p className="text-[12px] text-gray-400 font-bold mt-1">
                 {loading ? "..." : `${filteredProducts.length} ${t("items_found") || "products"}`}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[#1A2E35] font-bold cursor-pointer hover:text-[#5BCDE9] transition-colors">
              {t("sort_by_popularity") || "Sort by: Popularity"} <ChevronDown size={16} />
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#5BCDE9]" size={48} />
            </div>
          ) : error ? (
            <div className="text-red-500 p-8 border border-red-100 rounded-3xl bg-red-50 font-bold text-center">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-24 text-gray-400 border-2 border-dashed border-gray-200 rounded-[40px] bg-white">
              <Gift className="mx-auto mb-6 opacity-10" size={64} />
              <p className="text-lg font-bold">{t("no_products_found") || "No gifts found"}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}