import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { moviesById } from "@/lib/products";

type BasketPayloadItem = {
  id: string;
  quantity: number;
};

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY environment variable" },
      { status: 500 }
    );
  }

  let items: BasketPayloadItem[] = [];

  try {
    const body = (await request.json()) as { items?: BasketPayloadItem[] };
    items = Array.isArray(body.items) ? body.items : [];
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!items.length) {
    return NextResponse.json({ error: "Basket is empty" }, { status: 400 });
  }

  const lineItems = items
    .map((item) => {
      if (
        typeof item.id !== "string" ||
        typeof item.quantity !== "number" ||
        item.quantity < 1
      ) {
        return null;
      }

      const product = moviesById.get(item.id);
      if (!product) {
        return null;
      }

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: product.name,
            description: `${product.showtime} · ${product.type}`,
          },
          unit_amount: product.price * 100,
        },
        quantity: Math.floor(item.quantity),
      };
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  if (!lineItems.length) {
    return NextResponse.json(
      { error: "No valid basket items found" },
      { status: 400 }
    );
  }

  const stripe = new Stripe(secretKey);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    request.headers.get("origin") ??
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded_page",
      line_items: lineItems,
      return_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      throw new Error("Stripe did not return a Checkout client secret");
    }

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create Stripe checkout session";

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "Unable to create Stripe checkout session",
      },
      { status: 500 }
    );
  }
}
