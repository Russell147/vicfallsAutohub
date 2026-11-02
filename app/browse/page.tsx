import type { Metadata } from "next";
import { BrowseExplorer } from "@/components/BrowseExplorer";
import { cars, makes } from "@/lib/cars";

export const metadata: Metadata = { title: "Browse cars for sale in Zimbabwe" };

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ make?: string }>;
}) {
  const { make = "" } = await searchParams;
  return <BrowseExplorer cars={cars} makes={makes} initialMake={make} />;
}
