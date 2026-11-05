import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function authRedirect(requestUrl: URL, error?: string, success?: string) {
  const destination = new URL("/auth", requestUrl.origin);
  if (error) destination.searchParams.set("error", error);
  if (success) destination.searchParams.set(success, "1");
  return NextResponse.redirect(destination);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return authRedirect(requestUrl, "not_configured");
  }

  if (!code) {
    return authRedirect(requestUrl, "callback");
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Supabase auth callback failed:", error.message);
    return authRedirect(requestUrl, "callback");
  }

  const nextPath = requestUrl.searchParams.get("next");
  if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
    const destination = new URL(nextPath, requestUrl.origin);
    if (destination.origin === requestUrl.origin) {
      if (requestUrl.searchParams.get("verified") === "1") {
        destination.searchParams.set("verified", "1");
      } else {
        destination.searchParams.set("signedIn", "1");
      }
      return NextResponse.redirect(destination);
    }
  }

  return authRedirect(
    requestUrl,
    undefined,
    requestUrl.searchParams.get("verified") === "1" ? "verified" : "signedIn",
  );
}
