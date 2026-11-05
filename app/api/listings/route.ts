import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const maxPhotos = 5;

function getText(payload: Record<string, unknown>, name: string, maxLength: number) {
  const value = payload[name];
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function getInteger(payload: Record<string, unknown>, name: string) {
  const value = payload[name];
  if (typeof value !== "number") return null;
  const number = value;
  return Number.isSafeInteger(number) ? number : null;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Listing submissions are not configured. Please contact Autohub." },
      { status: 503 },
    );
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Sign in before listing a car." }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid listing details." }, { status: 400 });
    }
    payload = body as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid listing details." }, { status: 400 });
  }

  const make = getText(payload, "make", 60);
  const model = getText(payload, "model", 80);
  const year = getInteger(payload, "year");
  const price = typeof payload.price === "number" ? payload.price : Number.NaN;
  const mileage = getInteger(payload, "mileage");
  const location = getText(payload, "location", 120);
  const sellerName = getText(payload, "sellerName", 120);
  const phone = getText(payload, "phone", 40);
  const transmission = getText(payload, "transmission", 40);
  const fuel = getText(payload, "fuel", 40);

  if (
    !make || !model || year === null || year < 1900 || year > 2100 ||
    !Number.isFinite(price) || price <= 0 ||
    mileage === null || mileage < 0 ||
    !location || !sellerName || !phone || !transmission || !fuel
  ) {
    return NextResponse.json({ error: "Enter valid details for all required fields." }, { status: 400 });
  }

  const imagePaths = payload.imagePaths;
  if (!Array.isArray(imagePaths) || imagePaths.length > maxPhotos) {
    return NextResponse.json({ error: `Upload no more than ${maxPhotos} photos.` }, { status: 400 });
  }
  if (!imagePaths.every((path: unknown): path is string =>
    typeof path === "string" &&
    path.startsWith(`${user.id}/`) &&
    /^[a-zA-Z0-9-]+\/[a-f0-9-]+\.(jpg|png|webp)$/.test(path),
  )) {
    return NextResponse.json({ error: "One or more photo paths are invalid." }, { status: 400 });
  }
  const { data, error: insertError } = await supabase
    .from("car_listings")
    .insert({
      user_id: user.id,
      make,
      model,
      year,
      price,
      mileage,
      transmission,
      fuel,
      engine: getText(payload, "engine", 40),
      colour: getText(payload, "colour", 60),
      location,
      description: getText(payload, "description", 3000),
      seller_name: sellerName,
      phone,
      image_paths: imagePaths,
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json({ error: `Unable to publish listing: ${insertError.message}` }, { status: 502 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
