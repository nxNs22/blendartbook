"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Search, User, HelpCircle, ShoppingCart, 
  Home, ChevronDown, Gift, Ticket,
  Calendar, Headphones, Gamepad2, Video, 
  Image as ImageIcon, PenTool, Monitor,
  VenetianMask, UserRound, Baby, Sparkles,
  BookOpen, Mic, Tablet, Palette, Paintbrush, Box, Music, Scissors
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase, getErrorMessage } from "../lib/supabaseClient"; 

// --- VERİ YAPILARI ---

const languages = [
  { name: "Books in English", flag: "🇬🇧", slug: "english", count: "2 156 890" },
  { name: "Books in Turkish", flag: "🇹🇷", slug: "turkish", count: "284 730" },
  { name: "Books in Romanian", flag: "🇷🇴", slug: "romanian", count: "156 420" },
  { name: "Books in Bulgarian", flag: "🇧🇬", slug: "bulgarian", count: "89 340" },
];

const ebookLanguages = [
  { name: "E-books in Turkish", flag: "🇹🇷", slug: "turkish", count: "45 200" },
  { name: "E-books in English", flag: "🇬🇧", slug: "english", count: "890 400" },
  { name: "E-books in Romanian", flag: "🇷🇴", slug: "romanian", count: "156 420" },
  { name: "E-books in Bulgarian", flag: "🇧🇬", slug: "bulgarian", count: "89 340" }
];

const audiobookLanguages = [
  { name: "Audiobooks in Turkish", flag: "🇹🇷", slug: "turkish", count: "8 400" },
  { name: "Audiobooks in English", flag: "🇬🇧", slug: "english", count: "210 000" },
  { name: "Audiobooks in Romanian", flag: "🇷🇴", slug: "romanian", count: "8 400" },
  { name: "Audiobooks in Bulgarian", flag: "🇧🇬", slug: "bulgarian", count: "8 400" }
];

const otherProducts = [
  { name: "Calendar/Diary", icon: <Calendar size={28} />, count: "203 929", color: "bg-blue-500/20 text-blue-400" },
  { name: "Audio", icon: <Headphones size={28} />, count: "192 774", color: "bg-purple-500/20 text-purple-400" },
  { name: "Game/Toy", icon: <Gamepad2 size={28} />, count: "83 931", color: "bg-orange-500/20 text-orange-400" },
  { name: "Video", icon: <Video size={28} />, count: "67 926", color: "bg-red-500/20 text-red-400" },
  { name: "Printed items", icon: <ImageIcon size={28} />, count: "77 103", color: "bg-yellow-500/20 text-yellow-400" },
  { name: "Stationery", icon: <PenTool size={28} />, count: "10 941", color: "bg-green-500/20 text-green-400" },
  { name: "Digital", icon: <Monitor size={28} />, count: "11 146", color: "bg-indigo-500/20 text-indigo-400" },
];

const giftCategories = [
  { name: "Gifts for women", icon: <VenetianMask size={32} />, href: "/gifts/women" },
  { name: "Gifts for men", icon: <UserRound size={32} />, href: "/gifts/men" },
  { name: "Gifts for girls", icon: <Sparkles size={32} />, href: "/gifts/girls" },
  { name: "Gifts for boys", icon: <Gamepad2 size={32} />, href: "/gifts/boys" },
  { name: "Gifts for children", icon: <Baby size={32} />, href: "/gifts/children" },
];

const artCategories = [
  { name: "Painting", href: "/art/painting", icon: <Paintbrush size={24} /> },
  { name: "Sculpture", href: "/art/sculpture", icon: <Box size={24} /> },
  { name: "Music", href: "/art/music", icon: <Music size={24} /> },
  { name: "Crafts", href: "/art/crafts", icon: <Scissors size={24} /> },
];

type LanguageItem = {
  name: string;
  flag: string;
  slug: string;
  count: string;
};

