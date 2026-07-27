"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect, useMemo } from "react";
import { Search, Loader2, Palette, Paintbrush, Box, Music, Scissors } from "lucide-react";
import { supabase, getErrorMessage } from "../../lib/supabaseClient"; 
import ProductCard from "../../components/ProductCard";
import CategoryChips from "../../components/CategoryChips";
import FilterSidebar from "../../components/FilterSidebar";
import ListControls from "../../components/ListControls";
import { useSidebarFilters } from "../../hooks/useSidebarFilters";

const ART_CATEGORIES = [
  "Painting", "Sculpture", "Photography", "Digital Art", "Mixed Media", 
  "Prints", "Drawings", "Ceramics", "Textile Art", "Installation"
];

export default function ArtCategoryPage() {
  const { t } = useLanguage();
  const params = useParams();
  const subcategory = (params?.subcategory as string) || "art";
  const decodedSubcategory = decodeURIComponent(subcategory);
  
  // Eyalet Yönetimi (State)
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayTitle = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace("-", " ");

  // 🌟 VERİ ÇEKME: Artık 'subcategory' sütunu aramıyor, sadece ID'si 6 olan (Art) tüm ürünleri çekiyor
  useEffect(() => {
    const fetchArtProducts = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'art'); // Art category

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

  const getArtKeywords = (category: string): string[] => {
    const cat = category.toLowerCase();
    if (cat === "painting") return ["boya", "resim", "tuval", "tablo", "manzara", "acrylic", "sunset", "canvas", "painting"];
    if (cat === "sculpture") return ["heykel", "figür", "vazo", "soyut", "mermer", "bronz", "seramik", "sculpture"];
    if (cat === "photography") return ["fotoğraf", "kare", "kadraj", "photography"];
    if (cat === "digital art") return ["dijital", "digital"];
    if (cat === "mixed media") return ["karışık", "kolaj", "mixed"];
    if (cat === "prints") return ["baskı", "print"];
    if (cat === "drawings") return ["çizim", "karakalem", "desen", "drawing"];
    if (cat === "ceramics") return ["seramik", "çömlek", "kil", "porselen", "ceramic"];
    if (cat === "textile art") return ["tekstil", "iplik", "örgü", "makrome", "kumaş", "nakış"];
    if (cat === "installation") return ["enstalasyon", "yerleştirme"];
    return [cat];
  };

  // 🌟 KURŞUN GEÇİRMEZ FİLTRELEME (Gifts mantığı)
  const filteredProducts = useMemo(() => {
    // 1. Database ürünlerini filtrele
    let filtered = products.filter(product => {
      const dbSubcategory = (product.details?.subcategory || product.details?.type || "all").toLowerCase();
      const subcategoryMatch = decodedSubcategory === "art" || dbSubcategory === decodedSubcategory;
      
      const searchMatch = normalizeText(product.title).includes(normalizeText(searchQuery));

      const keywords = selectedCategory ? getArtKeywords(selectedCategory) : [];
      const normalizedTitle = normalizeText(product.title);
      const normalizedType = normalizeText(product.details?.type || "");
      const normalizedMaterial = normalizeText(product.details?.material || "");
      const normalizedGenre = normalizeText(Array.isArray(product.details?.genre) ? product.details.genre.join(" ") : (product.details?.genre || ""));
      const normalizedCat = normalizeText(product.category || "");

      const categoryMatch = !selectedCategory || keywords.some(keyword => {
        const normKw = normalizeText(keyword);
        return normalizedTitle.includes(normKw) || 
               normalizedType.includes(normKw) || 
               normalizedMaterial.includes(normKw) ||
               normalizedGenre.includes(normKw) ||
               normalizedCat.includes(normKw);
      });

      return subcategoryMatch && searchMatch && categoryMatch;
    });

    // 2. Sidebar filtrelerini ve sıralamayı uygula
    return sortProducts(filterProducts(filtered));
  }, [products, decodedSubcategory, priceRange, selectedBindings, selectedAvailabilities, selectedTags, dateRange, selectedCategory, searchQuery, filterProducts, sortProducts, normalizeText]);

  // Sayfalama
  const paginatedProducts = useMemo(() => {
    return paginateProducts(filteredProducts);
  }, [filteredProducts, paginateProducts]);

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
          <CategoryChips 
            categories={ART_CATEGORIES}
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
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                   <Loader2 className="animate-spin text-teal-500" size={48} />
                   <p className="text-gray-400 animate-pulse">Loading amazing art pieces...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-500 p-6 rounded-xl border border-red-100 text-center">
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 text-gray-400">
                      No products found.
                    </div>
                  )}
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
      </div>
    </div>
  );
}