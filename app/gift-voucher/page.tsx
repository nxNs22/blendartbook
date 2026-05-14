"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Gift, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const PRESET_AMOUNTS = [100, 250, 500, 1000];

export default function GiftVoucherPage() {
  const { addToCart } = useCart();
  const [selectedAmount, setSelectedAmount] = useState<number>(PRESET_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const voucherAmount = useMemo(() => {
    const parsedCustom = Number(customAmount);
    if (!Number.isNaN(parsedCustom) && parsedCustom >= 50) {
      return parsedCustom;
    }
    return selectedAmount;
  }, [customAmount, selectedAmount]);

  const handleAddVoucherToCart = () => {
    if (!recipientName.trim() || !recipientEmail.trim() || !senderName.trim()) {
      setSuccessMessage("Please fill recipient name, recipient email, and your name.");
      return;
    }

    const voucherId = `gift-voucher-${Date.now()}`;
    const voucherTitle = `Gift Voucher ${voucherAmount.toFixed(2)} €`;
    const voucherAuthor = `For: ${recipientName.trim()} (${recipientEmail.trim()})`;

    addToCart({
      id: voucherId,
      title: voucherTitle,
      price: voucherAmount,
      cover: "🎁",
      author: voucherAuthor,
    });

    setSuccessMessage(`Gift voucher (${voucherAmount.toFixed(2)} €) added to your cart.`);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-teal-50">
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="rounded-3xl border border-rose-100 bg-white/90 p-8 md:p-12 shadow-[0_12px_35px_rgba(0,0,0,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700">
            <Gift size={16} />
            Gift Voucher
          </div>

          <h1 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-[#1A2E35]">
            Send a book gift in seconds
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Choose an amount, add recipient details, and buy instantly. The voucher can be used for any product in the shop.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                  selectedAmount === amount && customAmount === ""
                    ? "border-rose-500 bg-rose-50"
                    : "border-gray-200 hover:border-rose-300"
                }`}
              >
                <p className="text-xs text-gray-500 uppercase font-bold">Voucher</p>
                <p className="text-xl font-black text-[#1A2E35]">{amount} €</p>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Or enter custom amount (min 50 €)</label>
            <input
              type="number"
              min={50}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full md:w-72 h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-rose-400"
              placeholder="e.g. 300"
            />
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Recipient name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-rose-400"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Recipient email</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-rose-400"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Your name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-rose-400"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Message (optional)</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-rose-400"
                placeholder="Happy reading!"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
            <div>
              <p className="text-sm text-gray-500">Selected voucher value</p>
              <p className="text-3xl font-black text-[#1A2E35]">{voucherAmount.toFixed(2)} €</p>
            </div>

            <button
              type="button"
              onClick={handleAddVoucherToCart}
              className="h-12 px-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
            >
              Add Voucher To Cart
            </button>
          </div>

          {successMessage && (
            <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-3 text-teal-700 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} />
              {successMessage}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link href="/cart" className="text-sm font-bold text-[#5BCDE9] hover:underline">
              Go to cart and continue checkout
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

