"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Search, User, HelpCircle, ShoppingCart, 
  Home, ChevronDown, Gift, Ticket,
  Calendar, Headphones, Gamepad2, Video, ShoppingBag, Briefcase,
  Image as ImageIcon, PenTool, Monitor,
  VenetianMask, UserRound, Baby, Sparkles,
  BookOpen, Mic, Tablet, Palette, Paintbrush, Box, Music, Scissors,
  Globe, Check
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage, LANGUAGES, Language } from "../context/LanguageContext";
import { supabase, getErrorMessage } from "../lib/supabaseClient"; 

// --- VERİ YAPILARI ---

const languageBooks = [
  { nameKey: "books_in_turkish", flag: "🇹🇷", slug: "turkish", count: "284 730" },
  { nameKey: "books_in_english", flag: "🇬🇧", slug: "english", count: "2 156 890" },
  { nameKey: "books_in_romanian", flag: "🇷🇴", slug: "romanian", count: "156 420" },
  { nameKey: "books_in_bulgarian", flag: "🇧🇬", slug: "bulgarian", count: "89 340" },
];

const ebookLanguages = [
  { nameKey: "ebooks_in_turkish", flag: "🇹🇷", slug: "turkish", count: "45 200" },
  { nameKey: "ebooks_in_english", flag: "🇬🇧", slug: "english", count: "890 400" },
  { nameKey: "ebooks_in_romanian", flag: "🇷🇴", slug: "romanian", count: "156 420" },
  { nameKey: "ebooks_in_bulgarian", flag: "🇧🇬", slug: "bulgarian", count: "89 340" }
];

const audiobookLanguages = [
  { nameKey: "audiobooks_in_turkish", flag: "🇹🇷", slug: "turkish", count: "8 400" },
  { nameKey: "audiobooks_in_english", flag: "🇬🇧", slug: "english", count: "210 000" },
  { nameKey: "audiobooks_in_romanian", flag: "🇷🇴", slug: "romanian", count: "8 400" },
  { nameKey: "audiobooks_in_bulgarian", flag: "🇧🇬", slug: "bulgarian", count: "8 400" }
];

const otherProductKeys = [
  { nameKey: "calendar_diary", icon: <Calendar size={28} />, count: "203 929", color: "bg-blue-500/20 text-blue-400" },
  { nameKey: "audio", icon: <Headphones size={28} />, count: "192 774", color: "bg-purple-500/20 text-purple-400" },
  { nameKey: "game_toy", icon: <Gamepad2 size={28} />, count: "83 931", color: "bg-orange-500/20 text-orange-400" },
  { nameKey: "video", icon: <Video size={28} />, count: "67 926", color: "bg-red-500/20 text-red-400" },
  { nameKey: "printed_items", icon: <ImageIcon size={28} />, count: "77 103", color: "bg-yellow-500/20 text-yellow-400" },
  { nameKey: "stationery", icon: <PenTool size={28} />, count: "10 941", color: "bg-green-500/20 text-green-400" },
  { nameKey: "digital", icon: <Monitor size={28} />, count: "11 146", color: "bg-indigo-500/20 text-indigo-400" },
];

const giftCategoryKeys = [
  { nameKey: "gifts_for_women", icon: <ShoppingBag size={32} />, href: "/gifts/women" },
  { nameKey: "gifts_for_men", icon: <Briefcase size={32} />, href: "/gifts/men" },
  { nameKey: "gifts_for_girls", icon: <Sparkles size={32} />, href: "/gifts/girls" },
  { nameKey: "gifts_for_boys", icon: <Gamepad2 size={32} />, href: "/gifts/boys" },
  { nameKey: "gifts_for_children", icon: <Baby size={32} />, href: "/gifts/children" },
];

const artCategoryKeys = [
  { nameKey: "painting", href: "/art/painting", icon: <Paintbrush size={24} /> },
  { nameKey: "sculpture", href: "/art/sculpture", icon: <Box size={24} /> },
  { nameKey: "music", href: "/art/music", icon: <Music size={24} /> },
  { nameKey: "crafts", href: "/art/crafts", icon: <Scissors size={24} /> },
];

type LanguageBookItem = {
  nameKey: string;
  flag: string;
  slug: string;
  count: string;
};

