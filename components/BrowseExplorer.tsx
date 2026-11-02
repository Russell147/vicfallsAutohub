"use client";

import { useMemo, useState } from "react";
import { CarCard } from "@/components/CarCard";
import type { Car } from "@/lib/cars";

export function BrowseExplorer({
  cars,
  makes,
  initialMake,
}: {
  cars: Car[];
  makes: string[];
  initialMake: string;
}) {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState(initialMake);
  const [maxPrice, setMaxPrice] = useState("");

  const filteredCars = useMemo(() => {
    const term = query.trim().toLowerCase();
    const priceLimit = maxPrice ? Number(maxPrice) : Number.POSITIVE_INFINITY;
    return cars.filter((car) => {
      const matchesTerm = !term || `${car.name} ${car.location}`.toLowerCase().includes(term);
      return matchesTerm && (!make || car.make === make) && car.price <= priceLimit;
    });
  }, [cars, make, maxPrice, query]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-brand">Find your car</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Cars for sale in Zimbabwe</h1>
        <p className="mt-2 text-[var(--muted)]">Browse cars from dealers and private sellers.</p>
      </div>
      <div className="mt-7 grid gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm sm:grid-cols-3">
        <label className="text-sm font-semibold">
          Search
          <input
            className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] px-3 font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Make, model or location"
            type="search"
            value={query}
          />
        </label>
        <label className="text-sm font-semibold">
          Make
          <select
            className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-white px-3 font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            onChange={(event) => setMake(event.target.value)}
            value={make}
          >
            <option value="">All makes</option>
            {makes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Maximum price (USD)
          <input
            className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] px-3 font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            min="0"
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Any price"
            type="number"
            value={maxPrice}
          />
        </label>
      </div>
      <p aria-live="polite" className="my-6 text-sm text-[var(--muted)]">
        <span className="font-bold text-ink">{filteredCars.length}</span> vehicles found
      </p>
      {filteredCars.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => <CarCard car={car} key={car.id} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-bold">No matching vehicles</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Try a different search or clear one of the filters.</p>
        </div>
      )}
    </section>
  );
}
