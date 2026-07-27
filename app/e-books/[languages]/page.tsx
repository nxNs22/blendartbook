"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useMemo, useEffect } from "react";
import { Filter, ChevronDown, Loader2, Tablet } from "lucide-react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import ProductCard from "../../components/ProductCard";
import CategoryChips from "../../components/CategoryChips";
import FilterSidebar from "../../components/FilterSidebar";
import ListControls from "../../components/ListControls";
import { useSidebarFilters } from "../../hooks/useSidebarFilters";

const EBOOK_CATEGORIES = [
  "The Arts", "Language & Linguistics", "Biography", "Fiction", 
  "Reference", "Society & Social Sciences", "Economics & Finance", 
  "Law", "Medicine & Nursing", "History & Archaeology", 
  "Mathematics & Science", "Philosophy & Religion", "Earth Sciences", 
  "Sports", "Technology & Engineering", "Computing & IT", 
  "Health & Personal development", "Lifestyle & Hobbies", 
  "Graphic novels", "Children's & Teenage"
];


export default function EBooksByLanguage() {
  const { t } = useLanguage();
  const params = useParams();
  const currentLanguage = (params?.languages as string) || "all";

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

  // 🌟 VERİ ÇEKME
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'ebook'); // E-Books

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
    const isAll = currentLanguage.toLowerCase() === 'all';

    // 1. Database ürünlerini filtrele
    let filtered = products.filter(product => {
      const langMatch = isAll || product.details?.language?.toLowerCase() === currentLanguage.toLowerCase();
      const searchMatch = normalizeText(product.title).includes(normalizeText(searchQuery));
      
      const normalizedSelected = selectedCategory ? normalizeText(selectedCategory) : "";
      const genreStr = Array.isArray(product.details?.genre) ? product.details.genre.join(" ") : (product.details?.genre || "");
      const catStr = Array.isArray(product.details?.category) ? product.details.category.join(" ") : (product.details?.category || "");

      const categoryMatch = !selectedCategory || 
        normalizeText(genreStr).includes(normalizedSelected) || 
        normalizeText(catStr).includes(normalizedSelected) ||
        normalizeText(product.title).includes(normalizedSelected);

      return langMatch && searchMatch && categoryMatch;
    });
    
    // 2. Sidebar filtrelerini ve sıralamayı uygula
    return sortProducts(filterProducts(filtered));
  }, [products, currentLanguage, priceRange, selectedBindings, selectedAvailabilities, selectedTags, dateRange, selectedCategory, searchQuery, filterProducts, sortProducts, normalizeText]);

  // Sayfalama
  const paginatedProducts = useMemo(() => {
    return paginateProducts(filteredProducts);
  }, [filteredProducts, paginateProducts]);

  const displayTitle = currentLanguage.toLowerCase() === 'all' 
    ? `${t("all")} ${t("ebooks")}`
    : `${t(currentLanguage.toLowerCase()) || currentLanguage} ${t("ebooks") || "E-Books"}`;

  return (
    <div className="bg-[#F9FBF9] min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="text-[11px] text-gray-400 mb-4 flex items-center gap-2">
            <span>Home</span> <span>/</span> <span>{t("ebooks") || "E-Books"}</span> <span>/</span> <span className="text-gray-600 font-bold">{displayTitle}</span>
          </nav>
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
               <Tablet size={32} />
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
            categories={EBOOK_CATEGORIES}
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
              defaultBindings={["PDF", "EPUB", "MOBI"]}
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
                  <Tablet className="mx-auto mb-6 opacity-10" size={64} />
                  <p className="text-lg font-bold">{t("no_products_found") || "No e-books found"}</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}