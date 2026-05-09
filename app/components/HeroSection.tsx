"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import Image from "next/image";

const characters = [
  {
    name: "Katniss",
    title: "KATNISS",
    image: "/images/hero-katniss.png",
    description: "The main character of the book Hunger Games. Popular book series for young people.",
    book: "The Hunger Games",
    bgColor: "from-green-950 via-teal-900 to-teal-900",
  },
  {
    name: "Cosette",
    title: "COSETTE",
    image: "/images/hero-cosette.png",
    description: "The central figure of Victor Hugo's Les Misérables. A story of redemption and love.",
    book: "Les Misérables",
    bgColor: "from-slate-900 via-amber-950 to-stone-900",
  },
  {
    name: "Yennefer",
    title: "YENNEFER",
    image: "/images/hero-yennefer.png",
    description: "The powerful sorceress from The Witcher saga. A tale of magic and destiny.",
    book: "The Witcher",
    bgColor: "from-indigo-950 via-purple-950 to-slate-900",
  },
  {
    name: "Dulcinea",
    title: "DULCINEA",
    image: "/images/hero-dulcinea.png",
    description: "The beloved muse from Don Quixote. The greatest novel of Spanish literature.",
    book: "Don Quixote",
    bgColor: "from-amber-900 via-orange-900 to-yellow-900",
  },
];

export default function HeroSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleTabChange((activeIndex + 1) % characters.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleTabChange = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  const active = characters[activeIndex];

  return (
    <section className="relative w-full" id="hero-section">
      {/* 1. Marquee headline - İlk koddaki stil korundu */}
      <div className="bg-gradient-to-r from-teal-50 via-white to-teal-50 py-3 overflow-hidden border-b border-teal-100">
        <div className="text-center text-xl sm:text-2xl md:text-3xl font-bold tracking-wide px-4 text-teal-800">
          {t("worlds_widest_selection")}
        </div>
      </div>

      {/* 2. Hero image area - İkinci koddaki sağlam yapı (Inline height/position) */}
      <div
        className={`relative overflow-hidden transition-all duration-700 bg-gradient-to-br ${active.bgColor}`}
        style={{ height: '600px', position: 'relative' }}
      >
        {/* Background image container */}
        <div
          className={`transition-opacity duration-500 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
        >
          <Image
            src={active.image}
            alt={active.name}
            fill
            priority
            className="animate-hero-zoom"
            style={{ objectFit: 'cover', objectPosition: 'top' }}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          
          {/* Gradients Overlay - İlk koddaki derinlik korundu */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" style={{ position: 'absolute', inset: 0 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" style={{ position: 'absolute', inset: 0 }} />
        </div>

        {/* Decorative arrows - İlk koddaki estetik detaylar */}
        <div className="absolute left-[15%] top-1/2 -translate-y-1/2 hidden lg:block z-20 pointer-events-none" style={{ position: 'absolute' }}>
          <div className="text-white/20 text-8xl font-bold select-none">&raquo;</div>
        </div>
        <div className="absolute right-[15%] top-1/2 -translate-y-1/2 hidden lg:block z-20 pointer-events-none" style={{ position: 'absolute' }}>
          <div className="text-white/20 text-8xl font-bold select-none">&laquo;</div>
        </div>

        {/* Content Area - Her iki kodun birleşimi */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-end pb-24 px-4 transition-all duration-500 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
          style={{ position: 'absolute', bottom: 0, width: '100%' }}
        >
          <h1 className="text-center">
            <span className="block text-white text-3xl sm:text-4xl md:text-6xl font-black tracking-wide drop-shadow-2xl mb-2">
              {t("be_whoever").split(" ")[0]}{" "}
              <span className="text-teal-400 italic text-4xl sm:text-5xl md:text-7xl font-black">
                {active.title || t("be_whoever").split(" ")[1]}
              </span>
            </span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-lg text-center mt-3 drop-shadow-lg leading-relaxed">
            {active.description}
          </p>
        </div>

        {/* Side action buttons - İlk koddaki SVG ve cam efekti korundu */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30"
             style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)' }}>
          <button
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-white hover:bg-teal-600 transition-all duration-300 group"
          >
            <svg
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span className="text-[10px] block mt-1 uppercase font-bold">{t("buy_book")}</span>
          </button>
          
          <button
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-white hover:bg-white/20 transition-all duration-300 group"
          >
            <svg
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] block mt-1 uppercase font-bold">{t("video_btn")}</span>
          </button>
        </div>
      </div>

      {/* 3. Character tabs - Temiz ve stabil tasarım */}
      <div className="flex bg-teal-950 overflow-x-auto no-scrollbar border-t border-white/10">
        {characters.map((char, i) => (
          <button
            key={char.name}
            onClick={() => handleTabChange(i)}
            className={`flex-1 min-w-[130px] py-4 px-6 text-xs font-black tracking-widest uppercase transition-all duration-300 relative border-r border-white/5 ${
              i === activeIndex
                ? "bg-teal-600 text-white"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            {char.name}
          </button>
        ))}
      </div>
    </section>
  );
}