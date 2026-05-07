"use client";

import { useLanguage } from "../context/LanguageContext";

const features = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    titleKey: "featuresTitle1",
    descKey: "featuresDesc1",
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    titleKey: "featuresTitle2",
    descKey: "featuresDesc2",
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    titleKey: "featuresTitle3",
    descKey: "featuresDesc3",
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    titleKey: "featuresTitle4",
    descKey: "featuresDesc4",
  },
];

export default function FeaturesBar() {
  const { t } = useLanguage();

  return (
    <section className="py-10 border-b border-teal-100 bg-gradient-to-b from-teal-50 to-white" id="features-section">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 transition-all duration-300 cursor-pointer group hover-lift rounded-xl hover:bg-white hover:shadow-md"
              id={`feature-${i}`}
            >
              <div className="flex-shrink-0 text-teal-600 transition-colors group-hover:text-teal-700 group-hover:animate-float">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-teal-900 font-heading md:text-base">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-xs text-teal-600 md:text-sm">
                  {t(feature.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
