"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { movies, formatCurrency } from "@/lib/products";
import { useBasket } from "@/lib/basket";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function CheckoutPage() {
  const { basket } = useBasket();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const basketWithMovies = useMemo(
    () =>
      basket
        .map((line) => {
          const movie = movies.find((item) => item.id === line.id);
          return movie ? { ...movie, quantity: line.quantity } : null;
        })
        .filter((item) => item !== null),
    [basket]
  );

  const total = useMemo(
    () =>
      basketWithMovies.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      ),
    [basketWithMovies]
  );

  const handleStripeCheckout = async () => {
    if (!basket.length) {
      return;
    }

    if (!stripePromise) {
      setError(
        "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: basket }),
      });

      const data = (await response.json()) as {
        clientSecret?: string;
        error?: string;
      };

      if (!response.ok || !data.clientSecret) {
        throw new Error(
          data.error ??
            "Unable to create checkout session. Check Stripe keys in .env.local."
        );
      }

      setClientSecret(data.clientSecret);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="cinema-bg flex min-h-screen flex-col px-6 py-10 text-[var(--cinema-black)] sm:px-10 sm:py-14">
      <section className="mx-auto w-full max-w-4xl rounded-3xl border border-[var(--cinema-border)] bg-[var(--cinema-paper)] p-7 shadow-[0_24px_70px_rgba(17,24,39,0.16)] sm:p-10">
        <p className="font-display text-sm uppercase tracking-[0.18em] text-[var(--cinema-red)]">
          Checkout
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none sm:text-6xl">
          Complete your booking
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--cinema-muted)] sm:text-base">
          Pay securely without leaving the cinema. Ticket quantities and prices are
          validated on the server before Stripe loads the payment form.
        </p>

        {basketWithMovies.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--cinema-border)] bg-white/60 p-5">
            <p className="text-sm text-[var(--cinema-muted)]">
              Your ticket selection is empty.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-full border border-[var(--cinema-black)] bg-[var(--cinema-black)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--cinema-paper)]"
            >
              Back to Films
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-3">
              {basketWithMovies.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--cinema-border)] bg-white p-4"
                >
                  <div>
                    <p className="font-display text-2xl leading-tight">{item.name}</p>
                    <p className="text-sm text-[var(--cinema-muted)]">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[var(--cinema-border)] pt-5">
              <p className="text-sm text-[var(--cinema-muted)]">Total due</p>
              <p className="text-3xl font-bold">{formatCurrency(total)}</p>
            </div>

            {error ? (
              <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {clientSecret && stripePromise ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--cinema-border)] bg-white p-2 sm:p-4">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ clientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleStripeCheckout}
                  disabled={isLoading}
                  className="rounded-full border border-[var(--cinema-black)] bg-[var(--cinema-black)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--cinema-paper)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Loading secure checkout..." : "Open secure checkout"}
                </button>
                <Link
                  href="/"
                  className="rounded-full border border-[var(--cinema-black)] px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.1em]"
                >
                  Edit Tickets
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
