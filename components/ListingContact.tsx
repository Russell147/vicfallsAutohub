"use client";

import type { FormEvent } from "react";

function getWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `263${digits.slice(1)}`;
  return digits;
}

export function ListingContact({
  carName,
  phone,
}: {
  carName: string;
  phone: string;
}) {
  const whatsappNumber = getWhatsAppNumber(phone);

  function sendInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const contactNumber = String(formData.get("contactNumber") ?? "").trim();
    const inquiry = String(formData.get("inquiry") ?? "").trim();
    const message = [
      `Hello, I'm interested in the ${carName}.`,
      `Name: ${name}`,
      contactNumber ? `My phone number: ${contactNumber}` : "",
      `Inquiry: ${inquiry}`,
    ].filter(Boolean).join("\n");
    const whatsappWindow = window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );

    if (whatsappWindow) {
      whatsappWindow.opener = null;
    } else {
      window.location.assign(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      );
    }
  }

  if (!whatsappNumber) {
    return (
      <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-[var(--muted)]">
        This seller has not provided a phone number for calls or inquiries.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <a
        className="block rounded-lg bg-brand px-4 py-3 text-center font-bold text-white transition hover:bg-brand-dark"
        href={`tel:${phone}`}
      >
        Call seller
      </a>
      <a
        className="block rounded-lg bg-[#25D366] px-4 py-3 text-center font-bold text-white transition hover:bg-[#1fb85a]"
        href={`https://wa.me/${whatsappNumber}`}
        rel="noreferrer"
        target="_blank"
      >
        WhatsApp seller
      </a>
      <form className="space-y-3 border-t border-[var(--line)] pt-4" onSubmit={sendInquiry}>
        <h3 className="font-bold">Send an inquiry</h3>
        <label className="block space-y-1 text-sm font-medium">
          <span>Your name</span>
          <input
            autoComplete="name"
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5"
            name="name"
            required
          />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          <span>Your phone number <span className="font-normal text-[var(--muted)]">(optional)</span></span>
          <input
            autoComplete="tel"
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5"
            name="contactNumber"
            type="tel"
          />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          <span>Message</span>
          <textarea
            className="w-full resize-y rounded-lg border border-[var(--line)] px-3 py-2.5"
            name="inquiry"
            required
            rows={4}
          />
        </label>
        <button
          className="w-full rounded-lg border border-brand px-4 py-3 text-center font-bold text-brand transition hover:bg-emerald-50"
          type="submit"
        >
          Send inquiry via WhatsApp
        </button>
        <p className="text-xs leading-5 text-[var(--muted)]">
          Your message will open in WhatsApp so you can review and send it to the seller.
        </p>
      </form>
    </div>
  );
}
