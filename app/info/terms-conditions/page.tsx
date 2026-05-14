"use client";

import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { Scale, FileText, ShieldCheck } from "lucide-react";

export default function TermsConditionsPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center text-[#5BCDE9] mx-auto mb-8">
              <Scale size={48} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] mb-6">
              {t("terms_conditions")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("terms_hero_desc")}
            </p>
          </div>

          <div className="space-y-10 text-gray-700 leading-relaxed">
             <section className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
                <h2 className="text-xl font-black text-[#1A2E35] mb-4 flex items-center gap-3">
                   <FileText className="text-[#5BCDE9]" size={20} /> {t("terms_section1_title")}
                </h2>
                <p>
                   {t("terms_section1_content")}
                </p>
             </section>

             <section className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
                <h2 className="text-xl font-black text-[#1A2E35] mb-4 flex items-center gap-3">
                   <ShieldCheck className="text-[#5BCDE9]" size={20} /> {t("terms_section2_title")}
                </h2>
                <p>
                   {t("terms_section2_content")}
                </p>
             </section>

             <section className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
                <h2 className="text-xl font-black text-[#1A2E35] mb-4 flex items-center gap-3">
                   <Scale className="text-[#5BCDE9]" size={20} /> {t("terms_section3_title")}
                </h2>
                <p>
                   {t("terms_section3_content")}
                </p>
             </section>

             <div className="mt-20 p-10 bg-teal-50/30 rounded-[2.5rem] border border-teal-50 text-center">
                <h3 className="text-2xl font-black text-[#1A2E35] mb-4">{t("terms_questions_title")}</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">{t("terms_questions_desc")}</p>
                <Link href="/about/contacts" className="inline-block bg-[#1A2E35] text-white font-black py-4 px-10 rounded-2xl hover:bg-black transition-all">
                   {t("contact_support")}
                </Link>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
