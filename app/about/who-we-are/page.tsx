"use client";

import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Heart, BookOpen, Users, Star } from "lucide-react";

export default function WhoWeArePage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      <main className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-[#1A2E35] mb-8 leading-tight">
                Crafting stories, <br />
                <span className="text-[#2CB391]">inspiring minds.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                BlendArtBook was born out of a simple passion: to bring the world's most beautiful books and art pieces to a global community of curious readers and art lovers.
              </p>
              <div className="flex gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-teal-100 flex items-center justify-center text-[10px] font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-bold text-[#1A2E35]">Join 50k+ readers</p>
                  <p className="text-gray-500">around the world</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] bg-teal-50 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center p-12">
                   <BookOpen size={120} className="text-[#2CB391] opacity-20" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-teal-50">
                <p className="text-3xl font-black text-[#2CB391]">18+</p>
                <p className="text-xs font-bold text-[#1A2E35] uppercase tracking-widest">Years of Passion</p>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-[#1A2E35] rounded-[3rem] p-12 md:p-20 text-white mb-24 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-20 opacity-5">
                <Users size={300} />
             </div>
             <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-black mb-8">Our Mission</h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-12">
                  "To democratize access to rare art books and unique handmade items, fostering a world where creativity knows no borders."
                </p>
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <Heart className="text-[#2CB391] mb-4" />
                      <h4 className="font-bold mb-2">Curated with Love</h4>
                      <p className="text-sm text-gray-400">Every item is hand-selected by our experts.</p>
                   </div>
                   <div>
                      <Star className="text-[#2CB391] mb-4" />
                      <h4 className="font-bold mb-2">Quality First</h4>
                      <p className="text-sm text-gray-400">We only work with trusted publishers and artists.</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-black text-[#1A2E35] mb-2">16M+</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Books</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#1A2E35] mb-2">175</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Languages</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#1A2E35] mb-2">500k</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#1A2E35] mb-2">24/7</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Support</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
