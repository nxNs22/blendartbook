"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect, useMemo } from "react";
import { 
  Filter, ChevronDown, Search, Loader2, Gift
} from "lucide-react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import ProductCard from "../../components/ProductCard";
import CategoryChips from "../../components/CategoryChips";
import FilterSidebar from "../../components/FilterSidebar";
import ListControls from "../../components/ListControls";
import { useSidebarFilters } from "../../hooks/useSidebarFilters";

const GIFT_CATEGORIES = [
  "For Her", "For Him", "For Kids", "Anniversary", "Birthday", 
  "Wedding", "Graduation", "Valentine's Day", "Corporate", "Romantic"
];

export default function GiftsTargetPage() {
  const { t } = useLanguage();
  const params = useParams();
  const target = (params?.target as string) || "Gifts";
  
  // Eyalet Yönetimi
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    priceRange, setPriceRange,
    selectedBindings, setSelectedBindings,
    selectedAvailabilities, setSelectedAvailabilities,
    selectedTags, setSelectedTags,
    dateRange, setDateRange,
    sortOption, setSortOption,
    currentPage, setCurrentPage,
    itemsPerPage,
    filterProducts,
    sortProducts,
    paginateProducts,
    normalizeText
  } = useSidebarFilters();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
          .eq('category', 'gift'); // Gifts

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

  const getGiftKeywords = (category: string): string[] => {
    const cat = category.toLowerCase();
    if (cat === "for her") return ["kadın", "kız", "bayan", "anne", "sevgili", "fular", "ipek", "her"];
    if (cat === "for him") return ["erkek", "baba", "koca", "sevgili", "cüzdan", "saat", "him"];
    if (cat === "for kids") return ["çocuk", "bebek", "kız", "erkek", "oyuncak", "puzzle", "kids"];
    if (cat === "anniversary") return ["yıldönümü", "evlilik", "hediye", "seti", "anniversary"];
    if (cat === "birthday") return ["doğum", "günü", "hediye", "puzzle", "birthday"];
    if (cat === "wedding") return ["düğün", "evlilik", "wedding"];
    if (cat === "graduation") return ["mezuniyet", "graduation"];
    if (cat === "valentine's day") return ["sevgililer", "günü", "aşk", "romantik", "valentines"];
    if (cat === "corporate") return ["kurumsal", "ofis", "iş", "kalem", "defter", "corporate"];
    if (cat === "romantic") return ["romantik", "aşk", "sevgili", "mum", "çikolata", "romantic"];
    return [cat];
  };

  // Filtreleme Mantığı
  const filteredProducts = useMemo(() => {
    const urlTarget = target.toLowerCase();

    // 1. Database ürünlerini filtrele
    let filtered = products.filter(product => {
      const dbTarget = (product.details?.target || "all").toLowerCase();
      const targetMatch = urlTarget === "all" || urlTarget === "gifts" || dbTarget === urlTarget;
      
      const searchMatch = normalizeText(product.title).includes(normalizeText(searchQuery));

      const keywords = selectedCategory ? getGiftKeywords(selectedCategory) : [];
      const normalizedTitle = normalizeText(product.title);
      const normalizedMaterial = normalizeText(product.details?.material || "");
      const normalizedTarget = normalizeText(product.details?.target || "");
      const normalizedGenre = normalizeText(Array.isArray(product.details?.genre) ? product.details.genre.join(" ") : (product.details?.genre || ""));
      const normalizedCat = normalizeText(product.category || "");

      const categoryMatch = !selectedCategory || keywords.some(keyword => {
        const normKw = normalizeText(keyword);
        return normalizedTitle.includes(normKw) || 
               normalizedMaterial.includes(normKw) ||
               normalizedTarget.includes(normKw) ||
               normalizedGenre.includes(normKw) ||
               normalizedCat.includes(normKw);
      });

      return targetMatch && searchMatch && categoryMatch;
    });

    // 2. Sidebar filtrelerini ve sıralamayı uygula
    return sortProducts(filterProducts(filtered));
  }, [products, target, priceRange, selectedBindings, selectedAvailabilities, selectedTags, dateRange, selectedCategory, searchQuery, filterProducts, sortProducts, normalizeText]);

  // Sayfalama
  const paginatedProducts = useMemo(() => {
    return paginateProducts(filteredProducts);
  }, [filteredProducts, paginateProducts]);

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
          <CategoryChips 
            categories={GIFT_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          
          <ListControls 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalItems={filteredProducts.length}
            sortOption={sortOption}
            setSortOption={setSortOption}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />

          <div className="flex flex-col md:flex-row gap-10">
            
            <FilterSidebar 
              products={products}
              priceRange={priceRange} setPriceRange={setPriceRange}
              selectedBindings={selectedBindings} setSelectedBindings={setSelectedBindings}
              selectedAvailabilities={selectedAvailabilities} setSelectedAvailabilities={setSelectedAvailabilities}
              selectedTags={selectedTags} setSelectedTags={setSelectedTags}
              dateRange={dateRange} setDateRange={setDateRange}
            />

            <main className="flex-1">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-[#00C49F]" size={48} />
                </div>
              ) : error ? (
                <div className="text-red-500 p-8 border border-red-100 rounded-3xl bg-red-50 font-bold text-center">
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : null}
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
      </div>
    </div>
  );
}