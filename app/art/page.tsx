"use client";

import { useLanguage } from "../context/LanguageContext";
import { useState, useMemo, useEffect } from "react";
import { Filter, ChevronDown, Loader2, Palette } from "lucide-react";
import { supabase, getErrorMessage } from "../lib/supabaseClient"; 
import ProductCard from "../components/ProductCard";

export default function ArtPage() {
  const { t } = useLanguage();

  // Eyalet Yönetimi
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(500);

  // 🌟 VERİ ÇEKME
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', 6); // Art ID

        if (dbError) throw dbError;
        setProducts(data || []);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtreleme Mantığı
  const filteredProducts = useMemo(() => {
    let list = products;
    
    // 🌟 FALLBACK: Eğer DB boşsa demo ürünleri göster
    if (list.length === 0 && !loading) {
      list = [
        {
          id: 'demo-paint-1',
          title: "Ocean Breeze Acrylic",
          price: 120.00,
          image_url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1976&auto=format&fit=crop",
          details: { author: "Elena Rossi", type: "painting" }
        },
        {
          id: 'demo-paint-2',
          title: "Abstract Sunset Canvas",
          price: 155.00,
          image_url: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1974&auto=format&fit=crop",
          details: { author: "Marco V.", type: "painting" }
        },
        {
          id: 'demo-sculpt-1',
          title: "Modern Marble Torso",
          price: 450.00,
          image_url: "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=2070&auto=format&fit=crop",
          details: { author: "Luca S.", type: "sculpture" }
        },
        {
          id: 'demo-music-1',
          title: "Vintage Vinyl Records Set",
          price: 85.00,
          image_url: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1924&auto=format&fit=crop",
          details: { author: "Jazz Collectibles", type: "music" }
        }
      ];
    }

    return list.filter(product => {
      const priceMatch = product.price <= priceRange;
      return priceMatch;
    });
  }, [products, priceRange, loading]);

  return (
    <div className="bg-[#F9FBF9] min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="text-[11px] text-gray-400 mb-4 flex items-center gap-2">
            <span>Home</span> <span>/</span> <span className="text-gray-600 font-bold">{t("art")}</span>
          </nav>
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 border border-teal-100 shadow-sm">
               <Palette size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] tracking-tighter flex items-baseline gap-4 italic uppercase">
                {t("art")}
                <span className="text-sm font-normal text-gray-400 not-italic lowercase tracking-normal">
                    {loading ? "..." : `${filteredProducts.length} ${t("items_found")}`}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-10">
        
        {/* SOL TARAF: FİLTRELER */}
        <aside className="w-full md:w-80 space-y-8 bg-white p-8 rounded-[32px] h-fit border border-gray-100 shadow-xl shadow-gray-200/50">
          <div>
            <h3 className="font-black text-sm mb-6 flex items-center gap-3 border-b pb-4 text-[#1A2E35] tracking-widest uppercase opacity-60">
              <Filter size={16} /> {t("properties")}
            </h3>

            <div className="mb-8">
              <label className="text-sm font-bold text-[#1A2E35] block mb-4">
                {t("price_up_to")}€{priceRange}
              </label>
              <input 
                type="range" 
                min="0" 
                max="500" 
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between mt-3 text-[10px] text-gray-400 font-black tracking-widest uppercase">
                <span>€0</span>
                <span>€500</span>
              </div>
            </div>
          </div>
        </aside>

        {/* SAĞ TARAF: LİSTELEME */}
        <main className="flex-1">
          <header className="flex justify-between items-center mb-8 bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-black uppercase text-[#1A2E35] italic tracking-tighter">
                {t("art")}
              </h1>
              <p className="text-[12px] text-gray-400 font-bold mt-1">
                 {loading ? "..." : `${filteredProducts.length} ${t("items_found")}`}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[#1A2E35] font-bold cursor-pointer hover:text-teal-500 transition-colors">
              {t("sort_by_popularity")} <ChevronDown size={16} />
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-teal-500" size={48} />
            </div>
          ) : error ? (
            <div className="text-red-500 p-8 border border-red-100 rounded-3xl bg-red-50 font-bold text-center">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-24 text-gray-400 border-2 border-dashed border-gray-200 rounded-[40px] bg-white">
              <Palette className="mx-auto mb-6 opacity-10" size={64} />
              <p className="text-lg font-bold">{t("no_products_found")}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
