# Zim Car Sales

Next.js App Router application styled with Tailwind CSS. The original listing
data and photos were migrated into `data/cars.json` and `public/`; private sellers
can also publish listings through Supabase.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run `npm run build` for a
production build and `npm start` to serve it.

## AI assistant

The site-wide assistant uses Google Gemini and the current vehicle inventory.
Set `GEMINI_API_KEY` in the server environment (for local development, create
`.env.local` in the project root) before using it. Keep this key server-side;
never use a `NEXT_PUBLIC_` variable for it. The chat endpoint returns a setup
message when the key is missing.

## Selling a car

Private sellers can use the **Sell your car** link to publish a listing with
vehicle details, contact information, and up to five photos. Publishing requires
a signed-in Supabase account. New listings and their contact details are public
immediately.

Before enabling this flow, configure `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the project environment, then run
[`supabase/car-listings.sql`](./supabase/car-listings.sql) once in the
Supabase SQL Editor. The script creates the public listings table, row-level
security policies, and the public photo bucket. Do not remove those policies:
they restrict listing creation and photo uploads to authenticated sellers.
If the site reports that `public.car_listings` is missing from the schema cache,
run the SQL script again in the Supabase project configured by
`NEXT_PUBLIC_SUPABASE_URL`; it is safe to rerun and requests a PostgREST schema
refresh after setup.
