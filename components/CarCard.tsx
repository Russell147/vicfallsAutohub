import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/lib/cars";

export function CarCard({ car }: { car: Car }) {
  return (
    <Link
      className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      href={`/listings/${car.id}`}
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {car.images[0] ? (
          <Image
            alt={`${car.year} ${car.make} ${car.model}`}
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={car.images[0]}
            unoptimized={car.images[0].startsWith("http")}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Photo unavailable
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
          {car.year}
        </span>
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-ink">{car.priceLabel}</p>
        <h3 className="mt-1 truncate font-semibold text-ink">
          {car.make} {car.model}
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
          <span>{car.mileageLabel}</span>
          <span>{car.transmission}</span>
          <span>{car.location}</span>
        </div>
      </div>
    </Link>
  );
}
