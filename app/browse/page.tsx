import type { Metadata } from "next";
import { BrowseExplorer } from "@/components/BrowseExplorer";
import { cars, makes } from "@/lib/cars";
import { getPublishedListings } from "@/backend/user-listings";

export const metadata: Metadata = { title: "Browse cars for sale in Zimbabwe" };
export const dynamic = "force-dynamic";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ make?: string; signedIn?: string }>;
}) {
  const { make = "", signedIn } = await searchParams;
  const listings = await getPublishedListings();
  const inventory = [...listings, ...cars];
  const availableMakes = [...new Set([...makes, ...listings.map((car) => car.make)])].sort();
  return <BrowseExplorer cars={inventory} makes={availableMakes} initialMake={make} initialSignedIn={signedIn === "1"} />;
}
