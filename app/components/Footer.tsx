"use client";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    // 🌟 ARKA PLAN RENGİ teal-700 OLARAK GÜNCELLENDİ
    <footer className="bg-teal-700 text-white" id="footer">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-10">
        {/* Tagline */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white inline-block">
            {t("all_the_books")}
          </h2>
        </div>

        {/* Footer columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1 */}
          <div>
            <h3 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-wider">
              {t("all_about_shopping")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/info/shopping"
                  className="text-teal-100 hover:text-white text-sm transition-colors duration-200"
                >
                  {t("all_about_shopping")}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/delivery-payment"
                  className="text-teal-100 hover:text-white text-sm transition-colors duration-200"
                >
                  {t("delivery_payment")}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/terms-conditions"
                  className="text-teal-100 hover:text-white text-sm transition-colors duration-200"
                >
                  {t("terms_conditions")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-wider">
              {t("about_the_shop")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about/who-we-are"
                  className="text-teal-100 hover:text-white text-sm transition-colors duration-200"
                >
                  {t("who_we_are")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about/contacts"
                  className="text-teal-100 hover:text-white text-sm transition-colors duration-200"
                >
                  {t("contacts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/sustainability"
                  className="text-teal-100 hover:text-white text-sm transition-colors duration-200"
                >
                  {t("books_sustainability")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-wider">
              {t("for_customers")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/info/loyalty"
                  className="text-teal-100 hover:text-white text-sm transition-colors duration-200"
                >
                  {t("loyalty_programme")}
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-teal-100 hover:text-white text-sm transition-colors duration-200"
                >
                  {t("order_status")}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/returns"
                  className="text-teal-100 hover:text-white text-sm transition-colors duration-200"
                >
                  {t("returns_complaints")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Social */}
          <div>
            <h3 className="text-sm font-heading font-bold text-white mb-4">
              {t("lets_stay_together")}
              <span className="text-red-400 ml-1">♥</span>
            </h3>

            {/* Social icons */}
            <div className="flex items-center gap-3 mb-4">
              {/* Instagram */}
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>

            <p className="text-teal-200 font-heading font-bold text-lg">
              #blendartbook
            </p>

            {/* Logo */}
            <div className="mt-6">
              <span className="text-2xl font-heading font-bold tracking-wider text-white/50">
                blendartbook
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-xs">
            © 2008-2026 blendartbook
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-xl font-bold tracking-wider">VISA</span>
            <span className="text-white/60 text-xl font-bold">
              <svg className="w-8 h-5 inline" viewBox="0 0 32 20" fill="currentColor">
                <circle cx="11" cy="10" r="8" opacity="0.6" />
                <circle cx="21" cy="10" r="8" opacity="0.6" />
              </svg>
            </span>
            <span className="text-white/60 text-lg font-bold">G</span>
            <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-4 text-xs text-white/60">
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}