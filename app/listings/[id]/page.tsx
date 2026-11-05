import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingContact } from "@/components/ListingContact";
import { getCar } from "@/lib/cars";
import { getPublishedListing } from "@/backend/user-listings";

export const dynamic = "force-dynamic";

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ listed?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const car = getCar(id) ?? await getPublishedListing(id);
  if (!car) notFound();

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--muted)]">
        <Link className="hover:text-brand" href="/browse">Browse cars</Link>
        <span className="mx-2">/</span>
        <span>{car.name}</span>
      </nav>
      {query.listed === "1" && (
        <p aria-live="polite" className="mb-5 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-900" role="status">
          Your car is now published and visible to buyers.
        </p>
      )}
      <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 sm:aspect-[16/10]">
            {car.images[0] && (
              <Image alt={car.name} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 65vw" src={car.images[0]} unoptimized={car.images[0].startsWith("http")} />
            )}
          </div>
          {car.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {car.images.slice(1, 5).map((image) => (
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100" key={image}>
                  <Image alt={`${car.name} photo`} className="object-cover" fill sizes="20vw" src={image} unoptimized={image.startsWith("http")} />
                </div>
              ))}
            </div>
          )}
          <article className="mt-7 rounded-2xl border border-[var(--line)] bg-white p-6">
            <h2 className="text-xl font-bold">Vehicle details</h2>
            <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">
              {[
                ["Year", car.year],
                ["Mileage", car.mileageLabel],
                ["Transmission", car.transmission],
                ["Fuel", car.fuel],
                ["Engine", car.engine],
                ["Colour", car.colour || "Not specified"],
                ["Location", car.location],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-[var(--muted)]">{label}</dt>
                  <dd className="mt-1 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-7 font-bold">Description</h3>
            <p className="mt-2 whitespace-pre-line leading-7 text-[var(--muted)]">{car.description || "No description provided."}</p>
          </article>
        </div>
        <aside className="space-y-5 lg:sticky lg:top-6">
          <article className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
            <p className="text-sm text-[var(--muted)]">{car.year} {car.make}</p>
            <h1 className="mt-1 text-2xl font-extrabold">{car.name}</h1>
            <p className="mt-4 text-3xl font-extrabold text-brand">{car.priceLabel}</p>
            <div className="mt-5 border-t border-[var(--line)] pt-5">
              <h2 className="font-bold">Seller</h2>
              <p className="mt-1">{car.seller || "Private seller"}</p>
              <p className="text-sm text-[var(--muted)]">{(car.sellerType || "Private seller").split(" · ")[0]} · {car.location}</p>
              <ListingContact carName={car.name} phone={car.phone} />
            </div>
          </article>
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            Never pay a deposit before viewing the vehicle and its papers in person.{" "}
            <Link className="font-bold underline" href="/safety">Read safety tips</Link>.
          </p>
        </aside>
      </div>
    </section>
  );
}
