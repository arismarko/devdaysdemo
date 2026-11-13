"use client";

import Link from "next/link";
import { useMemo } from "react";
import { movies, formatCurrency } from "@/lib/products";
import { useBasket } from "@/lib/basket";

export default function Home() {
  const { basket, updateBasket } = useBasket();

  const changeTicketCount = (movieId: string, change: number) => {
    updateBasket((current) => {
      const existing = current.find((item) => item.id === movieId);
      if (!existing && change > 0) {
        return [...current, { id: movieId, quantity: 1 }];
      }

      return current
        .map((item) =>
          item.id === movieId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

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

  const ticketCount = useMemo(
    () => basket.reduce((total, item) => total + item.quantity, 0),
    [basket]
  );

  const basketTotal = useMemo(
    () =>
      basketWithMovies.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      ),
    [basketWithMovies]
  );

  return (
    <main className="cinema-bg min-h-screen px-5 py-6 text-[var(--cinema-paper)] sm:px-10 sm:py-10">
      <section className="reveal mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/15 bg-[var(--cinema-black)] shadow-2xl">
        <div className="grid min-h-[520px] lg:grid-cols-[1.25fr_0.75fr]">
          <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--cinema-red)]">
               Athens
              </p>
              <h1 className="mt-8 max-w-4xl font-display text-7xl leading-[0.82] sm:text-8xl lg:text-[8.5rem]">
                Athens
                <br />
                <span className="text-[var(--cinema-red)]">IMAX</span>
              </h1>
            </div>
            <div className="mt-12 flex flex-col gap-5 border-t border-white/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                New releases and a vivid Pedro Almodóvar retrospective,
                presented in IMAX with laser and room-filling sound.
              </p>
              <a href="#now-showing" className="shrink-0 rounded-full bg-[var(--cinema-red)] px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-white">
                Find a film
              </a>
            </div>
          </div>

          <div className="hero-marquee relative flex min-h-80 items-end overflow-hidden p-8 sm:p-10">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">Opening night · IMAX 70mm</p>
              <p className="mt-3 font-display text-6xl leading-none sm:text-7xl">The Odyssey</p>
              <p className="mt-4 text-sm text-white/70">Friday · 19:30 · Screen One</p>
            </div>
          </div>
        </div>
      </section>

      <section id="now-showing" className="mx-auto mt-16 w-full max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--cinema-red)]">Now showing</p>
            <h2 className="mt-3 font-display text-6xl leading-none sm:text-7xl">Choose your screen</h2>
          </div>
          <a href="#tickets" className="text-sm font-semibold text-white/65">
            {ticketCount} ticket{ticketCount === 1 ? "" : "s"} selected ↓
          </a>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie, index) => (
            <article key={movie.id} className="stagger group overflow-hidden rounded-3xl border border-white/15 bg-[var(--cinema-card)]">
              <div className={`movie-poster ${movie.posterClass} relative flex aspect-[16/10] items-end overflow-hidden p-6`}>
                <span className="absolute right-5 top-4 font-display text-8xl text-white/10">{String(index + 1).padStart(2, "0")}</span>
                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">{movie.director}</p>
                  <h3 className="mt-2 max-w-sm font-display text-4xl leading-[0.9] sm:text-5xl">{movie.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-[var(--cinema-red)]">
                  <span>{movie.showtime}</span><span>{movie.certificate}</span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.12em] text-white/45">{movie.type}</p>
                <p className="mt-4 min-h-12 text-sm leading-6 text-white/65">{movie.details}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <p className="text-xl font-bold">{formatCurrency(movie.price)}</p>
                  <button onClick={() => changeTicketCount(movie.id, 1)} className="rounded-full border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition hover:border-[var(--cinema-red)] hover:bg-[var(--cinema-red)]">Add ticket</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="tickets" className="mx-auto mt-16 w-full max-w-7xl rounded-[2rem] bg-[var(--cinema-paper)] p-7 text-[var(--cinema-black)] sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--cinema-red)]">Your booking</p>
            <h2 className="mt-2 font-display text-5xl leading-none sm:text-6xl">Tickets</h2>
          </div>
          <p className="text-sm text-black/55">{ticketCount} seat{ticketCount === 1 ? "" : "s"} reserved</p>
        </div>

        {basketWithMovies.length === 0 ? (
          <p className="mt-7 rounded-2xl border border-dashed border-black/20 p-5 text-sm text-black/55">No tickets yet. Choose a showing above to start your booking.</p>
        ) : (
          <div className="mt-7 divide-y divide-black/10 border-y border-black/10">
            {basketWithMovies.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-3xl leading-none">{item.name}</p>
                  <p className="mt-2 text-sm text-black/50">{item.showtime} · {item.type}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-full border border-black/20">
                    <button onClick={() => changeTicketCount(item.id, -1)} className="h-9 w-10" aria-label={`Remove one ${item.name} ticket`}>−</button>
                    <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => changeTicketCount(item.id, 1)} className="h-9 w-10" aria-label={`Add one ${item.name} ticket`}>+</button>
                  </div>
                  <p className="min-w-20 text-right font-bold">{formatCurrency(item.price * item.quantity)}</p>
                  <button onClick={() => changeTicketCount(item.id, -item.quantity)} className="text-xs font-bold uppercase tracking-wider text-black/45">Remove</button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-black/50">Digital tickets · No booking fee</p>
          <div className="flex items-center gap-5">
            <p className="font-display text-4xl">{formatCurrency(basketTotal)}</p>
            {ticketCount > 0 ? (
              <Link href="/checkout" className="rounded-full bg-[var(--cinema-red)] px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">Continue to payment</Link>
            ) : (
              <button disabled className="cursor-not-allowed rounded-full bg-black/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-black/35">Continue to payment</button>
            )}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-3 py-10 text-xs uppercase tracking-[0.18em] text-white/40 sm:flex-row sm:justify-between">
        <p>Grand Screen Cinema</p><p>IMAX with Laser · 1 Leicester Square, London</p>
      </footer>
    </main>
  );
}
