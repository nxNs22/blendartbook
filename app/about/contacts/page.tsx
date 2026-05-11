"use client";

import { useLanguage } from "../../context/LanguageContext";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export default function ContactsPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-[#1A2E35] mb-6">
              {t("contacts")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("contacts_hero_desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-[#2CB391] flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-black text-[#1A2E35] mb-1">{t("email_us")}</h4>
                  <p className="text-gray-500 text-sm mb-2">support@blendartbook.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-[#2CB391] flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-black text-[#1A2E35] mb-1">{t("call_us")}</h4>
                  <p className="text-gray-500 text-sm mb-2">+44 20 1234 5678</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-[#2CB391] flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-black text-[#1A2E35] mb-1">{t("visit_us")}</h4>
                  <p className="text-lg font-bold text-[#1A2E35]">
                    {t("art_street_address")}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Chat Card */}
            <div className="bg-[#1A2E35] rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <MessageSquare size={150} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4">{t("live_chat")}</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  {t("live_chat_desc")}
                </p>
              </div>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-ai-chat"))}
                className="bg-[#2CB391] text-white font-black py-4 px-8 rounded-2xl hover:bg-[#249278] transition-all relative z-10 shadow-xl shadow-teal-900/20"
              >
                {t("start_conversation")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
