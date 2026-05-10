"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package, Loader2, ShoppingBag } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabaseClient";
import CheckoutProgress from "../../components/CheckoutProgress";

interface OrderDetail {
  id: string;
  order_number: string;
  total_amount: number;
  discount_amount: number;
  customer_email: string;
}

interface OrderItem {
  id: string;
  product_title: string;
  quantity: number;
  price_at_purchase: number;
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderCode?: string };
}) {
  const { t } = useLanguage();
  const { clearCart } = useCart();
  const orderCode = searchParams.orderCode;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    // Clear cart on success
    clearCart();

    if (orderCode) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderCode]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // 1. Fetch main order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("id, order_number, total_amount, discount_amount, customer_email")
        .eq("order_number", orderCode)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // 2. Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("id, product_title, quantity, price_at_purchase")
        .eq("order_id", orderData.id);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (err) {
      console.error("Error fetching order summary:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FDFB]">
      {/* Step Progress Bar */}
      <CheckoutProgress currentStep={3} />

      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-teal-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-teal-900/5 overflow-hidden">
            {/* Header Section */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#E8F5F1] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-[#2CB391]" />
              </div>
              <h1 className="text-3xl font-black text-[#1A2E35] mb-3">
                {t("payment_successful")}
              </h1>
              <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                {t("payment_received_desc")}
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center gap-4 py-16">
                <Loader2 className="animate-spin text-[#2CB391]" size={40} />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Preparing order summary...
                </p>
              </div>
            ) : order ? (
              <div className="grid md:grid-cols-5 gap-10">
                {/* Left Side: Order Info */}
                <div className="md:col-span-3 space-y-8">
                  {/* Order Number Card */}
                  <div className="bg-[#1A2E35] rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                      <ShoppingBag size={120} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] text-[#2CB391] uppercase tracking-[0.3em] font-black mb-2">
                        {t("order_number")}
                      </p>
                      <p className="text-4xl font-black tracking-tighter mb-4">
                        {order.order_number}
                      </p>
                      <div className="h-1 w-12 bg-[#2CB391] rounded-full mb-4" />
                      <p className="text-xs text-gray-400 font-bold">
                        Confirmation sent to: <span className="text-white">{order.customer_email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Delivery Status */}
                  <div className="flex items-center gap-5 text-sm font-bold text-[#1A2E35] bg-[#E8F5F1] border border-[#D1EBE3] p-6 rounded-3xl">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <Package size={20} className="text-[#2CB391]" />
                    </div>
                    <p className="leading-tight">
                      {t("estimated_delivery")}
                    </p>
                  </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="md:col-span-2">
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 h-full">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center justify-between">
                      <span>{t("order_summary")}</span>
                      <span className="text-[#2CB391]">{items.length} items</span>
                    </h3>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-xs text-[#1A2E35] line-clamp-2">{item.product_title}</p>
                            <p className="text-[10px] text-gray-500 font-bold mt-0.5">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-black text-xs text-[#1A2E35] whitespace-nowrap">
                            {(item.price_at_purchase * item.quantity).toFixed(2)} €
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-3">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-gray-500 uppercase tracking-wider">{t("subtotal")}</span>
                        <span className="text-[#1A2E35]">{(order.total_amount + order.discount_amount).toFixed(2)} €</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-teal-600 uppercase tracking-wider">{t("discount")}</span>
                          <span className="text-teal-600">-{order.discount_amount.toFixed(2)} €</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
                        <span className="font-black text-xs text-[#1A2E35] uppercase tracking-widest">{t("total")}</span>
                        <span className="text-2xl font-black text-[#1A2E35]">{order.total_amount.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-red-500 font-black uppercase tracking-widest text-xs">
                  Order details could not be found.
                </p>
                <Link href="/" className="text-[#2CB391] font-bold text-sm mt-4 inline-block hover:underline">
                  Go back to home
                </Link>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 pt-8 border-t border-gray-50">
              <Link
                href="/"
                className="px-10 py-4 rounded-2xl bg-[#2CB391] text-white font-black hover:bg-[#249278] transition-all hover:-translate-y-1 shadow-lg shadow-teal-900/10 active:translate-y-0 text-center"
              >
                {t("continue_shopping")}
              </Link>
              <Link
                href="/cart"
                className="px-10 py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-black hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 text-center"
              >
                {t("back_to_cart")}
              </Link>
            </div>
          </div>
          
          {/* Footer Note */}
          <p className="text-center text-[10px] text-gray-400 mt-8 uppercase tracking-[0.4em] font-black">
            BlendArtBook • Secure E-commerce Platform
          </p>
        </div>
      </div>
    </div>
  );
}
