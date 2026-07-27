"use client";

import { Search, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

interface ListControlsProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  totalItems: number;
  sortOption: string;
  setSortOption: (val: string) => void;
  currentPage?: number;
  setCurrentPage?: (val: number) => void;
  itemsPerPage?: number;
}

export default function ListControls({ 
  searchQuery, setSearchQuery, totalItems,
  sortOption, setSortOption,
  currentPage = 1, setCurrentPage, itemsPerPage = 12
}: ListControlsProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  return (
    <div className="flex flex-col md:flex-row items-center gap-10 mb-8 border-b border-gray-100 pb-6">
      
      {/* Search Input (Matches Sidebar Width) */}
      <div className="w-full md:w-64 flex-shrink-0 relative">
        <input 
          type="text" 
          placeholder="Fulltext" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 px-4 bg-[#F9FBF9] border border-gray-200 rounded-[4px] text-[13px] focus:outline-none focus:border-[#00C49F] transition-colors"
        />
        <Search className="absolute right-3 top-3 text-[#00C49F]" size={16} />
      </div>

      {/* Right Controls */}
      <div className="flex-1 flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[#1A2E35]">Sort by:</span>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="h-10 px-3 pr-8 bg-white border border-gray-200 rounded-[4px] text-[13px] font-bold text-[#1A2E35] focus:outline-none focus:border-[#00C49F] appearance-none cursor-pointer"
          >
            <option value="popular">Most popular</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="newest">Newest</option>
          </select>
          <HelpCircle size={14} className="text-gray-300 ml-1" />
        </div>

        {setCurrentPage && (
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-[#1A2E35] font-bold">Page</span>
            <select 
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="h-10 px-3 pr-8 bg-white border border-gray-200 rounded-[4px] text-[13px] font-bold text-[#1A2E35] focus:outline-none focus:border-[#00C49F] appearance-none cursor-pointer"
            >
              {Array.from({ length: totalPages }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span className="text-[12px] text-gray-400 font-bold">{totalItems} items</span>

            <div className="flex items-center gap-1 ml-2">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-[4px] text-white transition-colors ${
                  currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#00C49F] hover:bg-[#00a989]"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-[4px] text-white transition-colors ${
                  currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#00C49F] hover:bg-[#00a989]"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
