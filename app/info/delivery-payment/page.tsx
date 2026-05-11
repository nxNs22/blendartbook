"use client";

import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { Truck, CreditCard, Clock, Globe } from "lucide-react";

export default function DeliveryPaymentPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] mb-6">
              {t("delivery_payment")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("delivery_hero_desc")}
            </p>
          </div>

          <div className="space-y-12 mb-20">
            {/* Delivery Section */}
            <div className="bg-teal-50/30 rounded-[2.5rem] p-10 border border-teal-50">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-[#1A2E35] mb-6 flex items-center gap-3">
                    <Truck className="text-[#2CB391]" /> {t("shipping_info")}
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#2CB391] rounded-full mt-2 flex-shrink-0" />
                      <p><strong>{t("standard_delivery")}:</strong> {t("standard_delivery_desc")}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#2CB391] rounded-full mt-2 flex-shrink-0" />
                      <p><strong>{t("free_shipping_over")}</strong></p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-teal-50 flex items-center justify-center">
                  <div className="text-center">
                    <Globe size={48} className="text-[#2CB391] mx-auto mb-4" />
                    <p className="text-sm font-bold text-[#1A2E35]">{t("worldwide_shipping")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
              <div className="flex flex-col md:flex-row-reverse gap-10">
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-[#1A2E35] mb-6 flex items-center gap-3">
                    <CreditCard className="text-[#2CB391]" /> {t("payment_methods_title")}
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <ul className="grid grid-cols-2 gap-4">
                      <li className="bg-white p-3 rounded-xl border border-gray-100 text-center text-xs font-bold">{t("credit_debit_cards")}</li>
                      <li className="bg-white p-3 rounded-xl border border-gray-100 text-center text-xs font-bold">{t("revolut_pay")}</li>
                    </ul>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <Clock size={48} className="text-[#2CB391] mx-auto mb-4" />
                    <p className="text-sm font-bold text-[#1A2E35]">{t("instant_confirmation")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
            <h3 className="text-2xl font-black text-[#1A2E35] mb-4">{t("need_help_order")}</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{t("support_experts_desc")}</p>
            <Link href="/about/contacts" className="inline-block bg-[#2CB391] text-white font-black py-4 px-10 rounded-2xl hover:bg-[#249278] transition-all shadow-lg shadow-teal-900/10">
              {t("contact_support")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
