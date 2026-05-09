"use client";

import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderCode?: string };
}) {
  const { t } = useLanguage();
  // URL'den gelen orderCode bilgisini alıyoruz (Örn: BLND-8X4M9Q)
  const orderCode = searchParams.orderCode;

  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full border border-teal-100 rounded-2xl p-8 text-center bg-teal-50 shadow-sm">
        <CheckCircle2 size={52} className="mx-auto text-teal-600 mb-4" />
        <h1 className="text-2xl font-black text-[#1A2E35] mb-2">
          {t("payment_successful")}
        </h1>

        <p className="text-sm text-gray-700 mb-6">
          {t("payment_received_desc")}
        </p>

        {/* EĞER SİPARİŞ KODU VARSA EKRANDA KOCAMAN GÖSTERİYORUZ */}
        {orderCode && (
          <div className="mb-6 inline-block bg-white border border-teal-200 rounded-xl px-6 py-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
              {t("order_number")}
            </p>
            <p className="text-2xl font-black text-teal-700 tracking-wider">
              {orderCode}
            </p>
          </div>
        )}

        {/* TESLİMAT BİLGİSİ */}
        <div className="flex items-center justify-center gap-3 text-sm font-bold text-[#1A2E35] bg-teal-100/50 p-4 rounded-xl mb-8">
          <Package size={20} className="text-teal-600" />
          {t("estimated_delivery")}
        </div>

        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-lg bg-[#2CB391] text-white font-bold hover:bg-[#249278] transition-colors"
          >
            {t("continue_shopping")}
          </Link>
          <Link
            href="/cart"
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-white transition-colors"
          >
            {t("back_to_cart")}
          </Link>
        </div>
      </div>
    </div>
  );
}
