import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-brand">404</p>
      <h1 className="mt-3 text-3xl font-extrabold">Vehicle not found</h1>
      <p className="mt-3 text-[var(--muted)]">This listing may have been removed or the link may be incorrect.</p>
      <Link className="mt-7 inline-flex rounded-lg bg-brand px-5 py-3 font-bold text-white hover:bg-brand-dark" href="/browse">
        Browse available cars
      </Link>
    </section>
  );
}
