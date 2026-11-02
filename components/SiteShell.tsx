import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
        <Link aria-label="Autohub home" className="flex items-center gap-2" href="/">
          <Image
            alt=""
            className="h-11 w-auto object-contain"
            height={54}
            priority
            src="/zim-car-sale-logo.png"
            width={190}
          />
          <span className="text-xl font-extrabold tracking-tight text-ink">Autohub</span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-3 text-sm font-semibold sm:gap-7">
          <Link className="text-ink/80 transition hover:text-brand" href="/browse">
            Browse cars
          </Link>
          <Link className="hidden text-ink/80 transition hover:text-brand sm:inline" href="/safety">
            Safety
          </Link>
          <Link
            className="rounded-lg bg-brand px-4 py-2.5 text-white transition hover:bg-brand-dark"
            href="/auth"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-[#102c28] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr] md:py-14">
        <div className="max-w-sm">
          <Link aria-label="Autohub home" className="inline-flex items-center gap-2" href="/">
            <Image
              alt="Autohub logo"
              className="h-12 w-12 shrink-0 object-contain"
              height={64}
              src="/zim-car-sale-logo.png"
              width={64}
            />
            <span className="text-xl font-extrabold tracking-tight">Autohub</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Find your next vehicle from dealers and private sellers across Zimbabwe.
          </p>
        </div>

        <nav aria-label="Footer marketplace links">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/90">Marketplace</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><Link className="transition hover:text-white" href="/browse">Browse cars</Link></li>
            <li><Link className="transition hover:text-white" href="/auth">List a vehicle</Link></li>
            <li><Link className="transition hover:text-white" href="/safety">Safety tips</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/90">Buy with care</h2>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Always inspect a vehicle and its documents in person. Buyers and sellers arrange
            transactions directly; Autohub does not process payments or guarantee a sale.
          </p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Autohub. All rights reserved.</p>
          <p>Zimbabwe&apos;s vehicle marketplace</p>
        </div>
      </div>
    </footer>
  );
}
