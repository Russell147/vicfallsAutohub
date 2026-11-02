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

export const cars = listings satisfies Car[];
export const makes = [...new Set(cars.map((car) => car.make))].sort();
export const getCar = (id: string) => cars.find((car) => car.id === id);

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
