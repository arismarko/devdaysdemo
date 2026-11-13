# Grand Screen Cinema

An IMAX movie ticket storefront with an embedded Stripe checkout.

## What this demo includes

- Cinematic hero and responsive film programme
- The Odyssey, Spider-Man, and a Pedro Almodóvar retrospective
- Ticket quantities, showtimes, ratings, and GBP pricing
- Lightweight load/stagger animations and custom project theme variables
- Basket flow with a dedicated checkout page
- Stripe Checkout Session integration via server API route

## Run locally

```bash
npm run dev
```

Open http://localhost:3000.

## Key files

- `app/page.tsx`: cinema hero, programme, and ticket selection
- `app/layout.tsx`: project metadata and font setup
- `app/globals.css`: custom theme colors, typography, and animation styles
- `app/checkout/page.tsx`: checkout summary and embedded Stripe widget
- `app/api/checkout-session/route.ts`: creates Stripe checkout sessions
- `lib/products.ts`: shared movie programme used by UI and Stripe route

## Stripe setup

Create a `.env.local` file with:

```bash
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then run `npm run dev`, add tickets, and open the secure embedded checkout.
