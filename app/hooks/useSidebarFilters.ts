import { useState, useMemo, useCallback } from 'react';

export function useSidebarFilters() {
  const [priceRange, setPriceRange] = useState({ from: 0, to: 500 });
  const [selectedBindings, setSelectedBindings] = useState<string[]>([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: 1900, to: 2030 });
  
  const [sortOption, setSortOption] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Türkçe karakterleri ve aksanları yok eden yardımcı fonksiyon (Arama için)
  const normalizeText = useCallback((str: string) => {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }, []);
  
  const filterProducts = useCallback((baseFilteredProducts: any[]) => {
    return baseFilteredProducts.filter((product) => {
      // Price
      const p = Number(product.price) || 0;
      const priceMatch = p >= priceRange.from && p <= priceRange.to;

      // Binding / Format / Material
      const productBinding = product.details?.binding || product.details?.format || product.details?.material;
      const bindingMatch = selectedBindings.length === 0 || (productBinding && selectedBindings.includes(productBinding));

      // Availability
      const productAvailability = product.details?.availability;
      const availabilityMatch = selectedAvailabilities.length === 0 || (productAvailability && selectedAvailabilities.includes(productAvailability));

      // Tags
      const productTags = product.details?.tags || [];
      const tagsMatch = selectedTags.length === 0 || selectedTags.some(tag => productTags.includes(tag));

      // Date of Issue
      const productYear = Number(product.details?.year || product.details?.date_of_issue);
      const dateMatch = !productYear || isNaN(productYear) || (productYear >= dateRange.from && productYear <= dateRange.to);

      return priceMatch && bindingMatch && availabilityMatch && tagsMatch && dateMatch;
    });
  }, [priceRange, selectedBindings, selectedAvailabilities, selectedTags, dateRange]);

  const sortProducts = useCallback((products: any[]) => {
    return [...products].sort((a, b) => {
      if (sortOption === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sortOption === "price_desc") return (b.price || 0) - (a.price || 0);
      if (sortOption === "newest") {
        const yearA = a.details?.year || a.details?.date_of_issue || 0;
        const yearB = b.details?.year || b.details?.date_of_issue || 0;
        return yearB - yearA;
      }
      return 0; // popular (varsayılan sırayı korur)
    });
  }, [sortOption]);

  const paginateProducts = useCallback((products: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage]);

  return {
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
  };
}
