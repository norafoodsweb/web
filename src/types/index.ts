export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "Pickles" | "Powders" | "Snacks" | "Salted" | "Spice_Powders";
  slug: string;
  
}

