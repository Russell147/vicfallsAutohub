"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const fieldClassName =
  "mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-white px-3 font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";

export function SellCarForm() {
  const [authStatus, setAuthStatus] = useState<"checking" | "signed-in" | "signed-out" | "unavailable">("checking");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setAuthStatus("unavailable");
      return;
    }

    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setMessage(error.message);
          setAuthStatus("unavailable");
          return;
        }
        setAuthStatus(data.session?.user ? "signed-in" : "signed-out");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : "Unable to check your sign-in status.");
        setAuthStatus("unavailable");
      });

    return () => {
      active = false;
    };
  }, []);

  async function submitListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsPending(true);
    const uploadedPaths: string[] = [];
    let listingPublished = false;
    const supabase = createSupabaseBrowserClient();

    try {
      const formData = new FormData(event.currentTarget);
      if (!supabase) throw new Error("Selling is not configured. Please contact Autohub.");

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Your session has expired. Sign in again to publish your car.");

      const photos = formData.getAll("photos").filter(
        (value): value is File => value instanceof File && value.size > 0,
      );
      if (photos.length > 5) throw new Error("Upload no more than 5 photos.");
      const extensionByType: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      };
      if (photos.some((photo) => !extensionByType[photo.type] || photo.size > 5 * 1024 * 1024)) {
        throw new Error("Photos must be JPG, PNG or WebP files no larger than 5 MB each.");
      }

      for (const photo of photos) {
        const path = `${user.id}/${crypto.randomUUID()}.${extensionByType[photo.type]}`;
        const { error } = await supabase.storage
          .from("car-listing-photos")
          .upload(path, photo, { contentType: photo.type, upsert: false });
        if (error) throw new Error(`Unable to upload photo: ${error.message}`);
        uploadedPaths.push(path);
      }

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make: formData.get("make"),
          model: formData.get("model"),
          year: Number(formData.get("year")),
          price: Number(formData.get("price")),
          mileage: Number(formData.get("mileage")),
          transmission: formData.get("transmission"),
          fuel: formData.get("fuel"),
          engine: formData.get("engine"),
          colour: formData.get("colour"),
          location: formData.get("location"),
          sellerName: formData.get("sellerName"),
          phone: formData.get("phone"),
          description: formData.get("description"),
          imagePaths: uploadedPaths,
        }),
      });
      const result: { id?: string; error?: string } = await response.json();
      if (!response.ok || !result.id) {
        throw new Error(result.error || "Unable to publish your listing. Please try again.");
      }
      listingPublished = true;
      window.location.assign(`/listings/${result.id}?listed=1`);
    } catch (error) {
      let cleanupMessage = "";
      if (!listingPublished && uploadedPaths.length && supabase) {
        const { error: cleanupError } = await supabase.storage
          .from("car-listing-photos")
          .remove(uploadedPaths);
        if (cleanupError) cleanupMessage = ` Photo cleanup failed: ${cleanupError.message}`;
      }
      setMessage(
        `${error instanceof Error ? error.message : "Unable to publish your listing. Please try again."}${cleanupMessage}`,
      );
      setIsPending(false);
    }
  }

  if (authStatus === "checking") {
    return <p aria-live="polite" className="text-sm text-[var(--muted)]">Checking your sign-in…</p>;
  }

  if (authStatus === "unavailable") {
    return (
      <p className="rounded-lg bg-rose-50 p-4 text-sm text-rose-900" role="alert">
        {message || "Selling is not configured yet. Please contact Autohub for help."}
      </p>
    );
  }

  if (authStatus === "signed-out") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
        <p>Sign in or create an account before publishing a car.</p>
        <Link
          className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2.5 font-bold text-white hover:bg-brand-dark"
          href="/auth?next=%2Fsell"
        >
          Sign in to continue
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={submitListing}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Make *
          <input className={fieldClassName} maxLength={60} name="make" placeholder="e.g. Toyota" required />
        </label>
        <label className="block text-sm font-semibold">
          Model *
          <input className={fieldClassName} maxLength={80} name="model" placeholder="e.g. Corolla" required />
        </label>
        <label className="block text-sm font-semibold">
          Year *
          <input className={fieldClassName} max={2100} min={1900} name="year" required type="number" />
        </label>
        <label className="block text-sm font-semibold">
          Asking price (USD) *
          <input className={fieldClassName} min="1" name="price" required type="number" />
        </label>
        <label className="block text-sm font-semibold">
          Mileage (km) *
          <input className={fieldClassName} min="0" name="mileage" required type="number" />
        </label>
        <label className="block text-sm font-semibold">
          Transmission *
          <select className={fieldClassName} defaultValue="" name="transmission" required>
            <option disabled value="">Select transmission</option>
            <option>Automatic</option>
            <option>Manual</option>
            <option>CVT</option>
            <option>Other</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Fuel *
          <select className={fieldClassName} defaultValue="" name="fuel" required>
            <option disabled value="">Select fuel type</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Hybrid</option>
            <option>Electric</option>
            <option>Other</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Engine
          <input className={fieldClassName} maxLength={40} name="engine" placeholder="e.g. 1.8L" />
        </label>
        <label className="block text-sm font-semibold">
          Colour
          <input className={fieldClassName} maxLength={60} name="colour" />
        </label>
        <label className="block text-sm font-semibold">
          Location in Zimbabwe *
          <input className={fieldClassName} maxLength={120} name="location" placeholder="e.g. Harare" required />
        </label>
        <label className="block text-sm font-semibold">
          Your name *
          <input className={fieldClassName} autoComplete="name" maxLength={120} name="sellerName" required />
        </label>
        <label className="block text-sm font-semibold">
          Contact phone *
          <input className={fieldClassName} autoComplete="tel" maxLength={40} name="phone" required type="tel" />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Description
        <textarea
          className="mt-2 min-h-32 w-full rounded-lg border border-[var(--line)] px-3 py-2 font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
          maxLength={3000}
          name="description"
          placeholder="Describe the condition, service history, and any other useful details."
        />
      </label>
      <label className="block text-sm font-semibold">
        Photos (up to 5)
        <input
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white p-3 text-sm font-normal"
          multiple
          name="photos"
          type="file"
        />
        <span className="mt-1 block text-xs font-normal text-[var(--muted)]">
          JPG, PNG or WebP; maximum 5 MB per photo.
        </span>
      </label>
      {message && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-900" role="alert">{message}</p>}
      <button
        className="w-full rounded-lg bg-brand px-5 py-3 font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Publishing…" : "Publish car"}
      </button>
      <p className="text-xs leading-5 text-[var(--muted)]">
        Your listing and contact number will be visible publicly. Only list vehicles you are
        authorised to sell, and never share sensitive account information.
      </p>
    </form>
  );
}
