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
            <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center text-[#2CB391] mx-auto mb-8">
              <Scale size={48} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] mb-6">
              {t("terms_conditions")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to transparency, fairness, and the protection of your rights.
            </p>
          </div>

          <div className="space-y-10 text-gray-700 leading-relaxed">
             <section className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
                <h2 className="text-xl font-black text-[#1A2E35] mb-4 flex items-center gap-3">
                   <FileText className="text-[#2CB391]" size={20} /> 1. Acceptance of Terms
                </h2>
                <p>
                   By accessing and using BlendArtBook, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.
                </p>
             </section>

             <section className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
                <h2 className="text-xl font-black text-[#1A2E35] mb-4 flex items-center gap-3">
                   <ShieldCheck className="text-[#2CB391]" size={20} /> 2. Privacy & Data
                </h2>
                <p>
                   Your privacy is paramount. We handle all personal data in accordance with our Privacy Policy and relevant international regulations (GDPR, etc.). We never sell your data to third parties.
                </p>
             </section>

             <section className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
                <h2 className="text-xl font-black text-[#1A2E35] mb-4 flex items-center gap-3">
                   <Scale className="text-[#2CB391]" size={20} /> 3. Intellectual Property
                </h2>
                <p>
                   All content on this site, including text, graphics, logos, and images, is the property of BlendArtBook or its content suppliers and is protected by international copyright laws.
                </p>
             </section>

             <div className="mt-20 p-10 bg-teal-50/30 rounded-[2.5rem] border border-teal-50 text-center">
                <h3 className="text-2xl font-black text-[#1A2E35] mb-4">Questions about our terms?</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">If you need clarification on any of our policies, our team is happy to provide more detailed information.</p>
                <Link href="/about/contacts" className="inline-block bg-[#1A2E35] text-white font-black py-4 px-10 rounded-2xl hover:bg-black transition-all">
                   Contact Support
                </Link>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
