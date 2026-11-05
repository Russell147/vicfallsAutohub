import type { Metadata } from "next";
import { AuthPanel } from "@/components/AuthPanel";

export const metadata: Metadata = { title: "Sign in or register" };

function getSafeRedirectPath(value?: string) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/browse";
  const destination = new URL(value, "https://autohub.invalid");
  if (destination.origin !== "https://autohub.invalid") return "/browse";
  return `${destination.pathname}${destination.search}${destination.hash}`;
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; verified?: string; signedIn?: string; next?: string }>;
}) {
  const params = await searchParams;
  const isError = params.error === "callback" || params.error === "not_configured";
  const redirectTo = getSafeRedirectPath(params.next);
  const initialMessage =
    params.verified === "1"
      ? "Your email is confirmed. You can now sign in."
      : params.signedIn === "1"
        ? "You are signed in."
        : params.error === "callback"
          ? "Sign-in could not be completed. Please try again."
          : params.error === "not_configured"
            ? "Sign-in is not configured. Add the Supabase URL and publishable key to the server environment."
            : "";

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
        <AuthPanel initialIsError={isError} initialMessage={initialMessage} redirectTo={redirectTo} />
      </div>
    </section>
  );
}
