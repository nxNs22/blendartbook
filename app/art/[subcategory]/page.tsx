"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Search, Loader2, Palette } from "lucide-react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import ProductCard from "../../components/ProductCard";

export default function ArtCategoryPage() {
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
    return products.filter(product => {
      // 1. Alt Kategori Eşleşmesi (Eğer detaylarda "type" olarak girdiysen oradan, yoksa isminden yakalar)
      const isMainPage = subcategory.toLowerCase() === "art";
      
      const detailsType = (product.details?.type || product.details?.subcategory || "").toLowerCase();
      const titleLower = product.title.toLowerCase();
      const targetSub = subcategory.toLowerCase();
      
      // Eğer ana Art sayfasıysa hepsini göster, değilse detaya veya başlığa bak
      const subcategoryMatch = isMainPage || detailsType === targetSub || titleLower.includes(targetSub);

      // 2. Fiyat ve Arama Filtresi
      const priceMatch = product.price <= priceRange.to;
      const searchMatch = titleLower.includes(searchQuery.toLowerCase());
      
      return subcategoryMatch && priceMatch && searchMatch;
    });
  }, [products, subcategory, priceRange, searchQuery]);

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
               <Palette size={32} />
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
        <aside className="w-full md:w-72 space-y-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder={`Search in ${displayTitle.toLowerCase()}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-300" size={16} />
          </div>

          <section>
            <h3 className="font-bold text-sm text-[#1A2E35] mb-4 border-b border-gray-100 pb-2">Price: up to €{priceRange.to}</h3>
            <input 
              type="range" 
              min="0" 
              max="500" 
              value={priceRange.to}
              onChange={(e) => setPriceRange({...priceRange, to: Number(e.target.value)})}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold">
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