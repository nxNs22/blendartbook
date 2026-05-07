"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function PromoBanner() {
  const [email, setEmail] = useState("");
  const { t } = useLanguage();

  return (
    <section
      className="relative py-16 overflow-hidden bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800"
      id="promo-section"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">📚</div>
        <div className="absolute bottom-10 right-10 text-8xl">📖</div>
        <div className="absolute text-6xl top-1/2 left-1/3">✨</div>
        <div className="absolute bottom-1/4 right-1/4 text-7xl">📕</div>
      </div>

      <div className="relative z-10 max-w-4xl px-4 mx-auto text-center">
        <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl font-heading">
          {t("promoTitleStart")}{" "}
          <span className="text-accent">LIBROAMANTO</span>{" "}
          {t("promoTitleEnd")}
        </h2>
        <p className="max-w-xl mx-auto mb-8 text-lg text-teal-200">
          {t("promoDesc")}
        </p>

        <div className="flex flex-col max-w-md gap-3 mx-auto sm:flex-row">
          <input
            type="email"
            placeholder={t("promoPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 text-sm text-white transition-all border rounded-lg bg-white/10 border-white/20 placeholder:text-white/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            id="newsletter-email"
          />
          <button
            className="px-6 py-3 text-sm font-bold text-teal-900 transition-all duration-200 rounded-lg bg-accent hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/30"
            id="newsletter-submit"
          >
            {t("promoButton")}
          </button>
        </div>

        <p className="mt-4 text-xs text-teal-300/60">
          {t("promoTerms")}
        </p>
      </div>
    </section>
  );
}
