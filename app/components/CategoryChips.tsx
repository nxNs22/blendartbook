"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

export default function CategoryChips({ categories, selectedCategory, onSelectCategory }: CategoryChipsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="mt-8 mb-4">
      {isExpanded && (
        <div className="flex flex-wrap gap-3 items-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(isSelected ? null : cat)}
                className={`px-4 py-2 rounded-[8px] text-[13px] transition-all border ${
                  isSelected 
                    ? "bg-[#00C49F] text-white border-[#00C49F] shadow-sm font-bold" 
                    : "bg-white text-[#1A2E35] border-[#B2E6DF] hover:border-[#00C49F] hover:shadow-sm"
                }`}
              >
                {cat}
              </button>
            );
          })}
          
          <button
            onClick={() => setIsExpanded(false)}
            className="px-4 py-2 flex items-center gap-2 rounded-[8px] text-[13px] font-bold text-[#1A2E35] bg-white border border-[#B2E6DF] hover:border-[#00C49F] hover:shadow-sm transition-all"
          >
            <ChevronUp size={16} /> Hide
          </button>
        </div>
      )}

      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="px-4 py-2 flex items-center gap-2 rounded-[8px] text-[13px] font-bold text-[#1A2E35] bg-white border border-[#B2E6DF] hover:border-[#00C49F] hover:shadow-sm transition-all"
        >
          <ChevronDown size={16} /> Show Categories
        </button>
      )}
    </div>
  );
}
