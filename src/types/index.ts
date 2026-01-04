export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "Pickles" | "Powders" | "Snacks" | "Salted" | "Spice_Powders";
  slug: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Kerala Style Fish Pickle",
    description:
      "Premium chunks of kingfish marinated in spicy Malabar spices and preserved in high-quality gingelly oil.",
    price: 18.5,
    image: "/images/fish-pickle.jpg",
    category: "Pickles",
    slug: "fish-pickle",
  },
  {
    id: "2",
    name: "Spicy Meat Pickle",
    description:
      "Tender, slow-cooked beef bites tossed in a fiery blend of chili, garlic, and traditional Kerala spices.",
    price: 19.0,
    image: "/images/meat-pickle.jpg",
    category: "Pickles",
    slug: "meat-pickle",
  },
  {
    id: "3",
    name: "Mixed Vegetable Pickle",
    description:
      "A crunchy medley of carrots, cauliflower, and beans infused with mustard, ginger, and vinegar.",
    price: 9.5,
    image: "/images/veg-pickle.jpg",
    category: "Pickles",
    slug: "vegetable-pickle",
  },
  {
    id: "4",
    name: "Grandma's Mango Pickle",
    description:
      "Raw green mangoes sliced and cured with red chili and asafoetida for a classic tangy kick.",
    price: 8.99,
    image: "/images/mango-pickle.jpg",
    category: "Pickles",
    slug: "mango-pickle",
  },
  {
    id: "5",
    name: "Tangy Lemon Pickle",
    description:
      "Traditional salt-cured lemons that offer a perfect balance of sour, salty, and spicy notes.",
    price: 7.5,
    image: "/images/lemon-pickle.jpg",
    category: "Pickles",
    slug: "lemon-pickle",
  },
  {
    id: "6",
    name: "Roasted Garlic Pickle",
    description:
      "Whole garlic cloves mellowed in a rich, spicy gravy. Perfect as a side for rice or rotis.",
    price: 10.0,
    image: "/images/garlic-pickle.jpg",
    category: "Pickles",
    slug: "garlic-pickle",
  },
  {
    id: "7",
    name: "Special Chicken Masala",
    description:
      "A robust blend of coriander, cumin, and cardamom tailored for the perfect, aromatic chicken curry.",
    price: 6.5,
    image: "/images/chicken-masala.jpg",
    category: "Powders",
    slug: "chicken-masala",
  },
  {
    id: "8",
    name: "Traditional Beef Masala",
    description:
      "Deeply aromatic spices with an extra punch of black pepper and fennel for rich, dark meat dishes.",
    price: 6.5,
    image: "/images/beef-masala.jpg",
    category: "Powders",
    slug: "beef-masala",
  },
  {
    id: "9",
    name: "Malabar Biriyani Masala",
    description:
      "The secret to authentic biriyani. Features star anise, mace, and cinnamon for a royal fragrance.",
    price: 7.99,
    image: "/images/biriyani-masala.jpg",
    category: "Powders",
    slug: "biriyani-masala",
  },
  {
    id: "10",
    name: "Homemade Garam Masala",
    description:
      "A warm, aromatic blend of roasted whole spices. Adds a rich finishing touch to any Indian dish.",
    price: 14.0,
    image: "/images/garam-masala.jpg",
    category: "Powders",
    slug: "homemade-garam-masala",
  },
  {
    id: "11",
    name: "Nadan Rasapodi",
    description:
      "Freshly ground Rasam powder with a peppery bite and a hint of roasted lentils and cumin.",
    price: 4.5,
    image: "/images/rasapodi.jpg",
    category: "Powders",
    slug: "rasapodi",
  },
  {
    id: "12",
    name: "Veg & Egg Masala",
    description:
      "A versatile, mild spice blend that enhances the natural flavor of stir-fries and egg curries.",
    price: 5.5,
    image: "/images/veg-egg-masala.jpg",
    category: "Powders",
    slug: "veg-egg-masala",
  },
  {
    id: "13",
    name: "Classic Sambar Powder",
    description:
      "The perfect ratio of roasted dal and hand-picked spices for a thick and authentic South Indian Sambar.",
    price: 5.0,
    image: "/images/sambar-powder.jpg",
    category: "Powders",
    slug: "sambar-powder",
  },
  {
    id: "14",
    name: "Kannurappam",
    description:
      "Soft, sweet, and deep-fried rice dumplings. A legendary tea-time snack from the Malabar coast.",
    price: 7.0,
    image: "/images/kannurappam.jpg",
    category: "Snacks",
    slug: "kannurappam",
  },
  {
    id: "15",
    name: "Crispy Samoosa",
    description:
      "Golden, crunchy triangular pastries filled with a savory spiced potato and vegetable filling.",
    price: 5.5,
    image: "/images/samoosa.jpg",
    category: "Snacks",
    slug: "samoosa",
  },
  {
    id: "16",
    name: "Pani Puri Kit",
    description:
      "Everything you need for street-style Pani Puri: crispy puris, spicy water mix, and sweet chutney.",
    price: 11.0,
    image: "/images/panipuri.jpg",
    category: "Snacks",
    slug: "pani-puri",
  },
  {
    id: "17",
    name: "Salted Brined Mango",
    description:
      "Traditional 'Uppumanga'. Tender whole mangoes preserved in a concentrated salt brine for months.",
    price: 8.0,
    image: "/images/salted-mango.jpg",
    category: "Salted",
    slug: "salted-mango",
  },
  {
    id: "18",
    name: "Salted Pineapple Chunks",
    description:
      "Sweet tropical pineapple pieces with a salty, spicy twist. A refreshing and unique snack.",
    price: 9.0,
    image: "/images/salted-pineapple.jpg",
    category: "Salted",
    slug: "salted-pineapple",
  },
  {
    id: "19",
    name: "Salted Cucumber Slices",
    description:
      "Crisp cucumber slices marinated in sea salt and green chili. Light, hydrating, and savory.",
    price: 6.0,
    image: "/images/salted-cucumber.jpg",
    category: "Salted",
    slug: "salted-cucumber",
  },
];
