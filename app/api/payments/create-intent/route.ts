import { NextRequest } from "next/server";
import { calculateDiscount, calculateSubtotal, getPromoByCode } from "@/app/lib/pricing";
import { getStripe } from "@/app/lib/stripe";

type PaymentCartItem = {
  id: string | number;
  title: string;
  price: string | number;
  quantity: number;
};

const findOrCreateCustomerByEmail = async (stripe: ReturnType<typeof getStripe>, email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingCustomers = await stripe.customers.list({
    email: normalizedEmail,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  return stripe.customers.create({ email: normalizedEmail });
};

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await request.json();
    const cart: PaymentCartItem[] = Array.isArray(body?.cart) ? body.cart : [];
    const promoCode: string = typeof body?.promoCode === "string" ? body.promoCode : "";
    const customerEmail: string = typeof body?.customerEmail === "string" ? body.customerEmail : "";
    const saveCard = Boolean(body?.saveCard);

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
    const amountInKurus = Math.round(finalAmount * 100);

    if (amountInKurus < 50) {
      return Response.json({ error: "Amount too small to process." }, { status: 400 });
    }

    const customer = await findOrCreateCustomerByEmail(stripe, customerEmail);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInKurus,
      currency: "eur",
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      receipt_email: customerEmail.trim().toLowerCase(),
      setup_future_usage: saveCard ? "off_session" : undefined,
      metadata: {
        subtotal: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        promoCode: promo?.code ?? "",
      },
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
      subtotal,
      discountAmount,
      finalAmount,
      appliedPromoCode: promo?.code ?? null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected payment error.";
    return Response.json({ error: message }, { status: 500 });
  }
}