function DropdownPanel({ type, onClose }: { type: string; onClose: () => void }) {
  const getContent = () => {
    if (type === "Books") return { title: "16 386 577 books in 175 languages", data: languages, basePath: "/books" };
    if (type === "E-books") return { title: "1 245 000 e-books to download", data: ebookLanguages, basePath: "/e-books" };
    if (type === "Audiobooks") return { title: "450 000 audiobooks for your ears", data: audiobookLanguages, basePath: "/audiobooks" };
    return null;
  };

  const content = getContent();

  return (
    <div className="absolute left-0 z-50 w-full pt-2 duration-200 top-full animate-in fade-in">
      {/* 🌟 MEGA MENÜ ÜST ÇİZGİSİ TURKUAZ OLDU */}
      <div className="bg-teal-900 border-t-2 border-teal-400 shadow-2xl rounded-b-xl">
        <div className="px-6 py-10 mx-auto max-w-7xl">
          
          {content && content.data && (
            <>
              <h2 className="mb-10 text-3xl font-bold text-center text-white md:text-5xl">{content.title}</h2>
              <div className="grid max-w-2xl grid-cols-1 gap-6 mx-auto mb-8 md:grid-cols-3">
                {content.data.map((lang: LanguageItem) => {
                  const safeSlug = (lang.slug || "").toLowerCase();
                  return (
                    <Link 
                      key={lang.name} 
                      href={`${content.basePath}/${safeSlug}`} 
                      onClick={onClose}
                      className="flex flex-col items-center gap-3 transition-opacity group hover:opacity-80"
                    >
                      <div className="text-5xl transition-transform md:text-6xl drop-shadow-lg group-hover:scale-110">{lang.flag}</div>
                      <span className="text-sm font-semibold text-teal-400 group-hover:text-white">{lang.name}</span>
                      <span className="text-sm text-white/50">{lang.count}</span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {type === "Other products" && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
              {otherProducts.map((product) => (
                <Link 
                  key={product.name} 
                  href={`/other/${product.name.toLowerCase().replace("/", "-")}`}
                  onClick={onClose} 
                  className="flex flex-col items-center p-4 transition-all rounded-xl hover:bg-white/5 group"
                >
                  <div className={`w-16 h-16 ${product.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-white`}>
                    {product.icon}
                  </div>
                  <span className="text-white font-bold text-[12px] text-center mb-1">{product.name}</span>
                  <span className="text-white/40 text-[10px] italic">{product.count}</span>
                </Link>
              ))}
            </div>
          )}

          {type === "Gift tips" && (
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
              <div className="grid flex-1 grid-cols-2 gap-6 md:grid-cols-5">
                {giftCategories.map((item) => (
                  <Link key={item.name} href={item.href} onClick={onClose} className="flex flex-col items-center p-4 rounded-xl hover:bg-white/5 group transition-all">
                    <div className="flex items-center justify-center w-20 h-20 mb-4 text-teal-400 transition-all rounded-full shadow-lg bg-white/10 group-hover:bg-teal-500 group-hover:text-white group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold leading-tight text-center text-white">{item.name}</span>
                  </Link>
                ))}
              </div>
              <div className="self-stretch hidden w-px lg:block bg-white/10" />
              <div className="flex flex-col items-center w-full text-center lg:w-72">
                <div className="flex items-center justify-center w-20 h-20 mb-4 text-pink-500 border rounded-full bg-pink-500/20 border-pink-500/30">
                  <Ticket size={40} />
                </div>
                <h3 className="mb-1 text-xl font-bold text-pink-400 text-nowrap">Gift voucher</h3>
                <Link href="/gift-voucher" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2.5 rounded-full font-bold text-sm">Buy now</Link>
              </div>
            </div>
          )}

          {type === "Art" && (
             <div className="flex flex-col items-center">
               <h2 className="mb-8 text-3xl font-bold text-center text-white md:text-4xl">Explore Unique Art Pieces</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl">
                 {artCategories.map((sub) => (
                   <Link 
                     key={sub.name} 
                     href={sub.href} 
                     onClick={onClose}
                     className="flex flex-col items-center p-4 rounded-xl hover:bg-white/5 group transition-all"
                   >
                     <div className="flex items-center justify-center w-20 h-20 mb-4 text-teal-400 transition-all rounded-full shadow-lg bg-white/10 group-hover:bg-teal-500 group-hover:text-white group-hover:scale-110">
                       {sub.icon}
                     </div>
                     <span className="text-sm font-bold leading-tight text-center text-white">
                       {sub.name}
                     </span>
                   </Link>
                 ))}
               </div>
             </div>
          )}

          <div className="flex justify-center pt-6 mt-10 text-sm italic border-t border-white/10 text-white/80">
            <Sparkles className="mr-2 text-teal-400" size={18} />
            Don&apos;t know what to choose? We are here to help!
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user } = useAuth();
  const { cartCount } = useCart();

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) {
        setUserName(null);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle(); 

        if (error) throw error;

        if (data && data.full_name && data.full_name.trim() !== "") {
          setUserName(data.full_name.split(" ")[0]); 
        } else {
          setUserName(null);
        }
      } catch (err: unknown) {
        console.error("Name fetch error:", getErrorMessage(err));
      }
    };

    fetchUserName();
  }, [user]);

  const navItems = [
    { label: "Books", hasDropdown: true, icon: <BookOpen size={16} /> },
    { label: "Art", hasDropdown: true, icon: <Palette size={16} /> }, 
    { label: "Handmade", hasDropdown: false, href: "/handmade", icon: <PenTool size={16} /> }, 
    { label: "E-books", hasDropdown: true, icon: <Tablet size={16} /> },
    { label: "Audiobooks", hasDropdown: true, icon: <Mic size={16} /> },
    { label: "Other products", hasDropdown: true, icon: <Gamepad2 size={16} /> },
    { label: "Gift tips", hasDropdown: true, icon: <Gift size={16} /> },
    { label: "Gift voucher", hasDropdown: false, href: "/gift-voucher" },
  ];

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    // 🌟 HEADER ARKA PLANI TURKUAZ (bg-teal-600) YAPILDI
    <header className="sticky top-0 z-50 flex flex-col items-center w-full bg-teal-600 shadow-md">
      {/* 1. TOP BAR (bg-teal-700) */}
      <div className="w-full bg-teal-700 text-white/80 text-[11px] py-1.5 flex justify-center">
        <div className="flex items-center justify-between w-full px-4 max-w-7xl">
          <span className="transition-colors cursor-pointer hover:text-white">Check order status</span>
          <div className="flex gap-4">
            <span className="hidden md:inline">Free delivery over €30</span>
            <span className="font-bold tracking-widest underline uppercase cursor-pointer hover:text-white underline-offset-4">EN</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="flex items-center justify-between w-full gap-6 px-4 py-4 max-w-7xl lg:gap-12">
        <Link href="/" className="flex flex-col items-center flex-shrink-0 group">
          <span className="text-2xl italic font-black leading-none tracking-tighter text-white group-hover:text-teal-100">blendartbook</span>          
          <span className="text-teal-200 text-[9px] tracking-[0.2em] uppercase font-bold">Be Whoever</span>
        </Link>

        <div className="relative flex items-center flex-1 max-w-2xl overflow-hidden bg-white rounded-lg shadow-inner">
          <Search size={18} className="ml-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search books, authors, categories..." 
            className="w-full pl-3 pr-24 text-sm text-gray-800 h-11 focus:outline-none" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          {/* 🌟 ARAMA BUTONU RENGİ GÜNCELLENDİ */}
          <button 
            onClick={handleSearch}
            className="absolute right-0 px-6 text-sm font-bold text-white transition-colors h-11 bg-teal-700 hover:bg-teal-800"
          >
            Search
          </button>
        </div>

        <div className="flex items-center flex-shrink-0 gap-5 text-white">
          <Link href="/qa" className="transition-opacity cursor-pointer opacity-80 hover:opacity-100">
            <HelpCircle size={22} />
          </Link>
          
          <Link href={user ? "/account" : "/auth"} className="flex items-center gap-2 group">
            {user && userName ? (
              <span className="text-sm font-bold capitalize transition-colors text-teal-200 group-hover:text-white">
                Hi, {userName}
              </span>
            ) : (
              <User 
                size={22} 
                className={`cursor-pointer transition-opacity ${user ? "opacity-100 text-teal-200" : "opacity-80 group-hover:opacity-100"}`} 
              />
            )}
          </Link>
          
          {/* 🌟 SEPET BUTONU RENGİ GÜNCELLENDİ (bg-teal-700) */}
          <Link 
            href="/cart" 
            className="relative flex items-center bg-teal-700 px-4 py-2.5 rounded-lg font-bold text-sm cursor-pointer hover:bg-teal-800 transition-all shadow-md"
          >
            <ShoppingCart size={18} />
            <span className="hidden ml-2 text-white md:inline-block">Cart</span>
            
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-teal-700">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>

      {/* 3. NAVIGATION */}
      <nav className="relative flex justify-center w-full border-t bg-teal-800/30 border-white/5">
        <div className="relative flex items-center w-full px-4 max-w-7xl" onMouseLeave={handleMouseLeave}>
          <ul className="flex items-center">
            <li className="px-4 py-3 text-white cursor-pointer hover:bg-white/10">
              <Link href="/"><Home size={18} /></Link>
            </li>
            {navItems.map((item) => (
              <li 
                key={item.label} 
                className="relative"
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.label)}
              >
                {item.hasDropdown ? (
                  <button
                    className={`px-5 py-3 text-[13px] font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                      openDropdown === item.label ? "bg-teal-900 text-white shadow-inner" : "text-white hover:bg-white/10"
                    }`}
                  >
                    {item.icon} {item.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === item.label ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link href={item.href || "#"} className="px-5 py-3 text-[13px] font-bold text-white hover:bg-white/10 flex items-center gap-2">
                    {item.icon} {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          {openDropdown && (
            <div onMouseEnter={() => handleMouseEnter(openDropdown)}>
              <DropdownPanel type={openDropdown} onClose={() => setOpenDropdown(null)} />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}