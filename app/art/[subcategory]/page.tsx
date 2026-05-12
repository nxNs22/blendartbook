"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect, useMemo } from "react";
import { Search, Loader2, Palette, Paintbrush, Box, Music, Scissors } from "lucide-react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import ProductCard from "../../components/ProductCard";
import { demoArt } from "../../data/demoProducts";

export default function ArtCategoryPage() {
  const { t } = useLanguage();
  const params = useParams();
  const subcategory = (params?.subcategory as string) || "art";
  
  // Eyalet Yönetimi (State)
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sol Sidebar Filtreleri
  const [priceRange, setPriceRange] = useState({ from: 0, to: 500 }); 
  const [searchQuery, setSearchQuery] = useState("");

  const displayTitle = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace("-", " ");

  // 🌟 VERİ ÇEKME: Artık 'subcategory' sütunu aramıyor, sadece ID'si 6 olan (Art) tüm ürünleri çekiyor
  useEffect(() => {
    const fetchArtProducts = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', 6); // Sadece Art kategorisini çek (Hata veren .eq("subcategory"...) kısmını sildik!)

        if (dbError) throw dbError;
        setProducts(data || []);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchArtProducts();
  }, []);

  // 🌟 KURŞUN GEÇİRMEZ FİLTRELEME (Gifts mantığı)
  const filteredProducts = useMemo(() => {
    const isMainPage = subcategory.toLowerCase() === "art";
    const targetSub = subcategory.toLowerCase();

    // 1. Database ürünlerini filtrele
    let filtered = products.filter(product => {
      const detailsType = (product.details?.type || product.details?.subcategory || "").toLowerCase();
      const titleLower = (product.title || "").toLowerCase();
      const subcategoryMatch = isMainPage || detailsType === targetSub || titleLower.includes(targetSub);
      
      const priceMatch = product.price <= priceRange.to;
      const searchMatch = titleLower.includes(searchQuery.toLowerCase());
      
      return subcategoryMatch && priceMatch && searchMatch;
    });

    // 2. Eğer bu kategori için ürün yoksa demo ürünleri göster
    if (filtered.length === 0 && !loading) {
      let demoList: any[] = [];
      if (isMainPage) {
        demoList = [...demoArt.painting, ...demoArt.sculpture, ...demoArt.music, ...demoArt.crafts];
      } else {
        demoList = (demoArt as any)[targetSub] || [];
      }

      filtered = demoList.filter(product => {
        const titleLower = (product.title || "").toLowerCase();
        const priceMatch = product.price <= priceRange.to;
        const searchMatch = titleLower.includes(searchQuery.toLowerCase());
        return priceMatch && searchMatch;
      });
    }

    return filtered;
  }, [products, subcategory, priceRange, searchQuery, loading]);

  // Dinamik İkon Belirleme
  const getSubcategoryIcon = () => {
    const sub = subcategory.toLowerCase();
    if (sub === "painting") return <Paintbrush size={32} />;
    if (sub === "sculpture") return <Box size={32} />;
    if (sub === "music") return <Music size={32} />;
    if (sub === "crafts") return <Scissors size={32} />;
    return <Palette size={32} />;
  };

  return (
    <div className="bg-[#F9FBF9] min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="text-[11px] text-gray-400 mb-4 flex items-center gap-2">
            <span>Home</span> <span>/</span> <span>Art</span> <span>/</span> <span className="text-gray-600 font-bold">{displayTitle}</span>
          </nav>
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 border border-teal-100">
               {getSubcategoryIcon()}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] tracking-tight flex items-baseline gap-4 italic uppercase">
                {displayTitle}
                <span className="text-sm font-normal text-gray-400 not-italic lowercase tracking-normal">
                    {loading ? "..." : `${filteredProducts.length} items`}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full md:w-80 space-y-10 bg-white p-8 rounded-[32px] h-fit border border-gray-100 shadow-xl shadow-gray-200/50">
          <div>
            <h3 className="font-black text-sm mb-6 flex items-center gap-3 border-b pb-4 text-[#1A2E35] tracking-widest uppercase opacity-60">
               <Search size={16} /> {t("search_placeholder")}
            </h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder={`Search in ${displayTitle.toLowerCase()}...`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
              <Search className="absolute right-3 top-3.5 text-gray-300" size={16} />
            </div>
          </div>

          <section>
            <h3 className="font-black text-sm mb-6 flex items-center gap-3 border-b pb-4 text-[#1A2E35] tracking-widest uppercase opacity-60">
              {t("price_up_to")}{priceRange.to}
            </h3>
            <input 
              type="range" 
              min="0" 
              max="500" 
              value={priceRange.to}
              onChange={(e) => setPriceRange({...priceRange, to: Number(e.target.value)})}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between mt-3 text-[10px] text-gray-400 font-black tracking-widest uppercase">
              <span>€0</span>
              <span>€500</span>
            </div>
          </section>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="animate-spin text-teal-500" size={48} />
               <p className="text-gray-400 animate-pulse">Loading amazing art pieces...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-6 rounded-xl border border-red-100 text-center">
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
            <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-2xl bg-white">
              <Palette className="mx-auto mb-4 opacity-20" size={48} />
              <p>No products found matching your search.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}