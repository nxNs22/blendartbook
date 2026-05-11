"use client";

import { useLanguage } from "../../context/LanguageContext";
import { Heart, BookOpen, Users, Star } from "lucide-react";

export default function WhoWeArePage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      <main className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-[#1A2E35] mb-8 leading-tight">
                {t("who_we_are_hero_title")}
                
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t("who_we_are_hero_desc")}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] bg-teal-50 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center p-12">
                   <BookOpen size={120} className="text-[#2CB391] opacity-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-[#1A2E35] rounded-[3rem] p-12 md:p-20 text-white mb-24 relative overflow-hidden">
             <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-black mb-8">{t("mission_title")}</h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-12">
                  "{t("mission_desc")}"
                </p>
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <Heart className="text-[#2CB391] mb-4" />
                      <h4 className="font-bold mb-2">{t("curated_with_love")}</h4>
                   </div>
                   <div>
                      <Star className="text-[#2CB391] mb-4" />
                      <h4 className="font-bold mb-2">{t("quality_first")}</h4>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
