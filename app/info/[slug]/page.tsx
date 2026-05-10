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
          desc: "Our commitment to the planet and responsible publishing.",
          content: "We believe in a sustainable future for the world of art and literature. We source our paper from FSC-certified forests and use eco-friendly inks whenever possible. Our packaging is 100% recyclable and plastic-free."
        };
      case "loyalty":
        return {
          title: t("loyalty_programme"),
          icon: <Gift size={48} />,
          desc: "Rewarding our most passionate readers and collectors.",
          content: "Join the BlendArtBook Loyalty Programme to earn points on every purchase. Points can be redeemed for exclusive discounts, early access to rare editions, and free shipping on all orders."
        };
      case "returns":
        return {
          title: t("returns_complaints"),
          icon: <RotateCcw size={48} />,
          desc: "Hassle-free returns and dedicated support for your satisfaction.",
          content: "Not satisfied with your purchase? No problem. We offer a 30-day return policy for all items in their original condition. Simply contact our support team to initiate a return or exchange."
        };
      case "terms-conditions":
        return {
          title: t("terms_conditions"),
          icon: <Scale size={48} />,
          desc: "The fine print, made clear and transparent.",
          content: "By using our website, you agree to our terms of service. We are committed to transparency and fairness in all our dealings with our community."
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
                   <h4 className="font-black text-[#1A2E35] mb-4">Still have questions?</h4>
                   <p className="text-sm text-gray-500 mb-6">Our dedicated support team is ready to assist you with any further details regarding this topic.</p>
                   <Link href="/about/contacts" className="text-[#2CB391] font-black text-sm uppercase tracking-widest hover:underline">
                      Contact Support →
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
