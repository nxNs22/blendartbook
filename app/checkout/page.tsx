"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  calculateDiscount,
  calculateSubtotal,
  getPromoByCode,
  parsePrice,
} from "../lib/pricing";
import CheckoutProgress from "../components/CheckoutProgress";
import { useLanguage } from "../context/LanguageContext";
import { supabase, getErrorMessage } from "../lib/supabaseClient";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);
const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

type IntentPayload = {
  clientSecret: string;
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  appliedPromoCode: string | null;
};

type SavedCard = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number | null;
  expYear: number | null;
};

const safeParseResponseBody = async (response: Response) => {
  const rawText = await response.text();
  if (!rawText) return null;
  try {
    return JSON.parse(rawText);
  } catch {
    return {
      error:
        "Server returned an unexpected response. Please check payment configuration.",
    };
  }
};

function PaymentForm({
  customerEmail,
  customerName,
  onBeforePayment,
  onPaymentSuccess,
}: {
  customerEmail: string;
  customerName: string;
  onBeforePayment: () => Promise<string | null>;
  onPaymentSuccess: (orderCode: string) => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguage();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePay = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMessage(null);

    // 1. Save order to Supabase as "Pending"
    const orderCode = await onBeforePayment();
    if (!orderCode) {
      setErrorMessage(t("order_save_error"));
      setProcessing(false);
      return;
    }

    // 2. Execute Stripe Payment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: customerEmail,
        payment_method_data: customerName
          ? {
              billing_details: {
                name: customerName,
                email: customerEmail,
              },
            }
          : undefined,
        return_url: `${window.location.origin}/checkout/success?orderCode=${orderCode}`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message ?? t("payment_failed"));
      setProcessing(false);
      return;
    }

    // 3. If payment successful, update status to "Paid" in Supabase
    await onPaymentSuccess(orderCode);

    // 4. Redirect to success page with order code
    window.location.href = `/checkout/success?orderCode=${orderCode}`;
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <p className="text-sm text-red-600 font-semibold">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="w-full h-12 rounded-lg bg-[#F14D5D] hover:bg-[#d43f4d] text-white font-bold disabled:opacity-60"
      >
        {processing ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="animate-spin" size={16} />{" "}
            {t("processing_payment")}
          </span>
        ) : (
          t("pay_now")
        )}
      </button>
      <p className="text-xs text-gray-500">{t("card_form_instruction")}</p>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState(() => user?.email ?? "");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Turkey");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [intentData, setIntentData] = useState<IntentPayload | null>(null);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [legalError, setLegalError] = useState(false);
  const [revolutLoading, setRevolutLoading] = useState(false);
  const [podLoading, setPodLoading] = useState(false);
  const stripeConfigured = stripePublishableKey.trim().length > 0;

  const localSubtotal = calculateSubtotal(cart);
  const localPromo = getPromoByCode(promoCode);
  const localDiscount = Math.min(
    calculateDiscount(localSubtotal, localPromo),
    localSubtotal,
  );
  const localTotal = Math.max(localSubtotal - localDiscount, 0);

  const canInitPayment = useMemo(() => {
    return (
      cart.length > 0 &&
      email.trim().length > 3 &&
      deliveryAddress.trim().length > 5
    );
  }, [cart.length, email, deliveryAddress]);

  // --- SUPABASE SİPARİŞ KAYIT FONKSİYONU ---
  const createOrderInSupabase = async (): Promise<string | null> => {
    try {
      // Generate random order code (Ex: BLND-8X4M9Q)
      const orderNumber = `BLND-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // 1. Save main order (orders)
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          customer_email: email.trim(),
          customer_name: fullName.trim(),
          customer_phone: phone.trim(),
          shipping_country: country.trim(), // Shipping address details could be added to separate columns in the future
          total_amount: localTotal,
          discount_amount: localDiscount,
          status: "pending",
          payment_status: "pending",
          order_number: orderNumber,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Save order items (order_items)
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        product_title: item.title,
        quantity: item.quantity,
        price_at_purchase:
          typeof item.price === "number" ? item.price : parsePrice(item.price),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return orderNumber;
    } catch (err: unknown) {
      console.error(
        "Order could not be saved to database:",
        getErrorMessage(err),
      );
      return null;
    }
  };

  const fetchSavedCards = async () => {
    if (!email.trim()) return;
    try {
      setCardsLoading(true);
      const response = await fetch("/api/payments/saved-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerEmail: email.trim() }),
      });
      const data = await safeParseResponseBody(response);
      if (!response.ok)
        throw new Error(data?.error ?? "Failed to load saved cards.");
      setSavedCards(
        Array.isArray(data.paymentMethods) ? data.paymentMethods : [],
      );
    } catch {
      setSavedCards([]);
    } finally {
      setCardsLoading(false);
    }
  };

  const checkLegalConsent = () => {
    if (!legalAccepted) {
      setIntentError(t("legal_consent_error"));
      setLegalError(true);
      const legalSection = document.getElementById("legal-consent");
      legalSection?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    setIntentError(null);
    setLegalError(false);
    return true;
  };

  const createPaymentIntent = async () => {
    if (!canInitPayment) {
      setIntentError(t("cart_email_error"));
      return;
    }
    if (!checkLegalConsent()) return;

    setLoadingIntent(true);
    setIntentData(null);

    try {
      const payloadCart = cart.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price:
          typeof item.price === "number" ? item.price : parsePrice(item.price),
      }));

      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: payloadCart,
          promoCode: promoCode.trim(),
          customerEmail: email.trim(),
          saveCard,
        }),
      });

      const data = await safeParseResponseBody(response);
      if (!response.ok)
        throw new Error(data?.error ?? "Failed to initialize payment.");

      setIntentData(data);
      await fetchSavedCards();
    } catch (error: unknown) {
      setIntentError(
        error instanceof Error ? error.message : "Unexpected checkout error.",
      );
    } finally {
      setLoadingIntent(false);
    }
  };

  const startRevolutCheckout = async () => {
    if (!canInitPayment) {
      setIntentError(t("cart_email_error"));
      return;
    }
    if (!checkLegalConsent()) return;

    setRevolutLoading(true);
    try {
      // 1. Save order to Supabase
      const orderCode = await createOrderInSupabase();
      if (!orderCode) {
        throw new Error(t("order_save_error"));
      }

      // 2. Revolut API'sine bağlan
      const payloadCart = cart.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price:
          typeof item.price === "number" ? item.price : parsePrice(item.price),
      }));

      const response = await fetch("/api/payments/revolut/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: payloadCart,
          promoCode: promoCode.trim(),
          customerEmail: email.trim(),
          fullName: fullName.trim(),
        }),
      });

      const data = await safeParseResponseBody(response);
      if (!response.ok || !data?.checkoutUrl) {
        throw new Error(
          data?.error ?? "Failed to initialize Revolut checkout.",
        );
      }
      window.location.href = String(data.checkoutUrl);
    } catch (error: unknown) {
      setIntentError(
        error instanceof Error
          ? error.message
          : "Unexpected Revolut checkout error.",
      );
    } finally {
      setRevolutLoading(false);
    }
  };

  const handlePayOnDelivery = async () => {
    if (!canInitPayment) {
      setIntentError(t("cart_email_error"));
      return;
    }
    if (!checkLegalConsent()) return;

    setPodLoading(true);
    // Save order and redirect to success page
    const orderCode = await createOrderInSupabase();
    if (!orderCode) {
      setIntentError(t("order_save_error"));
      setPodLoading(false);
      return;
    }

    window.location.href = `/checkout/success?orderCode=${orderCode}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1FBF8] via-white to-[#F6FAFF]">
      <CheckoutProgress currentStep={2} />
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#2CB391] font-bold">
              Secure Checkout
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-[#1A2E35] mt-1">
              Delivery & Payment
            </h1>
          </div>
          <Link
            href="/cart"
            className="text-sm font-bold text-gray-500 hover:text-gray-700 inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Back to cart
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-lg text-[#1A2E35] mb-4 inline-flex items-center gap-2">
                <User size={18} /> {t("shipping_contact_details")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    {t("full_name")}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#2CB391]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    {t("country")}
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#2CB391]"
                    placeholder="Turkey"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2 inline-flex items-center gap-1">
                    <Mail size={13} /> {t("email_address")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#2CB391]"
                    placeholder="customer@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2 inline-flex items-center gap-1">
                    <Phone size={13} /> {t("phone_number")}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#2CB391]"
                    placeholder="+90 555 000 0000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    {t("delivery_address")}
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    required
                    className="w-full min-h-[100px] rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#2CB391] resize-none"
                    placeholder="Street name, building number, apartment..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    {t("city")}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    required
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#2CB391]"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    {t("zip_code")}
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(event) => setZipCode(event.target.value)}
                    required
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#2CB391]"
                    placeholder="12345"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-lg text-[#1A2E35] mb-4 inline-flex items-center gap-2">
                <CreditCard size={18} /> Payment method
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    Promo code / voucher (optional)
                  </label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(event) =>
                      setPromoCode(event.target.value.toUpperCase())
                    }
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#2CB391]"
                    placeholder="GIFT10"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    No code? Leave this empty and continue.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(event) => setSaveCard(event.target.checked)}
                  />
                  Save this card for future payments
                </label>

                <div
                  id="legal-consent"
                  className={`rounded-lg p-3 ${
                    legalError
                      ? "border border-red-300 bg-red-50"
                      : "border border-gray-200 bg-gray-50"
                  }`}
                >
                  <label className="inline-flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={legalAccepted}
                      onChange={(event) => {
                        setLegalAccepted(event.target.checked);
                        if (event.target.checked) setLegalError(false);
                      }}
                      className="mt-1"
                    />
                    <span>
                      I accept{" "}
                      <Link
                        href="/legal/mesafeli-satis-sozlesmesi"
                        className="text-[#2CB391] font-semibold hover:underline"
                      >
                        Distance Sales Agreement
                      </Link>
                      ,{" "}
                      <Link
                        href="/legal/iade-iptal-kosullari"
                        className="text-[#2CB391] font-semibold hover:underline"
                      >
                        Refund & Cancellation
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/legal/kvkk-aydinlatma-metni"
                        className="text-[#2CB391] font-semibold hover:underline"
                      >
                        KVKK Privacy Notice
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={startRevolutCheckout}
                  disabled={revolutLoading || !canInitPayment}
                  className="w-full h-12 rounded-lg bg-white border border-[#1A2E35] text-[#1A2E35] hover:bg-gray-50 font-bold disabled:opacity-60"
                >
                  {revolutLoading
                    ? "Redirecting to Revolut..."
                    : "Pay with Revolut"}
                </button>
                <p className="text-xs text-gray-500">
                  Revolut hosted checkout page for real card payments and wallet
                  methods.
                </p>

                <button
                  type="button"
                  onClick={createPaymentIntent}
                  disabled={
                    loadingIntent || !canInitPayment || !stripeConfigured
                  }
                  className="w-full h-12 rounded-lg bg-[#2CB391] hover:bg-[#249278] text-white font-bold disabled:opacity-60"
                >
                  {loadingIntent
                    ? "Preparing secure payment..."
                    : "Open card details form"}
                </button>
                {!intentData?.clientSecret && stripeConfigured && (
                  <p className="text-xs text-gray-500">
                    Click “Open card details form” to enter card number, expiry
                    date, and CVV.
                  </p>
                )}
                {!stripeConfigured && (
                  <p className="text-xs text-amber-700 font-semibold">
                    Online card payment is not configured yet. Add
                    `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`
                    to enable it.
                  </p>
                )}
                {!stripeConfigured && (
                  <button
                    type="button"
                    onClick={handlePayOnDelivery}
                    disabled={podLoading || !canInitPayment}
                    className="w-full h-12 rounded-lg border border-[#2CB391] text-[#2CB391] font-bold inline-flex items-center justify-center hover:bg-[#E8F5F1] disabled:opacity-60"
                  >
                    {podLoading
                      ? "Saving order..."
                      : "Continue with Pay on delivery"}
                  </button>
                )}

                {intentError && (
                  <p className="text-sm text-red-600 font-semibold">
                    {intentError}
                  </p>
                )}
              </div>

              {intentData?.clientSecret && (
                <div className="mt-6 border-t pt-6">
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret: intentData.clientSecret }}
                  >
                    <PaymentForm
                      customerEmail={email.trim()}
                      customerName={fullName.trim()}
                      onBeforePayment={createOrderInSupabase}
                      onPaymentSuccess={async (orderCode) => {
                        await supabase
                          .from("orders")
                          .update({ payment_status: "paid" })
                          .eq("order_number", orderCode);
                      }}
                    />
                  </Elements>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 h-fit">
            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
              <h2 className="font-bold text-lg text-[#1A2E35] mb-4">
                {t("order_summary")}
              </h2>

              <div className="space-y-2 text-sm max-h-60 overflow-y-auto pr-1">
                {cart.length === 0 && (
                  <p className="text-gray-500">No items in cart yet.</p>
                )}
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span className="text-gray-700">
                      {item.title} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {(parsePrice(item.price) * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{localSubtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-teal-700">
                  <span>Discount</span>
                  <span>-{localDiscount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-xl font-black text-[#1A2E35] pt-1">
                  <span>Total</span>
                  <span>{localTotal.toFixed(2)} €</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-gray-700">
                    Saved cards for this email
                  </h3>
                  <button
                    type="button"
                    onClick={fetchSavedCards}
                    className="text-xs font-bold text-[#2CB391] hover:underline"
                  >
                    Refresh
                  </button>
                </div>
                {cardsLoading ? (
                  <p className="text-xs text-gray-500">Loading cards...</p>
                ) : savedCards.length === 0 ? (
                  <p className="text-xs text-gray-500">No saved cards yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {savedCards.map((card) => (
                      <li
                        key={card.id}
                        className="text-xs bg-white border rounded px-3 py-2"
                      >
                        {card.brand.toUpperCase()} •••• {card.last4}{" "}
                        {card.expMonth}/{card.expYear}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
