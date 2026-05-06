"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { supabase, getErrorMessage } from "../lib/supabaseClient";
import { LogOut, User, MapPin, Package, Loader2, Save, ChevronDown } from "lucide-react";

export default function AccountPage() {
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
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Sample orders data - in a real app, this would come from Supabase
  const [orders] = useState([
    {
      id: "ORD-001",
      bookName: "The Hunger Games",
      customerName: "Noor",
      date: "2025-04-15",
      total: "€45.99",
      status: "Delivered",
      items: [
        { title: "The Hunger Games", author: "Suzanne Collins", quantity: 1, price: "€12.99" },
        { title: "Les Misérables", author: "Victor Hugo", quantity: 1, price: "€15.99" },
      ]
    },
    {
      id: "ORD-002",
      bookName: "The Witcher",
      customerName: "Noor",
      date: "2025-04-10",
      total: "€28.50",
      status: "In Transit",
      items: [
        { title: "The Witcher", author: "Andrzej Sapkowski", quantity: 2, price: "€14.25" },
      ]
    },
    {
      id: "ORD-003",
      bookName: "Don Quixote",
      customerName: "Noor",
      date: "2025-03-28",
      total: "€92.30",
      status: "Delivered",
      items: [
        { title: "Don Quixote", author: "Miguel de Cervantes", quantity: 1, price: "€32.99" },
        { title: "Harry Potter Bundle", author: "J.K. Rowling", quantity: 1, price: "€59.31" },
      ]
    },
  ]);

  // Redirect if not logged in, or fetch profile if they are
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }

    const fetchProfile = async () => {
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

    if (user) {
      fetchProfile();
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
      setMessage({ text: "Profile updated successfully!", type: "success" });
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

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-[#2CB391]" size={40} />
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
              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : <User />}
            </div>
            <div>
              <p className="font-bold text-[#1A2E35] line-clamp-1">{profile.full_name || "My Account"}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${activeTab === "profile" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <User size={18} /> Profile Details
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${activeTab === "orders" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <Package size={18} /> My Orders
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 font-bold rounded-lg transition-colors mt-4"
            >
              <LogOut size={18} /> Log Out
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        {activeTab === "profile" ? (
          // Profile Details Tab
          <>
            <h2 className="text-2xl font-bold text-[#1A2E35] mb-6 flex items-center gap-2">
              <MapPin className="text-[#2CB391]" /> Shipping & Contact Details
            </h2>

            {message && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="w-full h-12 px-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2CB391] focus:ring-1 focus:ring-[#2CB391] bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full h-12 px-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2CB391] focus:ring-1 focus:ring-[#2CB391] bg-gray-50 focus:bg-white"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Delivery Address</label>
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  rows={4}
                  className="w-full p-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2CB391] focus:ring-1 focus:ring-[#2CB391] bg-gray-50 focus:bg-white resize-none"
                  placeholder="123 Library Street, Apt 4B, Book City, BK 12345"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-[#2CB391] hover:bg-[#249278] text-white px-8 h-12 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </>
        ) : (
          // My Orders Tab
          <>
            <h2 className="text-2xl font-bold text-[#1A2E35] mb-6 flex items-center gap-2">
              <Package className="text-[#2CB391]" /> My Orders
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {/* Order Header */}
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="w-full p-4 md:p-6 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <div>
                          <p className="font-bold text-gray-800 text-lg">{order.bookName}</p>
                          <p className="text-sm text-gray-600 font-semibold">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="font-bold text-gray-800">{order.total}</p>
                          <p className={`text-xs font-bold ${order.status === "Delivered" ? "text-green-600" : "text-blue-600"}`}>
                            {order.status}
                          </p>
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
                        <h3 className="font-bold text-gray-800 mb-4">Order Items</h3>
                        <div className="space-y-3 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-b-0">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800">{item.title}</p>
                                <p className="text-sm text-gray-600">{item.author}</p>
                                <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-bold text-gray-800 ml-4">{item.price}</p>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between">
                          <span className="font-bold text-gray-800">Total:</span>
                          <span className="font-bold text-lg text-[#2CB391]">{order.total}</span>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800"><span className="font-bold">Status:</span> {order.status}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}