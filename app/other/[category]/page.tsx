"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect, useMemo } from "react";
import { Filter, ChevronDown, Loader2, Package } from "lucide-react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import ProductCard from "../../components/ProductCard";
import CategoryChips from "../../components/CategoryChips";
import FilterSidebar from "../../components/FilterSidebar";
import ListControls from "../../components/ListControls";
import { useSidebarFilters } from "../../hooks/useSidebarFilters";

const OTHER_CATEGORIES = [
  "Stationery", "Calendars", "Diaries", "Games", "Toys", 
  "Puzzles", "Digital", "Accessories", "Home Decor", "Electronics"
];


export default function OtherProductsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const categoryParam = (params?.category as string) || "all";
  const decodedCategory = decodeURIComponent(categoryParam);
  const displayCategory = decodedCategory === "all" ? "All Products" : decodedCategory.replace(/-/g, " ");

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

  // 🌟 VERİ ÇEKME (FETCH): YALNIZCA Kategori 4'ü Çekiyoruz
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'other'); // Other Products

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

  const getOtherKeywords = (category: string): string[] => {
    const cat = category.toLowerCase();
    if (cat === "stationery") return ["kırtasiye", "kalem", "defter", "ayraç", "divit", "mürekkep", "yazı", "stationery"];
    if (cat === "calendars") return ["takvim", "calendar"];
    if (cat === "diaries") return ["ajanda", "günlük", "diary"];
    if (cat === "games") return ["oyun", "game"];
    if (cat === "toys") return ["oyuncak", "toy"];
    if (cat === "puzzles") return ["puzzle", "yapboz"];
    if (cat === "digital") return ["dijital", "e-reader", "kılıf", "digital"];
    if (cat === "accessories") return ["aksesuar", "kılıf", "ayraç", "gözlük", "lamba", "organizer", "mum", "poster", "accessories"];
    if (cat === "home decor") return ["dekor", "lamba", "organizer", "mum", "poster", "raf", "decor"];
    if (cat === "electronics") return ["elektronik", "lamba", "gözlük", "electronics"];
    return [cat];
  };

  // Filtreleme Mantığı: Fiyat ve Alt Kategori (URL'den gelen)
  const filteredProducts = useMemo(() => {
    const urlCategory = decodedCategory.toLowerCase();

    // 1. Database ürünlerini filtrele
    let filtered = products.filter(product => {
      const dbCategory = (product.details?.category || "all").toLowerCase();
      const categoryMatch = decodedCategory === "all" || dbCategory === decodedCategory;
      
      const searchMatch = normalizeText(product.title).includes(normalizeText(searchQuery));

      const keywords = selectedCategory ? getOtherKeywords(selectedCategory) : [];
      const normalizedTitle = normalizeText(product.title);
      const normalizedMaterial = normalizeText(product.details?.material || "");
      const normalizedGenre = normalizeText(Array.isArray(product.details?.genre) ? product.details.genre.join(" ") : (product.details?.genre || ""));
      const normalizedCat = normalizeText(product.category || "");

      const chipMatch = !selectedCategory || keywords.some(keyword => {
        const normKw = normalizeText(keyword);
        return normalizedTitle.includes(normKw) || 
               normalizedMaterial.includes(normKw) ||
               normalizedGenre.includes(normKw) ||
               normalizedCat.includes(normKw);
      });

      return categoryMatch && searchMatch && chipMatch;
    });

    // 2. Sidebar filtrelerini ve sıralamayı uygula
    return sortProducts(filterProducts(filtered));
  }, [products, decodedCategory, priceRange, selectedBindings, selectedAvailabilities, selectedTags, dateRange, selectedCategory, searchQuery, filterProducts, sortProducts, normalizeText]);

  // Sayfalama
  const paginatedProducts = useMemo(() => {
    return paginateProducts(filteredProducts);
  }, [filteredProducts, paginateProducts]);

  const displayTitle = decodedCategory === "all" 
    ? t("other_products") || "Other Products"
    : `${t(decodedCategory.replace(/-/g, "_")) || displayCategory}`;

  return (
    <div className="bg-[#F9FBF9] min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="text-[11px] text-gray-400 mb-4 flex items-center gap-2">
            <span>Home</span> <span>/</span> <span>{t("other_products") || "Other Products"}</span> <span>/</span> <span className="text-gray-600 font-bold">{displayTitle}</span>
          </nav>
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 border border-orange-100 shadow-sm">
               <Package size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] tracking-tighter flex items-baseline gap-4 italic uppercase">
                {displayTitle}
                <span className="text-sm font-normal text-gray-400 not-italic lowercase tracking-normal">
                    {loading ? "..." : `${filteredProducts.length} ${t("items_found")}`}
                </span>
              </h1>
            </div>
          </div>
          <CategoryChips 
            categories={OTHER_CATEGORIES}
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
                  <Package className="mx-auto mb-6 opacity-10" size={64} />
                  <p className="text-lg font-bold">{t("no_products_found") || "No products found"}</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}