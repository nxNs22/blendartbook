import { NextRequest, NextResponse } from "next/server";
import { calculateDiscount, calculateSubtotal, getPromoByCode, parsePrice } from "@/app/lib/pricing";
import { initializeCheckoutForm } from "@/app/lib/iyzico";

export const runtime = "nodejs";

type CheckoutItem = {
  id: string | number;
  title: string;
  price: number | string;
  quantity: number;
};

const toMoney = (amount: number) => amount.toFixed(2);

const getBaseUrl = (request: NextRequest) => {
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) throw new Error("Cannot determine host for callback URL.");
  return `${proto}://${host}`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: CheckoutItem[] = Array.isArray(body?.items) ? body.items : [];
    const userDetails = (body?.userDetails ?? {}) as { email?: string; name?: string; phone?: string };
    const promoCode = typeof body?.promoCode === "string" ? body.promoCode : "";

    if (items.length === 0) {
      return NextResponse.json({ status: "error", error: "Cart is empty." }, { status: 400 });
    }

    const subtotal = calculateSubtotal(items);
    if (subtotal <= 0) {
      return NextResponse.json({ status: "error", error: "Invalid cart total." }, { status: 400 });
    }

    const promo = getPromoByCode(promoCode);
    if (promo?.minSubtotal && subtotal < promo.minSubtotal) {
      return NextResponse.json(
        { status: "error", error: `Promo code requires minimum ${promo.minSubtotal.toFixed(2)} € subtotal.` },
        { status: 400 },
      );
    }

    const discount = Math.min(calculateDiscount(subtotal, promo), subtotal);
    const paidPrice = Math.max(subtotal - discount, 0);
    if (paidPrice <= 0) {
      return NextResponse.json({ status: "error", error: "Order total must be greater than zero." }, { status: 400 });
    }

    const [name = "Customer", surname = "User"] = (userDetails.name?.trim() || "Customer User").split(" ");
    const baseUrl = getBaseUrl(request);
    const callbackUrl = `${baseUrl}/api/webhooks/payment`;
    const basketId = `BASKET-${Date.now()}`;

    const basketItems = items.map((item, index) => ({
      id: String(item.id),
      name: item.title.slice(0, 120),
      category1: "Book",
      itemType: "PHYSICAL",
      price: toMoney(parsePrice(item.price) * Math.max(1, item.quantity)),
      ...(index === 0 ? {} : {}),
    }));

    const initRequest = {
      locale: "tr",
      conversationId: `conv-${Date.now()}`,
      price: toMoney(subtotal),
      paidPrice: toMoney(paidPrice),
      currency: "TRY",
      basketId,
      paymentGroup: "PRODUCT",
      callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: `buyer-${Date.now()}`,
        name,
        surname,
        gsmNumber: userDetails.phone || "+905555555555",
        email: userDetails.email || "customer@example.com",
        identityNumber: "11111111111",
        lastLoginDate: "2025-01-01 12:00:00",
        registrationDate: "2025-01-01 12:00:00",
        registrationAddress: "N/A",
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
      },
      shippingAddress: {
        contactName: `${name} ${surname}`,
        city: "Istanbul",
        country: "Turkey",
        address: "N/A",
        zipCode: "34000",
      },
      billingAddress: {
        contactName: `${name} ${surname}`,
        city: "Istanbul",
        country: "Turkey",
        address: "N/A",
        zipCode: "34000",
      },
      basketItems,
    };

    const result = await initializeCheckoutForm(initRequest);
    if (result.status !== "success" || !result.paymentPageUrl) {
      return NextResponse.json(
        { status: "error", error: result.errorMessage || "iyzico checkout initialization failed." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      status: "success",
      paymentUrl: result.paymentPageUrl,
      token: result.token,
      totals: {
        subtotal,
        discount,
        paidPrice,
        promoCode: promo?.code ?? null,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected checkout error.";
    return NextResponse.json({ status: "error", error: message }, { status: 500 });
  }
}
