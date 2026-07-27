"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useCart } from "../../context/CartContext";
import { ArrowLeft, ShoppingCart, Star, Loader2, BookOpen, Heart, Share2, Tag, ChevronLeft, ChevronRight, Truck, ShieldCheck, Info, Trophy } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { addToCart } = useCart();

  // URL'den gelen ürün ID'sini alıyoruz
  const productId = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Review Form States
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Dynamic Reviews State
  const [reviewsList, setReviewsList] = useState([
    { user: "SK", name: "Selin K.", date: new Date().toLocaleDateString(), comment: "review_1_comment", rating: 5 },
    { user: "EU", name: "Emre U.", date: "22.01.2026", comment: "review_2_comment", rating: 5 },
    { user: "FB", name: "Fatma B.", date: "06.10.2025", comment: "review_3_comment", rating: 5 },
  ]);

  const [newName, setNewName] = useState("");
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .maybeSingle();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      setIsAdding(true);
      // useCart hook'umuza gönderiyoruz
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
      });

      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const [activeTab, setActiveTab] = useState("description");

  const scrollToTabs = () => {
    const element = document.getElementById("product-tabs");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveTab("description");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{t("product_not_found")}</h1>
        <p className="text-gray-600 mb-8">{t("product_not_found_desc")}</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-[#004996] text-white rounded-lg hover:bg-[#003d7e] transition">
          {t("go_back")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb / Geri Dön */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-400 hover:text-teal-600 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("back_to_shop")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* SOL TARAF: GÖRSEL ALANI (5 Sütun) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative group aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <img
                src={product.image_url || "/images/default-book.png"}
                alt={product.title}
                className="w-full h-full object-contain p-4"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/default-book.png";
                }}
              />
              
              {/* Resim Navigasyon Okları (Demo) */}
              <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                <ChevronLeft size={24} />
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnail Alanı */}
            <div className="flex gap-4">
              <div className="w-20 h-24 rounded-lg border-2 border-[#5BCDE9] overflow-hidden bg-white p-1">
                <img 
                  src={product.image_url || "/images/default-book.png"} 
                  className="w-full h-full object-contain" 
                  alt="thumb" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/default-book.png";
                  }}
                />
              </div>
            </div>
          </div>

          {/* SAĞ TARAF: DETAYLAR (7 Sütun) */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Üst İkonlar ve Badge */}
            <div className="flex justify-between items-start mb-6">
              <div className="inline-flex items-center gap-2 bg-[#FFFAF0] text-[#D97706] px-3 py-1.5 rounded-lg border border-[#FEF3C7]">
                 <div className="bg-[#FBBF24] p-1 rounded-md">
                    <Trophy size={14} className="text-white fill-current" />
                 </div>
                <span className="text-[11px] font-black uppercase tracking-wider">{t("bestsellers")}</span>
              </div>
              
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-all"><Heart size={18} /></button>
                <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-teal-500 hover:bg-teal-50 transition-all"><Tag size={18} /></button>
                <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"><Share2 size={18} /></button>
              </div>
            </div>

            {/* Başlık ve Yazar */}
            <h1 className="text-5xl font-black text-[#1A2E35] mb-3 tracking-tighter leading-none">{product.title}</h1>
            <div className="flex items-center gap-4 text-[13px] mb-8">
              <p className="text-gray-400 font-medium">{t("author_label")}: <span className="font-black text-[#1A2E35] ml-1">{product.details?.author || t("unknown_author")}</span></p>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              <p className="text-gray-400 font-medium">{t("publisher_label")}: <span className="font-black text-[#1A2E35] ml-1">{product.details?.publisher || "BlendArt"}</span></p>
            </div>

            {/* Puan ve Kitaplığa Ekle */}
            <div className="flex items-center gap-8 mb-10 border-b border-gray-100 pb-8">
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} size={18} className="text-yellow-400 fill-current" />)}
                </div>
                <span className="text-sm font-black text-gray-900">(9)</span>
              </div>
              <button className="flex items-center gap-2.5 text-sm font-black text-[#004996] hover:text-[#5BCDE9] transition-colors uppercase tracking-widest">
                <BookOpen size={18} /> {t("add_to_library")}
              </button>
            </div>

            {/* Fiyat Kutusu */}
            <div className="flex items-center mb-10">
              <div className="flex items-center bg-[#F8FAFC] rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-w-[340px]">
                {product.details?.original_price && Number(product.details.original_price) > product.price && (
                  <>
                    <div className="px-8 py-5 text-gray-400 line-through text-lg font-bold">
                      {Number(product.details.original_price).toFixed(2)} €
                    </div>
                    <div className="px-4 py-1.5 bg-[#5BCDE9]/10 text-[#5BCDE9] text-[10px] font-black uppercase tracking-tighter rounded-full mx-2">
                      {t("in_basket")}
                    </div>
                  </>
                )}
                <div className={`flex-1 px-10 py-5 bg-white text-[#5BCDE9] text-3xl font-black ${product.details?.original_price ? 'border-l border-gray-100' : ''}`}>
                  {product.price?.toFixed(2)} €
                </div>
              </div>
            </div>

            {/* Format Seçimi */}
            <div className="mb-10">
              <p className="text-sm font-black text-[#1A2E35] mb-5 uppercase tracking-wider">{t("all_formats")} (1)</p>
              <div className="w-36 p-3 border-[3px] border-[#E62E4D] rounded-[20px] bg-white flex flex-col items-center gap-2 shadow-lg scale-105 origin-left">
                 <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                   <img 
                     src={product.image_url || "/images/default-book.png"} 
                     className="w-full h-full object-contain" 
                     alt="format" 
                     referrerPolicy="no-referrer"
                     onError={(e) => {
                       (e.target as HTMLImageElement).src = "/images/default-book.png";
                     }}
                   />
                 </div>
                 <span className="text-[11px] font-black text-[#1A2E35] uppercase tracking-widest">{t("paperback")}</span>
              </div>
            </div>

            {/* Sepete Ekle Butonu */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-5 rounded-[24px] text-xl font-black uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-2xl active:scale-95 ${
                product.stock === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : isAdding
                    ? "bg-[#5BCDE9] text-white"
                    : "bg-[#004996] text-white hover:bg-[#003d7e]"
              }`}
            >
              {product.stock === 0 ? t("out_of_stock") : isAdding ? t("added") : t("add_to_cart")}
            </button>

            {/* Kargo Bilgisi */}
            <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-[24px] p-6 border border-gray-100 flex flex-col gap-5 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#004996]">
                  <Truck size={20} />
                </div>
                <p className="text-sm font-black text-blue-900 uppercase tracking-tighter">
                  {t("estimated_shipping")}: <span className="text-[#5BCDE9]">
                    {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(t("lang_code") || 'tr-TR', { 
                      day: 'numeric', 
                      month: 'long', 
                      weekday: 'long' 
                    })}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#004996]">
                  <ShieldCheck size={20} />
                </div>
                <p className="text-sm font-black text-blue-900 uppercase tracking-tighter">
                  {t("free_shipping_promo")}
                </p>
              </div>
            </div>

            {/* Öne Çıkan Bilgiler */}
            <div className="mt-12 bg-white">
              <h3 className="text-xl font-black text-[#1A2E35] mb-8 uppercase tracking-tighter">
                {t("featured_info")}
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-16 text-sm border-t border-gray-100 pt-8">
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{t("paper_type")}:</span>
                  <span className="text-[#1A2E35] font-bold">{product.details?.paper_type || t("paper_type_default")}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{t("page_count")}:</span>
                  <span className="text-[#1A2E35] font-bold">{product.details?.pages || "128"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{t("dimensions")}:</span>
                  <span className="text-[#1A2E35] font-bold">{product.details?.dimensions || "13,5 x 21"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{t("first_edition_year")}:</span>
                  <span className="text-[#1A2E35] font-bold">{product.details?.edition_year || "2025"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{t("edition_number")}:</span>
                  <span className="text-[#1A2E35] font-bold">{product.details?.edition || t("edition_default")}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{t("language")}:</span>
                  <span className="text-[#1A2E35] font-bold">{product.details?.language || t("turkish")}</span>
                </div>
              </div>
              <button 
                onClick={scrollToTabs}
                className="mt-6 text-[11px] font-black text-[#5BCDE9] hover:text-[#004996] transition-colors underline underline-offset-4 uppercase tracking-[0.1em]"
              >
                {t("see_all_features")}
              </button>
            </div>

          </div>
        </div>

        {/* --- TABS SECTION --- */}
        <div id="product-tabs" className="mt-16 border-t border-gray-100 pt-10">
          <div className="flex gap-12 mb-12 border-b border-gray-100">
            <button 
              onClick={() => setActiveTab("description")}
              className={`pb-4 text-xl font-black transition-all relative ${
                activeTab === "description" ? "text-gray-900" : "text-gray-300 hover:text-gray-600"
              }`}
            >
              {t("product_description_tab")}
              {activeTab === "description" && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 animate-in slide-in-from-left duration-300" />}
            </button>
            <button 
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 text-xl font-black transition-all relative ${
                activeTab === "reviews" ? "text-gray-900" : "text-gray-300 hover:text-gray-600"
              }`}
            >
              {t("reviews_tab")}
              {activeTab === "reviews" && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 animate-in slide-in-from-left duration-300" />}
            </button>
            <button 
              onClick={() => setActiveTab("returns")}
              className={`pb-4 text-xl font-black transition-all relative ${
                activeTab === "returns" ? "text-gray-900" : "text-gray-300 hover:text-gray-600"
              }`}
            >
              {t("returns_tab")}
              {activeTab === "returns" && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 animate-in slide-in-from-left duration-300" />}
            </button>
          </div>

          <div className="min-h-[400px]">
             {activeTab === "description" && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-black mb-6">{product.title} {t("product_description_tab")}</h2>
                  <div className="text-gray-600 leading-relaxed space-y-4 mb-10 max-w-4xl">
                    <p>{product.description || t("default_description")}</p>
                    <p className="italic text-sm">{t("from_promo_bulletin")}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold">{t("book_name_label")}:</span> {product.title}</p>
                    <p><span className="font-bold">{t("author_label")}:</span> {product.details?.author || t("unknown_author")}</p>
                    <p><span className="font-bold">{t("publisher_label")}:</span> {product.details?.publisher || "BlendArt"}</p>
                    <p><span className="font-bold">{t("paper_type")}:</span> {product.details?.paper_type || t("paper_type_default")}</p>
                    <p><span className="font-bold">{t("page_count")}:</span> {product.details?.pages || "—"}</p>
                    <p><span className="font-bold">{t("dimensions")}:</span> {product.details?.dimensions || "—"}</p>
                    <p><span className="font-bold">{t("first_edition_year")}:</span> {product.details?.edition_year || "—"}</p>
                    <p><span className="font-bold">{t("edition_number")}:</span> {product.details?.edition || t("edition_default")}</p>
                    <p><span className="font-bold">{t("language")}:</span> {product.details?.language || t("turkish")}</p>
                  </div>
               </div>
             )}

             {activeTab === "reviews" && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-12 border-b border-gray-100 pb-10">
                    <div className="text-center md:text-left">
                      <div className="text-5xl font-black text-gray-900 mb-2">4,5</div>
                      <div className="flex mb-1 justify-center md:justify-start">
                        {[1,2,3,4,5].map(i => <Star key={i} size={24} className={i <= 4 ? "text-yellow-400 fill-current" : "text-gray-200"} />)}
                      </div>
                      <div className="text-sm font-bold text-gray-400">9 {t("reviews_count")}</div>
                    </div>
                    
                    <button 
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-[#004996] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#003d7e] transition-all shadow-md active:scale-95"
                    >
                      {t("write_review")}
                    </button>
                  </div>

                  {/* Write Review Form */}
                  {showReviewForm && (
                    <div className="bg-gray-50 rounded-2xl p-8 mb-12 animate-in zoom-in-95 duration-300">
                      {!reviewSubmitted ? (
                        <div className="space-y-6">
                          <h3 className="text-xl font-black text-gray-900">{t("write_review")}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">{t("your_name")}</label>
                              <input 
                                type="text" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#5BCDE9] focus:ring-2 focus:ring-[#5BCDE9]/20 transition-all outline-none" 
                                placeholder={t("your_name")}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">{t("your_rating")}</label>
                              <div className="flex gap-2">
                                {[1,2,3,4,5].map(star => (
                                  <button 
                                    key={star} 
                                    onClick={() => setRating(star)}
                                    className={`transition-all ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                                  >
                                    <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t("your_comment")}</label>
                            <textarea 
                              rows={4}
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#5BCDE9] focus:ring-2 focus:ring-[#5BCDE9]/20 transition-all outline-none resize-none" 
                              placeholder={t("your_comment")}
                            ></textarea>
                          </div>
                          <div className="flex gap-4">
                            <button 
                              onClick={() => {
                                if (!newName || !newComment) return;
                                
                                const newReview = {
                                  user: newName.slice(0, 2).toUpperCase(),
                                  name: newName,
                                  date: new Date().toLocaleDateString(),
                                  comment: newComment,
                                  rating: rating,
                                  isNew: true
                                };
                                
                                setReviewsList([newReview, ...reviewsList]);
                                setReviewSubmitted(true);
                                setNewName("");
                                setNewComment("");
                                setRating(5);

                                setTimeout(() => {
                                  setShowReviewForm(false);
                                  setReviewSubmitted(false);
                                }, 3000);
                              }}
                              className="bg-[#5BCDE9] text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
                            >
                              {t("submit_review")}
                            </button>
                            <button 
                              onClick={() => setShowReviewForm(false)}
                              className="text-gray-400 font-bold px-6 py-3 hover:text-gray-600 transition-colors"
                            >
                              {t("cancel_btn")}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10 animate-in fade-in duration-500">
                           <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                             <ShieldCheck size={32} />
                           </div>
                           <p className="text-lg font-bold text-gray-800">{t("review_submitted_msg")}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-8">
                    {reviewsList.map((review, idx) => (
                      <div key={idx} className={`flex gap-6 border-b border-gray-50 pb-8 ${(review as any).isNew ? "animate-in slide-in-from-left duration-500" : ""}`}>
                        <div className="w-12 h-12 bg-blue-50 rounded flex items-center justify-center text-blue-700 font-bold">{review.user}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="text-sm font-black text-gray-900">{review.name}</p>
                              <div className="flex mt-1">
                                 {[1,2,3,4,5].map(i => <Star key={i} size={14} className={i <= review.rating ? "text-yellow-400 fill-current" : "text-gray-200"} />)}
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 font-bold">{review.date}</span>
                          </div>
                          <p className="text-sm text-gray-800 font-medium mb-3">
                            {(review as any).isNew ? review.comment : t(review.comment)}
                          </p>
                          <div className="flex gap-4">
                            <button className="text-xs font-bold text-gray-400 flex items-center gap-1 hover:text-blue-600 transition-colors">
                              👍 (0)
                            </button>
                            <button className="text-xs font-bold text-gray-400 flex items-center gap-1 hover:text-red-600 transition-colors">
                              👎 (0)
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-10 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-md font-bold text-sm transition-colors mx-auto block">
                    {t("show_more_reviews")}
                  </button>
               </div>
             )}

             {activeTab === "returns" && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                  {[1,2,3,4,5,6,7].map(i => (
                    <FAQItem key={i} index={i} t={t} />
                  ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ index, t }: { index: number, t: any }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-50 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 group cursor-pointer hover:bg-gray-50 px-4 transition-all text-left"
      >
          <span className={`text-sm font-bold transition-colors ${isOpen ? "text-[#5BCDE9]" : "text-gray-800"}`}>
            {t(`cancellation_faq_${index}`)}
          </span>
          <ArrowLeft 
            className={`transition-transform duration-300 ${isOpen ? "-rotate-90 text-[#5BCDE9]" : "rotate-180 text-gray-300"}`} 
            size={18} 
          />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-60 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="px-4 text-sm text-gray-500 leading-relaxed">
          {t(`cancellation_ans_${index}`)}
        </p>
      </div>
    </div>
  );
}
