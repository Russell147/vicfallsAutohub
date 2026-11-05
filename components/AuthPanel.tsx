"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "signin" | "register";

export function AuthPanel({
  initialIsError = false,
  initialMessage = "",
  redirectTo = "/browse",
}: {
  initialIsError?: boolean;
  initialMessage?: string;
  redirectTo?: string;
}) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [message, setMessage] = useState(initialMessage);
  const [isError, setIsError] = useState(initialIsError);
  const [isPending, setIsPending] = useState(false);

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setIsError(true);
      setMessage("Sign-in is not configured. Add the Supabase URL and publishable key to the server environment.");
      return;
    }

    setIsPending(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const destination = new URL(redirectTo, window.location.origin);
        if (destination.pathname === "/browse") destination.searchParams.set("signedIn", "1");
        window.location.assign(`${destination.pathname}${destination.search}${destination.hash}`);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}&verified=1`,
          },
        });
        if (error) throw error;

        if (data.session) {
          const destination = new URL(redirectTo, window.location.origin);
          if (destination.pathname === "/browse") destination.searchParams.set("signedIn", "1");
          window.location.assign(`${destination.pathname}${destination.search}${destination.hash}`);
          return;
        }

        setMessage(
          "Account created. Check your email to confirm your address, then sign in.",
        );
      }
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Unable to complete sign-in. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  async function signInWithGoogle() {
    setMessage("");
    setIsError(false);
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setIsError(true);
      setMessage("Sign-in is not configured. Add the Supabase URL and publishable key to the server environment.");
      return;
    }

    setIsPending(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}&signedIn=1`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Unable to start Google sign-in. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <>
      <div aria-label="Authentication options" className="grid grid-cols-2 rounded-lg bg-slate-100 p-1" role="tablist">
        {(["signin", "register"] as const).map((value) => (
          <button
            aria-selected={mode === value}
            className={`rounded-md px-3 py-2.5 text-sm font-bold transition ${mode === value ? "bg-white text-ink shadow-sm" : "text-[var(--muted)] hover:text-ink"}`}
            key={value}
            onClick={() => { setMode(value); setMessage(""); setIsError(false); }}
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
        <button
          className="h-11 w-full rounded-lg bg-brand font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]">
        <span className="h-px flex-1 bg-[var(--line)]" />
        or
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>
      <button
        className="h-11 w-full rounded-lg border border-[var(--line)] bg-white text-sm font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        onClick={() => void signInWithGoogle()}
        type="button"
      >
        Continue with Google
      </button>
      {message && (
        <p aria-live="polite" className={`mt-4 rounded-lg p-3 text-sm ${isError ? "bg-rose-50 text-rose-900" : "bg-emerald-50 text-emerald-900"}`}>
          {message}
        </p>
      )}
      <p className="mt-6 text-center text-xs text-[var(--muted)]">
        Browsing needs no account.{" "}
        <Link className="font-semibold text-brand underline underline-offset-2" href="/browse">Browse cars</Link>
      </p>
    </>
  );
}
