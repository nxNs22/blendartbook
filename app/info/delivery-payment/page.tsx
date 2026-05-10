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
              Reliable shipping and secure payment methods for your peace of mind.
            </p>
          </div>

          <div className="space-y-12 mb-20">
            {/* Delivery Section */}
            <div className="bg-teal-50/30 rounded-[2.5rem] p-10 border border-teal-50">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-[#1A2E35] mb-6 flex items-center gap-3">
                    <Truck className="text-[#2CB391]" /> Shipping Info
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#2CB391] rounded-full mt-2 flex-shrink-0" />
                      <p><strong>Standard Delivery:</strong> 3-5 business days across Europe.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#2CB391] rounded-full mt-2 flex-shrink-0" />
                      <p><strong>Free Shipping:</strong> On all orders over €30.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#2CB391] rounded-full mt-2 flex-shrink-0" />
                      <p><strong>Tracking:</strong> Real-time tracking provided for every order.</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-teal-50 flex items-center justify-center">
                  <div className="text-center">
                    <Globe size={48} className="text-[#2CB391] mx-auto mb-4" />
                    <p className="text-sm font-bold text-[#1A2E35]">Worldwide Shipping</p>
                    <p className="text-xs text-gray-500 mt-2">Delivering to 175+ countries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
              <div className="flex flex-col md:flex-row-reverse gap-10">
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-[#1A2E35] mb-6 flex items-center gap-3">
                    <CreditCard className="text-[#2CB391]" /> Payment Methods
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>We accept a wide range of secure payment options:</p>
                    <ul className="grid grid-cols-2 gap-4">
                      <li className="bg-white p-3 rounded-xl border border-gray-100 text-center text-xs font-bold">Credit/Debit Cards</li>
                      <li className="bg-white p-3 rounded-xl border border-gray-100 text-center text-xs font-bold">Revolut Pay</li>
                      <li className="bg-white p-3 rounded-xl border border-gray-100 text-center text-xs font-bold">Apple Pay</li>
                      <li className="bg-white p-3 rounded-xl border border-gray-100 text-center text-xs font-bold">Google Pay</li>
                    </ul>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <Clock size={48} className="text-[#2CB391] mx-auto mb-4" />
                    <p className="text-sm font-bold text-[#1A2E35]">Instant Confirmation</p>
                    <p className="text-xs text-gray-500 mt-2">Payments are processed instantly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
            <h3 className="text-2xl font-black text-[#1A2E35] mb-4">Still have delivery questions?</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Our logistics team and support agents are here to help you track your package or resolve payment issues.</p>
            <Link href="/about/contacts" className="inline-block bg-[#2CB391] text-white font-black py-4 px-10 rounded-2xl hover:bg-[#249278] transition-all shadow-lg shadow-teal-900/10">
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
