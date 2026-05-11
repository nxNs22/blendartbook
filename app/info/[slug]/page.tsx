"use client";

import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { Info, Leaf, Gift, RotateCcw, Scale } from "lucide-react";

export default function DynamicInfoPage({ params }: { params: { slug: string } }) {
  const { t } = useLanguage();
  const { slug } = params;

  // Mock content for different slugs
  const getContent = () => {
    switch (slug) {
      case "sustainability":
        return {
          title: t("books_sustainability"),
          icon: <Leaf size={48} />,
          desc: t("sustainability_desc"),
          content: t("sustainability_content")
        };
      case "loyalty":
        return {
          title: t("loyalty_programme"),
          icon: <Gift size={48} />,
          desc: t("loyalty_desc"),
          content: t("loyalty_content")
        };
      case "returns":
        return {
          title: t("returns_complaints"),
          icon: <RotateCcw size={48} />,
          desc: t("returns_desc"),
          content: t("returns_content")
        };
      case "terms-conditions":
        return {
          title: t("terms_conditions"),
          icon: <Scale size={48} />,
          desc: t("terms_hero_desc"),
          content: t("terms_section1_content")
        };
      default:
        return {
          title: "Information",
          icon: <Info size={48} />,
          desc: "Information about BlendArtBook",
          content: "Please contact our support team for more details about this topic."
        };
    }
  };

  const pageContent = getContent();

  return (
    <div className="bg-white">
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center text-[#2CB391] mx-auto mb-8 shadow-sm">
              {pageContent.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] mb-6">
              {pageContent.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {pageContent.desc}
            </p>
          </div>

          <div className="bg-gray-50 rounded-[3rem] p-10 md:p-16 border border-gray-100">
             <div className="prose prose-teal max-w-none text-gray-700 leading-relaxed text-lg">
                <p>{pageContent.content}</p>
                <div className="mt-12 p-8 bg-white rounded-3xl border border-gray-200">
                   <h4 className="font-black text-[#1A2E35] mb-4">{t("still_have_questions")}</h4>
                   <p className="text-sm text-gray-500 mb-6">{t("support_team_desc")}</p>
                   <Link href="/about/contacts" className="text-[#2CB391] font-black text-sm uppercase tracking-widest hover:underline">
                      {t("contact_support")} →
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
