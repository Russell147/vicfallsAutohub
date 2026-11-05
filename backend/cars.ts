import listings from "@/data/cars.json";

export type Car = {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  priceLabel: string;
  mileage: number;
  mileageLabel: string;
  transmission: string;
  fuel: string;
  engine: string;
  colour: string;
  location: string;
  description: string;
  seller: string;
  sellerType: string;
  phone: string;
  images: string[];
};

export type CarFilters = {
  make?: string;
  q?: string;
  maxPrice?: number;
  minPrice?: number;
};

export const cars = listings satisfies Car[];
export const makes = [...new Set(cars.map((car) => car.make))].sort();
export const getCar = (id: string) => cars.find((car) => car.id === id);

export function searchCars(filters: CarFilters = {}, inventory: Car[] = cars) {
  const make = filters.make?.trim();
  const query = filters.q?.trim().toLowerCase();
  const minPrice = Number.isFinite(filters.minPrice) ? Number(filters.minPrice) : 0;
  const maxPrice = Number.isFinite(filters.maxPrice) ? Number(filters.maxPrice) : Number.POSITIVE_INFINITY;

  return inventory.filter((car) => {
    const matchesMake = !make || car.make.toLowerCase() === make.toLowerCase();
    const matchesQuery =
      !query || `${car.name} ${car.make} ${car.model} ${car.location}`.toLowerCase().includes(query);
    const matchesMinPrice = car.price >= minPrice;
    const matchesMaxPrice = car.price <= maxPrice;

    return matchesMake && matchesQuery && matchesMinPrice && matchesMaxPrice;
  });
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
