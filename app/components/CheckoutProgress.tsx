"use client";

import React from "react";
import { ShoppingCart, Truck, MapPin, FileText } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface CheckoutProgressProps {
  currentStep: number; // 1: Cart, 2: Delivery & Payment, 3: Delivery Details, 4: Order Summary
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const { t } = useLanguage();

  const steps = [
    { key: "shopping_cart", icon: ShoppingCart, label: t("shopping_cart") },
    { key: "delivery_payment", icon: Truck, label: t("delivery_payment") },
    { key: "delivery_details", icon: MapPin, label: t("delivery_details") },
    { key: "order_summary", icon: FileText, label: t("order_summary") },
  ];

  return (
    <div className="bg-[#2CB391] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative flex justify-between items-center">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/30 -translate-y-[18px] z-0" />

          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const Icon = step.icon;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-white text-[#2CB391] shadow-lg scale-110"
                      : "bg-[#249278] text-white/80"
                  }`}
                >
                  <Icon size={22} strokeWidth={2.5} />
                </div>
                <span
                  className={`mt-3 text-[10px] font-black uppercase tracking-wider text-center transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
