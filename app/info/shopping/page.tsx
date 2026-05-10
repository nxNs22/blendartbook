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
              Everything you need to know about your shopping experience at BlendArtBook. We strive to make it seamless, secure, and inspiring.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 rounded-3xl bg-[#F8FDFB] border border-teal-50">
              <div className="w-12 h-12 bg-[#2CB391] rounded-2xl flex items-center justify-center text-white mb-6">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E35] mb-4">Easy Ordering</h3>
              <p className="text-gray-600 leading-relaxed">
                Add your favorite books or art pieces to your cart with one click. Our checkout process is optimized for speed and clarity.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FDFB] border border-teal-50">
              <div className="w-12 h-12 bg-[#2CB391] rounded-2xl flex items-center justify-center text-white mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E35] mb-4">Secure Payments</h3>
              <p className="text-gray-600 leading-relaxed">
                We use industry-leading encryption (SSL) and trusted payment gateways like Stripe and Revolut to ensure your data is always safe.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FDFB] border border-teal-50">
              <div className="w-12 h-12 bg-[#2CB391] rounded-2xl flex items-center justify-center text-white mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E35] mb-4">Fast Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Orders are processed within 24 hours. You will receive a tracking number as soon as your package leaves our warehouse.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FDFB] border border-teal-50">
              <div className="w-12 h-12 bg-[#2CB391] rounded-2xl flex items-center justify-center text-white mb-6">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E35] mb-4">Customer Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Our support team is available via chat and email to help you with any questions about your order or our products.
              </p>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="prose prose-teal max-w-none text-gray-700">
            <h2 className="text-2xl font-black text-[#1A2E35] mb-4">How to shop?</h2>
            <p className="mb-8">
              Browsing through our collection is easy. You can use the search bar to find specific titles or explore our curated categories from the main menu. Once you find something you like, simply select the quantity and click "Add to Cart".
            </p>

            <h2 className="text-2xl font-black text-[#1A2E35] mb-4">Tracking your order</h2>
            <p className="mb-8">
              After placing an order, you can view its status in your account dashboard. We also send automated email updates at every stage of the delivery process.
            </p>

            <div className="mt-20 p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
              <h3 className="text-2xl font-black text-[#1A2E35] mb-4">Need help with your order?</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Our support experts are ready to assist you with any questions about products, shipping, or returns.</p>
              <Link href="/about/contacts" className="inline-block bg-[#2CB391] text-white font-black py-4 px-10 rounded-2xl hover:bg-[#249278] transition-all shadow-lg shadow-teal-900/10">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
