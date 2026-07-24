export type Property = {
  [x: string]: any;
  id: number;
  title: string;
  location: string;
  price: string;
  priceValue: number;
  size: string;
  status: "Available" | "Selling Fast" | "Reserved" | "Sold";
  type: string;
  image: string | null;
  category?: string;
  city?: string;
};