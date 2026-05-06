"use client";
import { useCart } from "../context/CartContext";
import { useMemo, useState } from "react";
import { ShoppingCart, Truck, MapPin, FileText, Trash2, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { calculateDiscount, calculateSubtotal, getPromoByCode, PromoRule } from "../lib/pricing";

export default function CartPage() {
  // 1. cartItems yerine "cart" çekiyoruz. totalPrice'ı biz hesaplayacağız.
  const { cart, removeFromCart } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoRule | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // 2. Toplam fiyatı güvenli bir şekilde hesaplıyoruz 
  // (Veritabanından string "120 TL" veya number gelebilir)
  const subtotal = calculateSubtotal(cart);

  const discountAmount = useMemo(() => {
    return calculateDiscount(subtotal, appliedPromo);
  }, [appliedPromo, subtotal]);

  const safeDiscountAmount = Math.min(discountAmount, subtotal);
  const totalPrice = Math.max(subtotal - safeDiscountAmount, 0);

  const applyPromoCode = () => {
    const normalizedCode = promoInput.trim().toUpperCase();
    if (!normalizedCode) {
      setPromoMessage("Please enter a promo code.");
      return;
    }

    const matchedPromo = getPromoByCode(normalizedCode);
    if (!matchedPromo) {
      setAppliedPromo(null);
      setPromoMessage("This promo code is not valid.");
      return;
    }

    if (matchedPromo.minSubtotal && subtotal < matchedPromo.minSubtotal) {
      setAppliedPromo(null);
      setPromoMessage(`This code requires at least ${matchedPromo.minSubtotal.toFixed(2)} TL subtotal.`);
      return;
    }

    setAppliedPromo(matchedPromo);
    setPromoInput(normalizedCode);
    if (matchedPromo.type === "percent") {
      setPromoMessage(`${matchedPromo.code} applied: ${matchedPromo.value}% discount.`);
      return;
    }
    setPromoMessage(`${matchedPromo.code} applied: ${matchedPromo.value.toFixed(2)} TL off.`);
  };

  const clearPromoCode = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoMessage(null);
  };

  const steps = [
    { name: "Shopping cart", icon: <ShoppingCart size={20} />, active: true },
    { name: "Delivery & Payment", icon: <Truck size={20} />, active: false },
    { name: "Delivery details", icon: <MapPin size={20} />, active: false },
    { name: "Order summary", icon: <FileText size={20} />, active: false },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* 1. STEPS BAR (Yeşil Alan) */}
      <div className="bg-[#2CB391] py-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center relative">
          {steps.map((step, idx) => (
            <div key={idx} className={`flex flex-col items-center z-10 ${step.active ? "text-white" : "text-white/60"}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step.active ? "bg-white text-[#2CB391]" : "bg-[#249278]"}`}>
                {step.icon}
              </div>
              <span className="text-xs font-bold uppercase">{step.name}</span>
            </div>
          ))}
          {/* Bağlantı Çizgisi */}
          <div className="absolute top-6 left-0 w-full h-[2px] bg-white/20 -z-0 hidden md:block" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 2. TABLO BAŞLIKLARI */}
        <div className="hidden md:grid grid-cols-6 text-[11px] font-bold text-gray-400 uppercase border-b pb-4 mb-6">
          <div className="col-span-2">Product</div>
          <div className="text-center">Number</div>
          <div className="text-center">Stock Availability</div>
          <div className="text-center">Gift-wrapping</div>
          <div className="text-right">Price</div>
        </div>

        {/* 3. ÜRÜN LİSTESİ */}
        {cart.length === 0 ? (
          <div className="text-center py-20 italic text-gray-400 border-b">Your cart is empty.</div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 items-center gap-4 py-6 border-b">
              <div className="col-span-2 flex gap-4">
                
                {/* Görsel mi yoksa Emoji mi kontrolü */}
                {item.cover && item.cover.length > 5 ? (
                  <img src={item.cover} alt={item.title} className="w-16 h-24 object-cover shadow-sm" />
                ) : (
                  <div className="w-16 h-24 bg-teal-50 flex items-center justify-center text-4xl shadow-sm">
                    {item.cover || "📚"}
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-[#1A2E35]">{item.title}</h4>
                  <p className="text-xs text-gray-400 italic">{item.author || "Unknown Author"}</p>
                  <p className="text-[10px] mt-1 uppercase text-gray-500">🇹🇷 / BOOK</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="border flex items-center px-4 py-2 font-bold">{item.quantity}</div>
              </div>
              
              <div className="flex justify-center">
                <span className="bg-[#E8F5F1] text-[#2CB391] text-[10px] font-bold px-3 py-2 rounded text-center leading-tight">
                  In stock <br /> <span className="text-[9px] font-normal">Shipping within 24 hours</span>
                </span>
              </div>
              
              <div className="flex justify-center">
                <select className="text-xs border rounded p-2 bg-gray-50 w-full max-w-[120px]">
                  <option>Select</option>
                  <option>Yes (+2.00 €)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-end gap-4 font-bold text-[#1A2E35]">
                {item.price} TL
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-red-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}

        {/* 4. ALT BİLGİ VE COUPON */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="w-full md:w-auto">
            <div className="bg-[#F9FBF9] p-4 border rounded flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-[#2CB391]">Do you have a discount coupon?</span>
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="border p-1 text-sm outline-none w-36 uppercase"
                placeholder="Code..."
              />
              <button
                type="button"
                onClick={applyPromoCode}
                className="bg-[#2CB391] text-white px-4 py-1.5 text-xs font-bold rounded hover:bg-[#249278] transition-colors"
              >
                Apply
              </button>
              {appliedPromo && (
                <button
                  type="button"
                  onClick={clearPromoCode}
                  className="border border-gray-300 text-gray-600 px-3 py-1.5 text-xs font-bold rounded hover:bg-gray-100 transition-colors"
                >
                  Remove
                </button>
              )}
              <div className="w-full text-[11px] text-gray-500">
                Example codes: <strong>GIFT10</strong>, <strong>WELCOME50</strong>, <strong>VOUCHER20</strong>
              </div>
              {promoMessage && (
                <div className={`w-full text-xs font-semibold ${appliedPromo ? "text-teal-700" : "text-red-600"}`}>
                  {promoMessage}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">Subtotal:</p>
            <p className="text-xl font-extrabold text-[#1A2E35]">{subtotal.toFixed(2)} TL</p>
            {safeDiscountAmount > 0 && (
              <p className="text-sm font-bold text-teal-600">- {safeDiscountAmount.toFixed(2)} TL discount</p>
            )}
            <p className="text-gray-500 text-sm mt-1">Total price:</p>
            <p className="text-4xl font-black text-[#1A2E35]">{totalPrice.toFixed(2)} TL</p>
          </div>
        </div>

        {/* 5. BUTONLAR */}
        <div className="mt-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={14} /> Back to the shop
          </Link>
          <Link
            href={cart.length === 0 ? "#" : "/checkout"}
            onClick={(event) => {
              if (cart.length === 0) event.preventDefault();
            }}
            aria-disabled={cart.length === 0}
            className={`px-10 py-4 rounded font-bold flex items-center gap-2 transition-all ${
              cart.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                : "bg-[#F14D5D] hover:bg-[#d43f4d] text-white"
            }`}
          >
            Proceed to delivery & payment <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
