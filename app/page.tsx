import Link from "next/link";
import { CarCard } from "@/components/CarCard";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { cars, makes } from "@/lib/cars";
import { getPublishedListings } from "@/backend/user-listings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const userListings = await getPublishedListings();
  const inventory = [...userListings, ...cars];
  const featuredCars = inventory.slice(0, 6);
  const availableMakes = [...new Set([...makes, ...userListings.map((car) => car.make)])].sort();
  const heroSlides = [
    { src: "/assets/hero-car-C1znuMkD.jpg", alt: "SUV in a scenic Zimbabwean landscape" },
    ...inventory.slice(0, 3).filter((car) => car.images[0]).map((car) => ({ src: car.images[0], alt: car.name })),
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#102c28] text-white">
        <HeroSlideshow slides={heroSlides} />
        <div className="relative z-10 mx-auto grid min-h-[510px] max-w-7xl items-center gap-10 px-5 py-16 pb-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
              Find. Sell. Drive.
            </p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
              Find your next car in Zimbabwe.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
              Browse vehicles from dealers and private owners countrywide. No
              accounts needed to browse. Contact the seller directly and meet
              to close the deal.
            </p>
            <Link
              className="mt-8 inline-flex rounded-xl bg-emerald-500 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-400"
              href="/browse"
            >
              Browse {inventory.length} vehicles
            </Link>
            <Link
              className="mt-8 ml-3 inline-flex rounded-xl border border-white/40 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              href="/sell"
            >
              Sell your car
            </Link>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
            <h2 className="text-xl font-bold">Explore popular makes</h2>
            <p className="mt-2 text-sm text-white/70">Start with a make you love.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {availableMakes.slice(0, 8).map((make) => (
                <Link
                  className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/20"
                  href={`/browse?make=${encodeURIComponent(make)}`}
                  key={make}
                >
                  {make}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand">Recently listed</p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Cars for sale</h2>
          </div>
          <Link className="text-sm font-bold text-brand hover:text-brand-dark" href="/browse">
            View all cars →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCars.map((car) => <CarCard car={car} key={car.id} />)}
        </div>
      </section>

      <section
        aria-labelledby="about-heading"
        className="relative isolate overflow-hidden border-y border-[#102c28] bg-[#102c28] text-white"
        id="about"
        style={{
          backgroundImage: "url('/assets/about-cars.jpg')",
          backgroundPosition: "right center",
          backgroundSize: "min(100vw, 735px) auto",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative mx-auto flex min-h-[490px] max-w-7xl items-center px-5 py-14 sm:px-8 md:py-20">
          <div className="max-w-xl rounded-2xl bg-[#102c28]/85 p-6 shadow-lg backdrop-blur-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-300">About Autohub</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl" id="about-heading">
              A simpler way to find your next car in Zimbabwe.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-white/90">
              <p>
                Autohub is a vehicle marketplace bringing together cars listed by dealers and private
                sellers across Zimbabwe. Explore available vehicles, compare the details, and find
                options that suit you.
              </p>
              <p>
                Browse without an account and contact sellers directly. Before making a decision,
                inspect the vehicle and its documents in person, and agree on the transaction with
                the seller.
              </p>
              <Link
                className="inline-flex rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white transition hover:bg-emerald-400"
                href="/browse"
              >
                Explore cars for sale
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
