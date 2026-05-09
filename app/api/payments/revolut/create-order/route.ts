import { NextRequest } from "next/server";
import { calculateDiscount, calculateSubtotal, getPromoByCode, parsePrice } from "@/app/lib/pricing";
import { getRevolutConfig } from "@/app/lib/revolut";

export const runtime = "nodejs";

type CheckoutItem = {
  id: string | number;
  title: string;
  price: number | string;
  quantity: number;
};

const getBaseUrl = (request: NextRequest) => {
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) throw new Error("Cannot determine host.");
  return `${proto}://${host}`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cart: CheckoutItem[] = Array.isArray(body?.cart) ? body.cart : [];
    const promoCode: string = typeof body?.promoCode === "string" ? body.promoCode : "";
    const customerEmail: string = typeof body?.customerEmail === "string" ? body.customerEmail : "";
    const fullName: string = typeof body?.fullName === "string" ? body.fullName : "";

    if (!cart.length) {
      return Response.json({ error: "Cart is empty." }, { status: 400 });
    }
    if (!customerEmail.trim()) {
      return Response.json({ error: "Customer email is required." }, { status: 400 });
    }

    const subtotal = calculateSubtotal(cart);
    if (subtotal <= 0) {
      return Response.json({ error: "Invalid cart total." }, { status: 400 });
    }

    const promo = getPromoByCode(promoCode);
    if (promo?.minSubtotal && subtotal < promo.minSubtotal) {
      return Response.json(
        { error: `Promo code requires minimum ${promo.minSubtotal.toFixed(2)} € subtotal.` },
        { status: 400 },
      );
    }

    const discountAmount = Math.min(calculateDiscount(subtotal, promo), subtotal);
    const finalAmount = Math.max(subtotal - discountAmount, 0);
    const amountInMinor = Math.round(finalAmount * 100);

    if (amountInMinor < 50) {
      return Response.json({ error: "Amount too small to process." }, { status: 400 });
    }

    const { secretKey, apiVersion, baseUrl } = getRevolutConfig();
    const baseSiteUrl = getBaseUrl(request);
    const orderReference = `ORDER-${Date.now()}`;

    const orderPayload = {
      amount: amountInMinor,
      currency: "EUR",
      description: "Web Library Shop order",
      redirect_url: `${baseSiteUrl}/checkout/success?provider=revolut`,
      merchant_order_data: {
        reference: orderReference,
      },
      customer: {
        email: customerEmail.trim().toLowerCase(),
        full_name: fullName.trim() || undefined,
      },
      metadata: {
        promoCode: promo?.code ?? "",
        subtotal: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
      },
      line_items: cart.map((item) => ({
        name: item.title,
        quantity: Math.max(1, item.quantity),
        unit_price_amount: Math.round(parsePrice(item.price) * 100),
      })),
    };

    const response = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Revolut-Api-Version": apiVersion,
      },
      body: JSON.stringify(orderPayload),
    });

    const raw = await response.text();
    let data: Record<string, unknown> | null = null;
    try {
      data = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      return Response.json(
        { error: (data?.message as string) || (data?.error as string) || "Failed to create Revolut order." },
        { status: response.status },
      );
    }

    const checkoutUrl = data?.checkout_url;
    if (typeof checkoutUrl !== "string" || !checkoutUrl) {
      return Response.json({ error: "Missing checkout_url in Revolut response." }, { status: 400 });
    }

    return Response.json({
      checkoutUrl,
      orderId: data?.id ?? null,
      totals: {
        subtotal,
        discountAmount,
        finalAmount,
        appliedPromoCode: promo?.code ?? null,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected Revolut error.";
    return Response.json({ error: message }, { status: 500 });
  }
}

