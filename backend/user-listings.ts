import { createClient } from "@supabase/supabase-js";
import type { Car } from "@/backend/cars";

type UserListingRow = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel: string;
  engine: string;
  colour: string;
  location: string;
  description: string;
  seller_name: string;
  phone: string;
  image_paths: string[];
};

function createPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

function toCar(row: UserListingRow, getPublicImageUrl: (path: string) => string): Car {
  return {
    id: row.id,
    name: `${row.make} ${row.model}`,
    make: row.make,
    model: row.model,
    year: row.year,
    price: row.price,
    priceLabel: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(row.price),
    mileage: row.mileage,
    mileageLabel: `${new Intl.NumberFormat("en-US").format(row.mileage)} km`,
    transmission: row.transmission,
    fuel: row.fuel,
    engine: row.engine,
    colour: row.colour,
    location: row.location,
    description: row.description,
    seller: row.seller_name,
    sellerType: "Private seller",
    phone: row.phone,
    images: row.image_paths.map(getPublicImageUrl),
  };
}

export async function getPublishedListings(): Promise<Car[]> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("car_listings")
    .select("id, make, model, year, price, mileage, transmission, fuel, engine, colour, location, description, seller_name, phone, image_paths")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load seller listings: ${error.message}`);
  }
  const getPublicImageUrl = (path: string) =>
    supabase.storage.from("car-listing-photos").getPublicUrl(path).data.publicUrl;
  return (data as UserListingRow[]).map((row) => toCar(row, getPublicImageUrl));
}

export async function getPublishedListing(id: string): Promise<Car | null> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("car_listings")
    .select("id, make, model, year, price, mileage, transmission, fuel, engine, colour, location, description, seller_name, phone, image_paths")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load seller listing: ${error.message}`);
  }
  if (!data) return null;
  const getPublicImageUrl = (path: string) =>
    supabase.storage.from("car-listing-photos").getPublicUrl(path).data.publicUrl;
  return toCar(data as UserListingRow, getPublicImageUrl);
}
