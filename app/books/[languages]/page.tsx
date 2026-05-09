"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useMemo, useEffect } from "react";
import { Filter, Star, ShoppingCart, ChevronDown, Loader2 } from "lucide-react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import { useCart } from "../../context/CartContext"; 
import ProductCard from "../../components/ProductCard";

export default function BooksByLanguage() {
  const { t } = useLanguage();
  const params = useParams();
  const currentLanguage = (params?.languages as string) || "";

  // Eyalet Yönetimi
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(100);

  const { addToCart } = useCart();

  // 🌟 VERİ ÇEKME (FETCH): Yeni mimariye göre düzenlendi
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('products') // Tekil tablo
          .select('*')
          .eq('category_id', 1); // 1: Kitaplar

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

  // Sepete Ekleme
  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      cover: product.image_url // Veritabanındaki sütun adın
    });
  };

  // Filtreleme Mantığı (Dil ve Fiyat)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Dil kontrolü: details içindeki language veya URL'deki dile göre
      const langMatch = product.details?.language?.toLowerCase() === currentLanguage.toLowerCase();
      const priceMatch = product.price <= priceRange;
      return langMatch && priceMatch;
    });
  }, [products, currentLanguage, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      
      {/* SOL TARAF: FİLTRELER */}
      <aside className="w-full md:w-64 space-y-8 bg-gray-50 p-6 rounded-xl h-fit border border-gray-100">
        <div>
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b pb-2 text-gray-800">
            <Filter size={20} className="text-red-700" /> {t("properties")}
          </h3>

          <div className="mb-8">
            <label className="text-sm font-bold text-gray-700 block mb-3">
              {t("price_up_to")}{priceRange}
            </label>
            <input 
              type="range" 
              min="0" 
              max="250" 
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>
        </div>
      </aside>

      {/* SAĞ TARAF: LİSTELEME */}
      <main className="flex-1">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-black uppercase text-gray-900 italic">
              {t(currentLanguage.toLowerCase()) || currentLanguage} {t("Books".toLowerCase()) || "Books"}
            </h1>
            <p className="text-xs text-gray-500 font-medium">{filteredProducts.length} {t("items_found")}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 font-bold cursor-pointer">
            {t("sort_by_popularity")} <ChevronDown size={16} />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-teal-600" size={40} />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 border border-red-100 rounded-lg bg-red-50">
            Error loading products: {error}
          </div>
        ) : (
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
    {filteredProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>{t("no_products_found")}</p>
          </div>
        )}
      </main>
    </div>
  );
}