"use client";

import { useEffect, useState } from "react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient";
import { Loader2, Box, PenTool, LayoutGrid, Briefcase, BookCopy, Library, BookOpen, Star, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

interface UnifiedItem {
  id?: string;
  name?: string;
  title?: string;
  price?: number;
  image_url?: string | null;
  subtitle?: string;
  tag?: string;
}

export default function ExploreDynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = params; 
  
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const pageInfo = {
    "all-products": { title: "All Books & Products", icon: <BookOpen className="text-[#C8102E]" size={32} />, isProductView: true },
    authors: { title: "Authors", icon: <PenTool className="text-[#C8102E]" size={32} />, isProductView: false },
    brands: { title: "Brands", icon: <Briefcase className="text-[#C8102E]" size={32} />, isProductView: false },
    magazines: { title: "Magazines", icon: <BookCopy className="text-[#C8102E]" size={32} />, isProductView: true },
    catalogs: { title: "Catalogs", icon: <Library className="text-[#C8102E]" size={32} />, isProductView: true },
    categories: { title: "All Categories", icon: <LayoutGrid className="text-[#C8102E]" size={32} />, isProductView: false },
  }[slug] || { title: "Explore", icon: <Box className="text-[#C8102E]" size={32} />, isProductView: false };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setDebugError(null);
      try {
        if (slug === "all-products") {
          const { data: booksData } = await supabase.from("books").select("*");
          const { data: productsData } = await supabase.from("products").select("*");

          const formattedBooks = (booksData || []).map((b) => ({
            id: b.id,
            title: b.title,
            price: Number(b.price) || 0,
            image_url: b.image_url,
            subtitle: b.author || "Unknown Author",
            tag: b.genre || "Book"
          }));

          const formattedProducts = (productsData || []).map((p) => ({
            id: p.id,
            title: p.title,
            price: Number(p.price) || 0,
            image_url: p.image_url,
            subtitle: "General Product",
            tag: "Product"
          }));

          setItems([...formattedBooks, ...formattedProducts]);

        } else if (slug === "categories") {
          const { data: categoriesData, error } = await supabase.from("categories").select("name");
          if (error) throw error;
          setItems(categoriesData || []);

        } else if (slug === "authors") {
          // 🛡️ ÇİFT TARAFLI GÜVENLİ YAZAR ÇEKİMİ
          let allAuthors: string[] = [];

          // 1. Önce books tablosuna bakıyoruz
          const { data: booksData, error: booksError } = await supabase.from("books").select("author");
          if (!booksError && booksData) {
            allAuthors = [...allAuthors, ...booksData.map(b => b.author)];
          }

          // 2. Belki yazarlar products tablosunda details (json) içindedir diye oraya da bakıyoruz
          const { data: productsData, error: productsError } = await supabase.from("products").select("details");
          if (!productsError && productsData) {
            allAuthors = [...allAuthors, ...productsData.map(p => p.details?.author)];
          }

          // 3. String olmayanları (null, object vb.) çökme yapmaması için güvenle siliyoruz
          const validAuthors = allAuthors
            .map(a => typeof a === 'string' ? a.trim() : "")
            .filter(a => a.length > 0);
          
          const uniqueAuthors = Array.from(new Set(validAuthors)).map(name => ({ name }));
          setItems(uniqueAuthors);

        } else if (slug === "magazines" || slug === "catalogs") {
          const { data: booksData, error } = await supabase.from("books").select("*").ilike("genre", `%${slug}%`);
          if (error) throw error;

          const formattedItems = (booksData || []).map((b) => ({
            id: b.id,
            title: b.title,
            price: Number(b.price) || 0,
            image_url: b.image_url,
            subtitle: b.author || "",
            tag: b.genre || "Reading"
          }));
          
          setItems(formattedItems);

        } else if (slug === "brands") {
          const { data: productsData, error } = await supabase.from("products").select("details");
          if (error) throw error;

          // Çökmeyi engelleyen güvenli brand filtresi
          const allBrands = (productsData || [])
            .map(p => typeof p.details?.brand === 'string' ? p.details.brand.trim() : "")
            .filter(b => b.length > 0);
            
          const uniqueBrands = Array.from(new Set(allBrands)).map(name => ({ name }));
          setItems(uniqueBrands);
        }
      } catch (err: unknown) {
        console.error("Data fetch error:", err);
        setDebugError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleAddToCart = (item: UnifiedItem, e: React.MouseEvent) => {
    e.preventDefault();
    if (!item.id) return;
    
    addToCart({
      id: String(item.id),
      title: item.title || "Unknown Product",
      price: item.price || 0,
      cover: item.image_url || "📚",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-[#C8102E]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Üst Başlık */}
        <div className="flex items-center gap-4 mb-10 border-b border-gray-200 pb-6">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            {pageInfo.icon}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1A2E35]">
            {pageInfo.title}
          </h1>
        </div>

        {/* Hata Yakalama (Ekrana basar ki sorunu görelim) */}
        {debugError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl">
            <strong>Supabase Hatası:</strong> {debugError}
            <p className="text-sm mt-1">Eğer yetki hatası alıyorsanız Supabase paneline gidip 'books' ve 'products' tablolarının RLS (Row Level Security) ayarlarını "Enable read access for all users" olarak güncelleyin.</p>
          </div>
        )}

        {items.length === 0 && !debugError ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">No items found for {pageInfo.title}.</p>
          </div>
        ) : pageInfo.isProductView ? (
          
          /* 🛍️ GÖRÜNÜM A: Ürün Kartı Listesi (All Products, Magazines, Catalogs) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <Link
                href={`/product/${item.id}`}
                key={item.id || idx}
                className="group flex flex-col bg-white border border-gray-100 rounded-xl p-3 hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative aspect-2/3 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">📚</span>
                  )}
                  <button
                    onClick={(e) => handleAddToCart(item, e)}
                    className="absolute bottom-3 right-3 bg-[#C8102E] hover:bg-[#7F0A1A] text-white p-2.5 rounded-full shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-10"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>

                <h4 className="font-bold text-sm text-gray-900 line-clamp-2 h-10">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mb-2 italic">{item.subtitle}</p>

                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[#C8102E] font-black text-base">
                    {(item.price || 0).toFixed(2)} €
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded line-clamp-1">
                    {item.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          
          /* 🏷️ GÖRÜNÜM B: Yuvarlak Baloncuğu Düzeni (Categories, Authors, Brands) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item, idx) => {
              const displayName = item.name || "";
              return (
                <Link 
                  key={idx} 
                  href={`/search?q=${encodeURIComponent(displayName)}`}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#C8102E]/30 hover:shadow-md transition-all group flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
                    <span className="text-xl font-bold text-gray-400 group-hover:text-[#C8102E]">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1A2E35] group-hover:text-[#C8102E] transition-colors line-clamp-2">
                    {displayName}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}