"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function PromoBanner() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  return (
    <section
      className="relative py-16 bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 overflow-hidden"
      id="promo-section"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">📚</div>
        <div className="absolute bottom-10 right-10 text-8xl">📖</div>
        <div className="absolute top-1/2 left-1/3 text-6xl">✨</div>
        <div className="absolute bottom-1/4 right-1/4 text-7xl">📕</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
          {t("join_the")}{" "}
          <span className="text-accent">LIBROAMANTO</span>{" "}
          Club
        </h2>
        <p className="text-teal-200 text-lg mb-8 max-w-xl mx-auto">
          {t("promo_desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder={t("enter_email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
            id="newsletter-email"
          />
          <button
            className="bg-accent hover:bg-accent-dark text-teal-900 font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-accent/30 text-sm"
            id="newsletter-submit"
          >
            {t("join_now")}
          </button>
        </div>

        <p className="text-teal-300/60 text-xs mt-4">
          {t("promo_terms")}
        </p>
      </div>
    </section>
  );
}
