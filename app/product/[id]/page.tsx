"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useCart } from "../../context/CartContext";
import { ArrowLeft, ShoppingCart, Star, Loader2, BookOpen } from "lucide-react";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // URL'den gelen ürün ID'sini alıyoruz
  const productId = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single(); // Sadece 1 ürün getir

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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Ürün Bulunamadı</h1>
        <p className="text-gray-600 mb-8">Aradığınız ürün yayından kaldırılmış veya taşınmış olabilir.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Geri Butonu */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-500 hover:text-teal-600 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-8 lg:p-12">

            {/* Sol Taraf: Görsel */}
            <div className="relative aspect-[3/4] md:aspect-auto md:h-[600px] w-full rounded-2xl overflow-hidden bg-gray-100 group">
              {product.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <BookOpen className="w-20 h-20 opacity-20" />
                </div>
              )}
              {product.stock < 5 && product.stock > 0 && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Son {product.stock} Ürün!
                </div>
              )}
            </div>

            {/* Sağ Taraf: Ürün Detayları */}
            <div className="flex flex-col justify-center">
              {/* Kategori Etiketi */}
              <div className="mb-4">
                <span className="inline-block bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
                  {product.category ? product.category.toUpperCase() : "GENEL"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Yazar Bilgisi (Details JSONB objesi içinden alınıyor) */}
              <p className="text-xl text-gray-500 mb-6 italic">
                {product.details?.author || "Anonim"}
              </p>

              {/* Fiyat ve Puan */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                <div className="text-4xl font-bold text-teal-600">
                  ${product.price?.toFixed(2)}
                </div>
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-2 font-medium text-gray-700">4.8 <span className="text-gray-400 font-normal text-sm">(120+ Review)</span></span>
                </div>
              </div>

              {/* Açıklama */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Açıklama</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "Bu ürün için henüz detaylı bir açıklama girilmemiş. Ancak Libristo kalitesiyle en iyi deneyimi sunacağından emin olabilirsiniz."}
                </p>
              </div>

              {/* Sepete Ekle Butonu */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 px-8 rounded-xl flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                  product.stock === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : isAdding
                      ? "bg-teal-700 text-white scale-95"
                      : "bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                <ShoppingCart className={`w-6 h-6 mr-3 ${isAdding ? "animate-bounce" : ""}`} />
                {product.stock === 0 ? "Stokta Yok" : isAdding ? "Eklendi!" : "Sepete Ekle"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}