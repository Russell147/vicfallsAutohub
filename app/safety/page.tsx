import type { Metadata } from "next";

export const metadata: Metadata = { title: "Safety tips and terms" };

const buyerTips = [
  "Always view the vehicle in person, in daylight, in a public place.",
  "Ask for the registration book and check the chassis number matches.",
  "Never send a deposit or mobile money before seeing the car and the papers.",
  "Take a mechanic with you, or get an independent inspection.",
  "If a price looks far below market, treat it as a warning sign.",
];

const sellerTips = [
  "Upload real photos of the actual vehicle; stock images are not allowed.",
  "Describe the condition, service history and any faults accurately.",
  "List each vehicle once. Duplicate listings are blocked automatically.",
  "Mark the listing as sold as soon as the deal is closed.",
];

function TipList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-4">
      {items.map((item) => (
        <li className="flex gap-3 text-sm leading-6 text-[var(--muted)]" key={item}>
          <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function SafetyPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <p className="text-sm font-bold uppercase tracking-wider text-brand">Buy and sell with care</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Safety tips &amp; terms</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-[var(--line)] bg-white p-6">
          <h2 className="text-xl font-bold">For buyers</h2>
          <TipList items={buyerTips} />
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-white p-6">
          <h2 className="text-xl font-bold">For sellers</h2>
          <TipList items={sellerTips} />
        </article>
      </div>
      <article className="mt-5 rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="text-xl font-bold">Platform terms</h2>
        <p className="mt-4 leading-7 text-[var(--muted)]">
          Autohub is a listing venue only. Buyers and sellers are responsible for
          verifying vehicles, ownership, documents and payment arrangements. We do not
          process vehicle payments or guarantee a transaction.
        </p>
      </article>
    </section>
  );
}
