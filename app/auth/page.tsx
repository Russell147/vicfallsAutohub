import type { Metadata } from "next";
import { AuthPanel } from "@/components/AuthPanel";

export const metadata: Metadata = { title: "Sign in or register" };

export default function AuthPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5 py-12 sm:px-8">
      <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-xl font-black text-white">
            A
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Welcome to Autohub</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Sign in or create an account to list a vehicle.</p>
        </div>
        <AuthPanel />
      </div>
    </section>
  );
}
