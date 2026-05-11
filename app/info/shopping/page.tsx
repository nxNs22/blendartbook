"use client";

import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { ShoppingBag, ShieldCheck, Zap, RefreshCw } from "lucide-react";

export default function ShoppingInfoPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] mb-6">
              {t("all_about_shopping")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("shopping_hero_desc")}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 rounded-3xl bg-[#F8FDFB] border border-teal-50">
              <div className="w-12 h-12 bg-[#2CB391] rounded-2xl flex items-center justify-center text-white mb-6">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E35] mb-4">{t("easy_ordering")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("easy_ordering_desc")}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FDFB] border border-teal-50">
              <div className="w-12 h-12 bg-[#2CB391] rounded-2xl flex items-center justify-center text-white mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E35] mb-4">{t("secure_payments")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("secure_payments_desc")}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FDFB] border border-teal-50">
              <div className="w-12 h-12 bg-[#2CB391] rounded-2xl flex items-center justify-center text-white mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E35] mb-4">{t("fast_processing")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("fast_processing_desc")}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FDFB] border border-teal-50">
              <div className="w-12 h-12 bg-[#2CB391] rounded-2xl flex items-center justify-center text-white mb-6">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E35] mb-4">{t("cust_support_desc")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("cust_support_desc")}
              </p>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="prose prose-teal max-w-none text-gray-700">
            <h2 className="text-2xl font-black text-[#1A2E35] mb-4">{t("how_to_shop")}</h2>
            <p className="mb-8">
              {t("how_to_shop_desc")}
            </p>

            <h2 className="text-2xl font-black text-[#1A2E35] mb-4">{t("tracking_order")}</h2>
            <p className="mb-8">
              {t("tracking_order_desc")}
            </p>

            <div className="mt-20 p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
              <h3 className="text-2xl font-black text-[#1A2E35] mb-4">{t("need_help_order")}</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">{t("support_experts_desc")}</p>
              <Link href="/about/contacts" className="inline-block bg-[#2CB391] text-white font-black py-4 px-10 rounded-2xl hover:bg-[#249278] transition-all shadow-lg shadow-teal-900/10">
                {t("contact_support")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
