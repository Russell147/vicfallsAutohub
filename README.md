# Zim Car Sales

Next.js App Router application styled with Tailwind CSS. The listing data and
photos were migrated from the captured site into `data/cars.json` and `public/`.

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

The sign-in and registration screens are UI-only until an authentication
provider is configured; they explicitly report that limitation instead of
accepting credentials or showing a false success.
