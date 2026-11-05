import { NextResponse } from "next/server";
import { cars, searchCars } from "@/backend/cars";
import { getPublishedListings } from "@/backend/user-listings";

function toNumber(value: string | null, key: string) {
  if (value === null || value === "") return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid ${key}.`);
  }

  return parsed;
}

export async function getCarsResponse(request: Request) {
  const { searchParams } = new URL(request.url);
  let make: string | null;
  let q: string | null;
  let minPrice: number | null;
  let maxPrice: number | null;

  try {
    make = searchParams.get("make");
    q = searchParams.get("q");
    minPrice = toNumber(searchParams.get("minPrice"), "minPrice");
    maxPrice = toNumber(searchParams.get("maxPrice"), "maxPrice");

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      return NextResponse.json(
        { error: "minPrice cannot be greater than maxPrice." },
        { status: 400 },
      );
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid car filters.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const inventory = [...await getPublishedListings(), ...cars];
    const filteredCars = searchCars({
      make: make ?? undefined,
      q: q ?? undefined,
      minPrice: minPrice ?? undefined,
      maxPrice: maxPrice ?? undefined,
    }, inventory);

    return NextResponse.json({
      total: filteredCars.length,
      items: filteredCars,
      availableMakes: [...new Set(inventory.map((car) => car.make))].sort(),
    });
  } catch (error) {
    console.error("Unable to load car listings:", error);
    return NextResponse.json({ error: "Unable to load car listings." }, { status: 500 });
  }
}
