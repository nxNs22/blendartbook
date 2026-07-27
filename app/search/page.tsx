"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { supabase, getErrorMessage } from "../lib/supabaseClient";
import { Star, ShoppingCart, Filter } from "lucide-react";
import { useCart } from "../context/CartContext";

interface Book {
  id: string | number;
  title: string;
  author: string;
  price: number;
  genre?: string;
  category?: string;
  image?: string;
  stock?: number;
  language?: string;
}

// Local kitap verisi (fallback)
const LOCAL_BOOKS: Book[] = [];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Kategori adı var mı kontrol et
  const isCategory = LOCAL_BOOKS.some(
    (book) => book.category?.toLowerCase() === query.toLowerCase()
  );
  
  const [filterType, setFilterType] = useState<"all" | "title" | "author" | "genre">(
    isCategory ? "genre" : "all"
  );
  const [priceRange, setPriceRange] = useState(1000);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const searchBooks = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let allResults: Book[] = [];

        // Önce Supabase'den ara
        try {
          let productsResults: any[] = [];

          if (filterType === "title") {
            const { data: pData } = await supabase.from("products").select("*").ilike("title", `%${query}%`).lte("price", priceRange);
            productsResults = pData || [];
          } else if (filterType === "author") {
            const { data: pData } = await supabase.from("products").select("*").ilike("details->>author", `%${query}%`).lte("price", priceRange);
            productsResults = pData || [];
          } else if (filterType === "genre") {
            const { data: pData } = await supabase.from("products").select("*").or(`category.ilike.%${query}%,subcategory.ilike.%${query}%,details->>genre.ilike.%${query}%`).lte("price", priceRange);
            productsResults = pData || [];
          } else {
            // Tümü: title, author ve genre'de ara
            const { data: p1 } = await supabase.from("products").select("*").ilike("title", `%${query}%`).lte("price", priceRange);
            const { data: p2 } = await supabase.from("products").select("*").ilike("details->>author", `%${query}%`).lte("price", priceRange);
            const { data: p3 } = await supabase.from("products").select("*").or(`category.ilike.%${query}%,subcategory.ilike.%${query}%,details->>genre.ilike.%${query}%`).lte("price", priceRange);

            productsResults = [...(p1 || []), ...(p2 || []), ...(p3 || [])];
          }

          // Map products to standard UI structure
          const formattedProducts = productsResults.map(p => ({
            ...p,
            author: p.details?.author || "General Product"
          }));

          allResults = formattedProducts;

          // Tekrarlananları kaldır
          allResults = Array.from(
            new Map(allResults.map((item) => [item.id, item])).values()
          );
        } catch (supabaseError) {
          console.log("Supabase search başarısız, local veri kullanılıyor:", supabaseError);
        }

        // Local veride de ara
        const localSearchResults = LOCAL_BOOKS.filter((book) => {
          const matchesPrice = book.price <= priceRange;
          const titleMatch = book.title.toLowerCase().includes(query.toLowerCase());
          const authorMatch = book.author.toLowerCase().includes(query.toLowerCase());
          const categoryMatch = (book.category || "").toLowerCase().includes(query.toLowerCase());

          if (filterType === "title") {
            return matchesPrice && titleMatch;
          } else if (filterType === "author") {
            return matchesPrice && authorMatch;
          } else if (filterType === "genre") {
            return matchesPrice && categoryMatch;
          } else {
            // Tümü
            return matchesPrice && (titleMatch || authorMatch || categoryMatch);
          }
        });

        // Supabase ve local sonuçları birleştir, tekrarlananları kaldır
        const combinedResults = [...allResults, ...localSearchResults];
        const uniqueResults = Array.from(
          new Map(
            combinedResults.map((item) => [
              `${item.title}-${item.author}`.toLowerCase(),
              item,
            ])
          ).values()
        );

        setResults(uniqueResults);
      } catch (err: unknown) {
        console.error("Search error:", err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    searchBooks();
  }, [query, filterType, priceRange]);

  const handleAddToCart = (book: Book, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: String(book.id),
      title: book.title,
      price: book.price,
      cover: book.image || "📚",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Arama Sonuçları
          </h1>
          {query && (
            <p className="text-gray-600">
              &quot;{query}&quot; için <span className="font-bold text-teal-600">{results.length}</span> sonuç bulundu
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        {/* FİLTRELER */}
        <aside className="w-full md:w-64 space-y-6 bg-white p-6 rounded-xl border border-gray-200 h-fit">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Filter size={20} className="text-teal-600" /> Filtreler
            </h3>
          </div>

          {/* Arama Türü */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Ara
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Tümü</option>
              <option value="title">Kitap Adı</option>
              <option value="author">Yazar</option>
              <option value="genre">Kategori</option>
            </select>
          </div>

          {/* Fiyat Aralığı */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Fiyat Aralığı: 0 - {priceRange} €
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </aside>

        {/* SONUÇLAR */}
        <main className="flex-1">
          {loading && (
            <div className="text-center py-12">
              <p className="text-teal-600 text-lg">Aranıyor...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Hata: {error}</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && query && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-600 text-lg">
                &quot;{query}&quot; için sonuç bulunamadı. Lütfen farklı bir terim deneyin.
              </p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((book) => (
                <div
                  key={`${book.id}-${book.title}`}
                  className="group flex flex-col bg-white border border-gray-100 rounded-xl p-3 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Kitap Kapağı */}
                  <div className="relative aspect-2/3 rounded-lg overflow-hidden mb-4 bg-linear-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                    <span className="text-6xl">
                      {book.category === "Bilim Kurgu" ? "🚀" : book.category === "Tarih" ? "🏛️" : "📚"}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(book, e)}
                      className="absolute bottom-3 right-3 bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-full shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                      title="Add to Cart"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>

                  {/* Kitap Bilgileri */}
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-2 h-10">
                    {book.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2 italic">{book.author}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Fiyat ve Kategori */}
                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-teal-700 font-black text-base">
                      {book.price} €
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded">
                      {book.category || "Genel"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SearchPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-gray-500">Arama hazırlanıyor...</p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}
