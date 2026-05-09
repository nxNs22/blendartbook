"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function CategoriesSection() {
  const { t } = useLanguage();

  const categories = [
    { id: 1, name: t("books"), href: "/books/all", gradient: "from-teal-600 to-teal-700", desc: t("classic_modern_print") },
    { id: 2, name: t("ebooks"), href: "/e-books/all", gradient: "from-blue-600 to-blue-700", desc: t("digital_reading_exp") },
    { id: 3, name: t("audiobooks"), href: "/audiobooks/all", gradient: "from-purple-600 to-purple-700", desc: t("listen_to_stories") },
    { id: 5, name: t("gifts_category"), href: "/gifts/all", gradient: "from-rose-600 to-rose-700", desc: t("special_items_lovers") },
  ];

  const [categoryImages, setCategoryImages] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchCategoryImages = async () => {
      const images: Record<number, string> = {};
      
      for (const cat of categories) {
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-teal-900">
            {t("explore_categories")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
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
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${category.gradient}`} />
                )}
              </div>

              {/* Gradyan Katmanı (Yazıların okunması için) */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10`} />

              {/* İçerik */}
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-bold font-heading">{category.name}</h3>
                <p className="text-sm text-gray-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.desc}
                </p>
                
                <div className="mt-4 flex items-center text-xs font-semibold uppercase tracking-wider">
                  {t("view_collection")}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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