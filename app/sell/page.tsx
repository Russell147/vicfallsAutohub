import type { Metadata } from "next";
import { SellCarForm } from "@/components/SellCarForm";

export const metadata: Metadata = { title: "Sell your car" };

export default function SellPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-brand">For private sellers</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Sell your car</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
          Add your vehicle details and contact information. Your listing will be published
          immediately for buyers across Zimbabwe to find.
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8">
        <SellCarForm />
      </div>
    </section>
  );
}
