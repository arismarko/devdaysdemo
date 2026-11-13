import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="cinema-bg flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 sm:py-14">
      <section className="w-full max-w-2xl rounded-3xl border border-[var(--cinema-border)] bg-[var(--cinema-paper)] p-8 text-[var(--cinema-black)] shadow-[0_24px_70px_rgba(17,24,39,0.16)] sm:p-10">
        <p className="font-display text-sm uppercase tracking-[0.18em] text-[var(--cinema-red)]">
          Payment Success
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none sm:text-6xl">
          Your seats are booked
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--cinema-muted)] sm:text-base">
          Stripe has confirmed your payment. Your digital IMAX tickets are on
          their way to your inbox.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full border border-[var(--cinema-black)] bg-[var(--cinema-black)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--cinema-paper)]"
        >
          Browse More Films
        </Link>
      </section>
    </main>
  );
}
