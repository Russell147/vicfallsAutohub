"use client";

import Link from "next/link";
import { useState } from "react";

type AuthMode = "signin" | "register";

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [message, setMessage] = useState("");

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Authentication is not connected yet. No account details were sent.");
  }

  return (
    <>
      <div aria-label="Authentication options" className="grid grid-cols-2 rounded-lg bg-slate-100 p-1" role="tablist">
        {(["signin", "register"] as const).map((value) => (
          <button
            aria-selected={mode === value}
            className={`rounded-md px-3 py-2.5 text-sm font-bold transition ${mode === value ? "bg-white text-ink shadow-sm" : "text-[var(--muted)] hover:text-ink"}`}
            key={value}
            onClick={() => { setMode(value); setMessage(""); }}
            role="tab"
            type="button"
          >
            {value === "signin" ? "Sign in" : "Register"}
          </button>
        ))}
      </div>
      <form className="mt-6 space-y-4" onSubmit={submitForm}>
        <label className="block text-sm font-semibold" htmlFor="auth-email">
          Email
          <input
            autoComplete="email"
            className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] px-3 font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            id="auth-email"
            name="email"
            required
            type="email"
          />
        </label>
        <label className="block text-sm font-semibold" htmlFor="auth-password">
          Password
          <input
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] px-3 font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            id="auth-password"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </label>
        <button className="h-11 w-full rounded-lg bg-brand font-bold text-white transition hover:bg-brand-dark" type="submit">
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]">
        <span className="h-px flex-1 bg-[var(--line)]" />
        or
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>
      <button
        className="h-11 w-full rounded-lg border border-[var(--line)] bg-white text-sm font-semibold transition hover:bg-slate-50"
        onClick={() => setMessage("Google sign-in is not connected yet.")}
        type="button"
      >
        Continue with Google
      </button>
      {message && <p aria-live="polite" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}
      <p className="mt-6 text-center text-xs text-[var(--muted)]">
        Browsing needs no account.{" "}
        <Link className="font-semibold text-brand underline underline-offset-2" href="/browse">Browse cars</Link>
      </p>
    </>
  );
}
