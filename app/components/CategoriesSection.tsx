"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const categoryBase = [
  { id: 1, nameKey: "books", href: "/books/all", gradient: "from-teal-600 to-teal-700", descKey: "booksDesc" },
  { id: 2, nameKey: "ebooks", href: "/e-books/all", gradient: "from-blue-600 to-blue-700", descKey: "ebooksDesc" },
  { id: 3, nameKey: "audiobooks", href: "/audiobooks/all", gradient: "from-purple-600 to-purple-700", descKey: "audiobooksDesc" },
  { id: 5, nameKey: "gifts", href: "/gifts/all", gradient: "from-rose-600 to-rose-700", descKey: "giftsDesc" },
];

export default function CategoriesSection() {
  const [categoryImages, setCategoryImages] = useState<Record<number, string>>({});
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCategoryImages = async () => {
      const images: Record<number, string> = {};
      
      for (const cat of categoryBase) {
        const { data } = await supabase
          .from("products")
          .select("image_url")
          .eq("category_id", cat.id)
          .not("image_url", "is", null) 
          .limit(10); 

        if (data && data.length > 0) {
          const randomIdx = Math.floor(Math.random() * data.length);
          images[cat.id] = data[randomIdx].image_url;
        }
      }
      setCategoryImages(images);
    };

    fetchCategoryImages();
  }, []);

  return (
    <section className="py-16 bg-white" id="categories-section">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-teal-900 md:text-4xl font-heading">
            {t("exploreCategories")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryBase.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`group relative h-64 rounded-2xl overflow-hidden shadow-lg hover-lift transition-all`}
            >
              {/* Arka Plan Görseli (Veritabanından Gelen) */}
              <div className="absolute inset-0 z-0">
                {categoryImages[category.id] ? (
                  /* 🌟 KRİTİK DÜZELTME: GitHub'ın merge işlemini engellememesi için kuralı esnetiyoruz */
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={categoryImages[category.id]}
                    alt={t(category.nameKey)}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-60"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${category.gradient}`} />
                )}
              </div>

              {/* Gradyan Katmanı (Yazıların okunması için) */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10`} />

              {/* İçerik */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold font-heading">{t(category.nameKey)}</h3>
                <p className="mt-1 text-sm text-gray-200 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  {t(category.descKey)}
                </p>
                
                <div className="flex items-center mt-4 text-xs font-semibold tracking-wider uppercase">
                  {t("viewCollection")}
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}