"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { supabase, getErrorMessage } from "../lib/supabaseClient";
import {
  LogOut,
  User,
  MapPin,
  Package,
  Loader2,
  Save,
  ChevronDown,
  Clock,
  CheckCircle2,
  Truck,
  CreditCard,
} from "lucide-react";

type OrderItem = {
  id: string;
  product_title: string;
  quantity: number;
  price_at_purchase: number;
};

type Order = {
  id: string;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_status: string;
  order_items: OrderItem[];
};

export default function AccountPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Supabase'den gelecek gerçek siparişler state'i
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Auth kontrolü ve profil/sipariş verilerini çekme
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }

    const fetchProfileData = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, phone, address")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data) {
          setProfile({
            full_name: data.full_name || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        }
      } catch (err: unknown) {
        setMessage({ text: getErrorMessage(err), type: "error" });
      } finally {
        setLoading(false);
      }
    };

    const fetchUserOrders = async () => {
      if (!user) return;
      setOrdersLoading(true);
      try {
        // İlgili kullanıcıya ait siparişleri ve içindeki ürünleri çekiyoruz
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err: unknown) {
        console.error("Siparişler çekilirken hata:", getErrorMessage(err));
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
      fetchUserOrders();
    }
  }, [user, authLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
        })
        .eq("id", user.id);

      if (error) throw error;
      setMessage({
        text: t("profile_updated_success") || "Profile updated successfully!",
        type: "success",
      });
    } catch (err: unknown) {
      setMessage({ text: getErrorMessage(err), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Sipariş durumu gösterimi için yardımcı fonksiyon
  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          label: "Processing",
          icon: <Clock size={14} />,
          color: "text-amber-600",
          bg: "bg-amber-50",
        };
      case "shipped":
        return {
          label: "Shipped",
          icon: <Truck size={14} />,
          color: "text-blue-600",
          bg: "bg-blue-50",
        };
      case "delivered":
        return {
          label: "Delivered",
          icon: <CheckCircle2 size={14} />,
          color: "text-green-600",
          bg: "bg-green-50",
        };
      default:
        return {
          label: status || "Pending",
          icon: <Clock size={14} />,
          color: "text-gray-600",
          bg: "bg-gray-50",
        };
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-[#5BCDE9]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col items-center mb-8 pb-6 border-b text-center">
            <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0 mb-4">
              {profile.full_name ? (
                profile.full_name.charAt(0).toUpperCase()
              ) : (
                <User />
              )}
            </div>
            <div>
              <p className="font-bold text-[#1A2E35] line-clamp-1">
                {profile.full_name || t("my_account")}
              </p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {user?.email}
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${activeTab === "profile" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <User size={18} /> {t("profile_details")}
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${activeTab === "orders" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <Package size={18} /> {t("my_orders")}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 font-bold rounded-lg transition-colors mt-4"
            >
              <LogOut size={18} /> {t("log_out")}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        {activeTab === "profile" ? (
          // PROFILE TAB
          <>
            <h2 className="text-2xl font-bold text-[#1A2E35] mb-6 flex items-center gap-2">
              <MapPin className="text-[#5BCDE9]" />{" "}
              {t("shipping_contact_details")}
            </h2>

            {message && (
              <div
                className={`p-4 rounded-lg mb-6 text-sm font-bold flex items-center gap-2 ${message.type === "success" ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-red-50 text-red-700 border border-red-200"}`}
              >
                {message.text}
              </div>
            )}

            <form
              onSubmit={handleUpdateProfile}
              className="space-y-6 max-w-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    {t("full_name")}
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) =>
                      setProfile({ ...profile, full_name: e.target.value })
                    }
                    className="w-full h-12 px-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#5BCDE9] focus:ring-1 focus:ring-[#5BCDE9] bg-gray-50 focus:bg-white"
                    placeholder={t("john_doe")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    {t("phone_number")}
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full h-12 px-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#5BCDE9] focus:ring-1 focus:ring-[#5BCDE9] bg-gray-50 focus:bg-white"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  {t("delivery_address")}
                </label>
                <textarea
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  rows={4}
                  className="w-full p-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#5BCDE9] focus:ring-1 focus:ring-[#5BCDE9] bg-gray-50 focus:bg-white resize-none"
                  placeholder="123 Library Street, Apt 4B, Book City, BK 12345"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-[#5BCDE9] hover:bg-[#38B2D0] text-white px-8 h-12 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {saving ? t("saving") : t("save_changes")}
              </button>
            </form>
          </>
        ) : (
          // ORDERS TAB
          <>
            <h2 className="text-2xl font-bold text-[#1A2E35] mb-6 flex items-center gap-2">
              <Package className="text-[#5BCDE9]" /> {t("my_orders")}
            </h2>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-[#5BCDE9]" size={32} />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  {t("no_orders_yet") || "No orders found."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl">
                {orders.map((order) => {
                  const statusInfo = getStatusDisplay(order.status);

                  return (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Order Header */}
                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === order.id ? null : order.id,
                          )
                        }
                        className="w-full p-4 md:p-6 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <div>
                            <p className="font-bold text-gray-800 text-lg">
                              Order #{order.order_number}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <p className="font-bold text-gray-800">
                              {order.total_amount.toFixed(2)} €
                            </p>
                            <div
                              className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.color}`}
                            >
                              {statusInfo.icon}
                              <span>{statusInfo.label}</span>
                            </div>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-gray-600 transition-transform ${expandedOrderId === order.id ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      {/* Order Details */}
                      {expandedOrderId === order.id && (
                        <div className="p-4 md:p-6 border-t border-gray-200 bg-white">
                          <h3 className="font-bold text-gray-800 mb-4">
                            {t("order_items") || "Order Items"}
                          </h3>

                          <div className="space-y-3 mb-4">
                            {order.order_items?.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800">
                                    {item.product_title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {t("qty") || "Qty"}: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-bold text-gray-800 ml-4">
                                  {(
                                    item.price_at_purchase * item.quantity
                                  ).toFixed(2)}{" "}
                                  €
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-gray-200 pt-4 flex justify-between">
                            <span className="font-bold text-gray-800">
                              {t("total") || "Total"}
                            </span>
                            <span className="font-bold text-lg text-[#5BCDE9]">
                              {order.total_amount.toFixed(2)} €
                            </span>
                          </div>

                          {/* Payment / Tracking Alert Area */}
                          <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <div
                              className={`flex-1 p-3 rounded-lg flex items-center gap-2 ${statusInfo.bg}`}
                            >
                              {statusInfo.icon}
                              <p
                                className={`text-sm font-semibold ${statusInfo.color}`}
                              >
                                {statusInfo.label}
                              </p>
                            </div>
                            <div
                              className={`flex-1 p-3 rounded-lg flex items-center gap-2 ${order.payment_status === "paid" ? "bg-green-50" : "bg-amber-50"}`}
                            >
                              <CreditCard
                                size={18}
                                className={
                                  order.payment_status === "paid"
                                    ? "text-green-600"
                                    : "text-amber-600"
                                }
                              />
                              <p
                                className={`text-sm font-semibold ${order.payment_status === "paid" ? "text-green-700" : "text-amber-700"}`}
                              >
                                {order.payment_status === "paid"
                                  ? "Payment Successful"
                                  : "Awaiting Payment (Pay on Delivery)"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
