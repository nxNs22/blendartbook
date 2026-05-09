"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect, useMemo } from "react";
import { Filter, ChevronDown, ShoppingCart, Loader2, Package } from "lucide-react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import { useCart } from "../../context/CartContext";
import ProductCard from "../../components/ProductCard";

export default function OtherProductsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const categoryParam = (params?.category as string) || "all";
  const displayCategory = categoryParam === "all" ? "All Products" : categoryParam.replace("-", " ");

  // Eyalet Yönetimi
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(200);

  const { addToCart } = useCart();

  // 🌟 VERİ ÇEKME (FETCH): YALNIZCA Kategori 4'ü Çekiyoruz
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', 4); // 🌟 KRİTİK DÜZELTME: Sadece Other Products (4) gelsin, Gifts (5) gelmesin!

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

  // Sepete Ekleme Fonksiyonu
  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      cover: product.image_url // Veritabanındaki sütun adı
    });
  };

  // Filtreleme Mantığı: Fiyat ve Alt Kategori (URL'den gelen)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const priceMatch = product.price <= priceRange;
      
      // Eğer URL'de özel bir kategori varsa (Örn: /other-products/mugs) details üzerinden filtrele
      const urlCategory = categoryParam.toLowerCase();
      const dbCategory = (product.details?.category || "").toLowerCase();
      const categoryMatch = urlCategory === "all" || dbCategory === urlCategory;

      return priceMatch && categoryMatch;
    });
  }, [products, priceRange, categoryParam]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 text-gray-800">
      
      {/* SOL TARAF: FİLTRELER */}
      <aside className="w-full md:w-64 bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit shrink-0">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Filter size={18} className="text-red-700" /> {t("properties")}
        </h3>
        
        <div className="mb-8">
          <label className="text-sm font-bold text-gray-700 block mb-3">
            {t("price_up_to")}{priceRange}
          </label>
          <input 
            type="range" 
            min="0" 
            max="500" 
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
        </div>
      </aside>

      {/* SAĞ TARAF: ÜRÜN LİSTESİ */}
      <main className="flex-1">
        <header className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-black uppercase italic flex items-center gap-2">
            <Package size={24} className="text-teal-600" /> 
            {t("browsing")} <span className="text-teal-600 capitalize">{t(displayCategory.toLowerCase().replace(" ", "_")) || displayCategory}</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">{filteredProducts.length} {t("items_found")}</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-teal-600" size={40} />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 border border-red-100 rounded-lg bg-red-50 text-center">
            {t("error_label")} {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Package className="mx-auto mb-4 opacity-20" size={48} />
            <p>{t("no_products_collection")}</p>
          </div>
        )}
      </main>
    </div>
  );
}