function DropdownPanel({ type, onClose }: { type: string; onClose: () => void }) {
  const { t } = useLanguage();

  const getContent = () => {
    if (type === "books") return { title: t("books_title"), data: languageBooks, basePath: "/books" };
    if (type === "ebooks") return { title: t("ebooks_title"), data: ebookLanguages, basePath: "/e-books" };
    if (type === "audiobooks") return { title: t("audiobooks_title"), data: audiobookLanguages, basePath: "/audiobooks" };
    return null;
  };

  const content = getContent();

  return (
    <div className="absolute left-0 z-50 w-full pt-2 duration-200 top-full animate-in fade-in">
      {/* 🌟 MEGA MENÜ ÜST ÇİZGİSİ KIRMIZI OLDU */}
      <div className="bg-[#7F0A1A] border-t-2 border-[#E62E4D] shadow-2xl rounded-b-xl">
        <div className="px-6 py-10 mx-auto max-w-7xl">
          
          {content && content.data && (
            <>
              <h2 className="mb-12 text-4xl font-black text-center text-white md:text-7xl tracking-tight">
                {content.title}
              </h2>
              <div className="flex flex-wrap justify-center max-w-5xl gap-x-12 gap-y-12 mx-auto mb-12">
                {content.data.map((lang: LanguageBookItem) => {
                  const safeSlug = (lang.slug || "").toLowerCase();
                  return (
                    <Link 
                      key={lang.nameKey} 
                      href={`${content.basePath}/${safeSlug}`} 
                      onClick={onClose}
                      className="flex flex-col items-center gap-3 transition-all group w-56"
                    >
                      <div className="text-6xl transition-transform md:text-7xl drop-shadow-2xl group-hover:scale-110 mb-2">
                        {lang.flag}
                      </div>
                      <span className="text-base font-bold text-white group-hover:text-[#E62E4D] transition-colors">
                        {t(lang.nameKey)}
                      </span>
                      <span className="text-sm font-semibold text-white/40 tracking-wider">
                        {lang.count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {type === "other_products" && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
              {otherProductKeys.map((product) => (
                <Link 
                  key={product.nameKey} 
                  href={`/other/${t(product.nameKey).toLowerCase().replace("/", "-")}`}
                  onClick={onClose} 
                  className="flex flex-col items-center p-4 transition-all rounded-xl hover:bg-white/5 group"
                >
                  <div className={`w-16 h-16 ${product.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-white`}>
                    {product.icon}
                  </div>
                  <span className="text-white font-bold text-[12px] text-center mb-1">{t(product.nameKey)}</span>
                  <span className="text-white/40 text-[10px] italic">{product.count}</span>
                </Link>
              ))}
            </div>
          )}

          {type === "gift_tips" && (
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
              <div className="grid flex-1 grid-cols-2 gap-6 md:grid-cols-5">
                {giftCategoryKeys.map((item) => (
                  <Link key={item.nameKey} href={item.href} onClick={onClose} className="flex flex-col items-center p-4 rounded-xl hover:bg-white/5 group transition-all">
                    <div className="flex items-center justify-center w-20 h-20 mb-4 text-white/80 transition-all rounded-full shadow-lg bg-white/10 group-hover:bg-[#E62E4D] group-hover:text-white group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold leading-tight text-center text-white">{t(item.nameKey)}</span>
                  </Link>
                ))}
              </div>
              <div className="self-stretch hidden w-px lg:block bg-white/10" />
              <div className="flex flex-col items-center w-full text-center lg:w-72">
                <div className="flex items-center justify-center w-20 h-20 mb-4 text-pink-500 border rounded-full bg-pink-500/20 border-pink-500/30">
                  <Ticket size={40} />
                </div>
                <h3 className="mb-1 text-xl font-bold text-pink-400 text-nowrap">{t("gift_voucher")}</h3>
                <Link href="/gift-voucher" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2.5 rounded-full font-bold text-sm">{t("buy_now")}</Link>
              </div>
            </div>
          )}

          {type === "art" && (
             <div className="flex flex-col items-center">
               <h2 className="mb-8 text-3xl font-bold text-center text-white md:text-4xl">{t("art_title")}</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl">
                 {artCategoryKeys.map((sub) => (
                   <Link 
                     key={sub.nameKey} 
                     href={sub.href} 
                     onClick={onClose}
                     className="flex flex-col items-center p-4 rounded-xl hover:bg-white/5 group transition-all"
                   >
                     <div className="flex items-center justify-center w-20 h-20 mb-4 text-white/80 transition-all rounded-full shadow-lg bg-white/10 group-hover:bg-[#E62E4D] group-hover:text-white group-hover:scale-110">
                       {sub.icon}
                     </div>
                     <span className="text-sm font-bold leading-tight text-center text-white">
                       {t(sub.nameKey)}
                     </span>
                   </Link>
                 ))}
               </div>
             </div>
          )}

          <div className="flex justify-center items-center pt-10 mt-12 text-base italic border-t border-white/5 text-white/60">
            <Sparkles className="mr-3 text-[#E62E4D]" size={20} />
            {t("help_text")}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- LANGUAGE SELECTOR DROPDOWN ---
function LanguageSelector() {
  const { language, setLanguage, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 font-bold tracking-widest uppercase cursor-pointer hover:text-white transition-all duration-200 group"
        aria-label="Select language"
        id="language-selector"
      >
        <Globe size={13} className="opacity-70 group-hover:opacity-100 transition-opacity" />
        <span className="text-[11px]">{currentLanguageOption.code.toUpperCase()}</span>
        <ChevronDown size={11} className={`transition-transform duration-300 opacity-60 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[999] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-white/10 bg-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              🌐 Select Language
            </span>
          </div>

          {/* Language options */}
          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const isActive = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 ${
                    isActive
                      ? "bg-[#E62E4D]/20 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-xl leading-none">{lang.flag}</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-semibold truncate">{lang.name}</span>
                    <span className="text-[10px] text-white/40">{lang.nativeName}</span>
                  </div>
                  {isActive && (
                    <Check size={14} className="text-[#E62E4D] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user } = useAuth();
  const { cartCount } = useCart();
  const { t } = useLanguage();

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

  // Nav items use internal keys for dropdown matching, labels are translated
  const navItems = [
    { label: t("books"), dropdownKey: "books", hasDropdown: true, icon: <BookOpen size={16} /> },
    { label: t("art"), dropdownKey: "art", hasDropdown: true, icon: <Palette size={16} /> }, 
    { label: t("handmade"), dropdownKey: "handmade", hasDropdown: false, href: "/handmade", icon: <PenTool size={16} /> }, 
    { label: t("ebooks"), dropdownKey: "ebooks", hasDropdown: true, icon: <Tablet size={16} /> },
    { label: t("audiobooks"), dropdownKey: "audiobooks", hasDropdown: true, icon: <Mic size={16} /> },
    { label: t("other_products"), dropdownKey: "other_products", hasDropdown: true, icon: <Gamepad2 size={16} /> },
    { label: t("gift_tips"), dropdownKey: "gift_tips", hasDropdown: true, icon: <Gift size={16} /> },
    { label: t("gift_voucher"), dropdownKey: "gift_voucher", hasDropdown: false, href: "/gift-voucher" },
  ];

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(key);
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
    // 🌟 HEADER ARKA PLANI KIRMIZI (#C8102E) YAPILDI
    <header className="sticky top-0 z-50 flex flex-col items-center w-full bg-[#C8102E] shadow-md">
      {/* 1. TOP BAR (bg-[#7F0A1A]) */}
      <div className="w-full bg-[#7F0A1A] text-white/80 text-[11px] py-1.5 flex justify-center">
        <div className="flex items-center justify-between w-full px-4 max-w-7xl">
          <span className="transition-colors cursor-pointer hover:text-white">{t("check_order_status")}</span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">{t("free_delivery")}</span>
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="flex items-center justify-between w-full gap-6 px-4 py-4 max-w-7xl lg:gap-12">
        <Link href="/" className="flex flex-col items-center flex-shrink-0 group">
          <span className="text-2xl italic font-black leading-none tracking-tighter text-white group-hover:opacity-80">blendartbook</span>          
          <span className="text-white/80 text-[9px] tracking-[0.2em] uppercase font-bold">{t("be_whoever")}</span>
        </Link>

        <div className="relative flex items-center flex-1 max-w-2xl overflow-hidden bg-white rounded-lg shadow-inner">
          <Search size={18} className="ml-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={t("search_placeholder")} 
            className="w-full pl-3 pr-24 text-sm text-gray-800 h-11 focus:outline-none" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          {/* 🌟 ARAMA BUTONU RENGİ GÜNCELLENDİ (#009966) */}
          <button 
            onClick={handleSearch}
            className="absolute right-0 px-6 text-sm font-bold text-white transition-colors h-11 bg-[#009966] hover:bg-[#008055]"
          >
            {t("search")}
          </button>
        </div>

        <div className="flex items-center flex-shrink-0 gap-5 text-white">
          <Link href="/qa" className="transition-opacity cursor-pointer opacity-80 hover:opacity-100">
            <HelpCircle size={22} />
          </Link>
          
          <Link href={user ? "/account" : "/auth"} className="flex items-center gap-2 group">
            {user && userName ? (
              <span className="text-sm font-bold capitalize transition-colors text-white/90 group-hover:text-white">
                {t("hi")}, {userName}
              </span>
            ) : (
              <User 
                size={22} 
                className={`cursor-pointer transition-opacity ${user ? "opacity-100 text-white" : "opacity-80 group-hover:opacity-100"}`} 
              />
            )}
          </Link>
          
          {/* 🌟 SEPET BUTONU RENGİ GÜNCELLENDİ (#00C292) */}
          <Link 
            href="/cart" 
            className="relative flex items-center bg-[#00C292] px-4 py-2.5 rounded-lg font-bold text-sm cursor-pointer hover:bg-[#00A67C] transition-all shadow-md text-white"
          >
            <ShoppingCart size={18} />
            <span className="hidden ml-2 text-white md:inline-block">{t("cart")}</span>
            
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>

      {/* 3. NAVIGATION */}
      <nav className="relative flex justify-center w-full border-t bg-black/10 border-white/5">
        <div className="relative flex items-center w-full px-4 max-w-7xl" onMouseLeave={handleMouseLeave}>
          <ul className="flex items-center">
            <li className="px-4 py-3 text-white cursor-pointer hover:bg-white/10">
              <Link href="/"><Home size={18} /></Link>
            </li>
            {navItems.map((item) => (
              <li 
                key={item.dropdownKey} 
                className="relative"
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.dropdownKey)}
              >
                {item.hasDropdown ? (
                  <button
                    className={`px-5 py-3 text-[13px] font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                      openDropdown === item.dropdownKey ? "bg-[#7F0A1A] text-white shadow-inner" : "text-white hover:bg-white/10"
                    }`}
                  >
                    {item.icon} {item.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === item.dropdownKey ? "rotate-180" : ""}`} />
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