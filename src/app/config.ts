export interface Product {
  d?: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  quantity: string;
  shelflife: string;
  ingredients: string;
  description: string;
  image: string;
  bestseller?: boolean;
}

// export const products: Product[] = [
//   {
//     id: "1",
//     name: "Roasted Coriander Powder (Varthu Mallipodi)",
//     description:
//       "Farm-fresh coriander seeds, slow-roasted to perfection and ground into a fine, aromatic powder. Adds a distinct texture and earthy flavor to traditional Kerala curries.",
//     quantity: "1 kg",
//     price: 320,
//     image: "/images/mallipodi.png",
//     category: "Spice_Powders",
//     slug: "roasted-coriander-powder-mallipodi",
//   },
//   {
//     id: "2",
//     name: "Premium Chilli Powder (Mulakupodi)",
//     description:
//       "Vibrant red, intensely spicy powder made from finely ground, sun-dried premium chillies. Essential for adding heat and rich color to curries and marinades.",
//     quantity: "1 kg",
//     price: 350,
//     image: "/images/mulakpodi.png",
//     category: "Spice_Powders",
//     slug: "chilli-powder-mulakupodi",
//   },
//   {
//     id: "20",
//     name: "Kerala Style Fish Pickle",
//     description:
//       "Premium chunks of kingfish marinated in spicy Malabar spices and preserved in high-quality gingelly oil.",
//     quantity: "100 g",
//     price: 85,
//     image: "/images/fishPickle.png",
//     category: "Pickles",
//     slug: "fish-pickle",
//   },
//   {
//     id: "3",
//     name: "Spicy Meat Pickle",
//     description:
//       "Tender, slow-cooked beef bites tossed in a fiery blend of chili, garlic, and traditional Kerala spices.",
//     quantity: "100 g",
//     price: 100,
//     image: "/images/meatPickle.png",
//     category: "Pickles",
//     slug: "meat-pickle",
//   },
//   {
//     id: "21",
//     name: "Mixed Vegetable Pickle",
//     description:
//       "A crunchy medley of carrots, cauliflower, and beans infused with mustard, ginger, and vinegar.",
//     quantity: "100 g",
//     price: 18,
//     image: "/images/mixedpickle.png",
//     category: "Pickles",
//     slug: "vegetable-pickle",
//   },
//   {
//     id: "4",
//     name: "Mango Pickle",
//     description:
//       "Raw green mangoes sliced and cured with red chili and asafoetida for a classic tangy kick.",
//     quantity: "100 g",
//     price: 25,
//     image: "/images/mangoPickle.png",
//     category: "Pickles",
//     slug: "mango-pickle",
//   },
//   {
//     id: "5",
//     name: "Tangy Lemon Pickle",
//     description:
//       "Traditional salt-cured lemons that offer a perfect balance of sour, salty, and spicy notes.",
//     quantity: "100 g",
//     price: 18,
//     image: "/images/lemonPickle.png",
//     category: "Pickles",
//     slug: "lemon-pickle",
//   },
//   {
//     id: "6",
//     name: "Roasted Garlic Pickle",
//     description:
//       "Whole garlic cloves mellowed in a rich, spicy gravy. Perfect as a side for rice or rotis.",
//     quantity: "100 g",
//     price: 45.0,
//     image: "/images/garlicPickle.png",
//     category: "Pickles",
//     slug: "garlic-pickle",
//   },
//   {
//     id: "27",
//     name: "Kerala Style Bitter Gourd Pickle",
//     description:
//       "Crispy fried slices of bitter gourd (pavakka) marinated in a tangy, spicy masala blend. A perfect balance of bitterness and heat, preserved in gingelly oil.",
//     quantity: "100 g",
//     price: 25.0,
//     image: "/images/bitterPickle.png",
//     category: "Pickles",
//     slug: "bitter-gourd-pickle",
//   },
//   {
//     id: "22",
//     name: "Lemon & Date Pickle",
//     description:
//       "A delightful fusion of zesty lemons and sweet dates, marinated in aromatic spices. A perfect sweet, sour, and spicy accompaniment to biryani and meals.",
//     quantity: "100 g",
//     price: 30.0,
//     image: "/images/lemonDatePickle.png",
//     category: "Pickles",
//     slug: "lemon-date-pickle",
//   },
//   {
//     id: "23",
//     name: "Kerala Style Dates Pickle",
//     description:
//       "Soft, premium dates cooked in a rich, tangy, and spicy masala. A unique sweet and savory pickle that serves as the perfect accompaniment to biryani and ghee rice.",
//     quantity: "100 g",
//     price: 35.0,
//     image: "/images/datesPickle.png",
//     category: "Pickles",
//     slug: "dates-pickle",
//   },
//   {
//     id: "24",
//     name: "Mango Ginger Pickle (Manga Inji)",
//     description:
//       "Crunchy, aromatic mango ginger roots pickled in a traditional spicy and tangy brine. Offers the unique zest of ginger with the tartness of raw mango.",
//     quantity: "100 g",
//     price: 15.0,
//     image: "/images/mangoGingerPickle.png",
//     category: "Pickles",
//     slug: "mango-ginger-pickle",
//   },
//   {
//     id: "7",
//     name: "Special Chicken Masala",
//     description:
//       "A robust blend of coriander, cumin, and cardamom tailored for the perfect, aromatic chicken curry.",
//     quantity: "1 kg",
//     price: 6.5,
//     image: "/images/chickenMasala.png",
//     category: "Powders",
//     slug: "chicken-masala",
//   },
//   {
//     id: "25",
//     name: "Fish Masala",
//     description:
//       "A tangy and spicy blend of Kashmiri chilli, turmeric, and fenugreek, perfectly balanced to create authentic, flavorful fish curries and fry.",
//     quantity: "100 g",
//     price: 55.0,
//     image: "/images/fishMasala.png",
//     category: "Powders",
//     slug: "fish-masala",
//   },
//   {
//     id: "8",
//     name: "Traditional Beef Masala",
//     description:
//       "Deeply aromatic spices with an extra punch of black pepper and fennel for rich, dark meat dishes.",
//     quantity: "100 g",
//     price: 55.0,
//     image: "/images/meatMasala.png",
//     category: "Powders",
//     slug: "beef-masala",
//   },
//   {
//     id: "9",
//     name: "Malabar Biriyani Masala",
//     description:
//       "The secret to authentic biriyani. Features star anise, mace, and cinnamon for a royal fragrance.",
//     quantity: "100 g",
//     price: 80.0,
//     image: "/images/biriyaniMasala.png",
//     category: "Powders",
//     slug: "biriyani-masala",
//   },
//   {
//     id: "10",
//     name: "Homemade Garam Masala",
//     description:
//       "A warm, aromatic blend of roasted whole spices. Adds a rich finishing touch to any Indian dish.",
//     quantity: "100 g",
//     price: 130.0,
//     image: "/images/garamMasala.png",
//     category: "Powders",
//     slug: "homemade-garam-masala",
//   },
//   {
//     id: "11",
//     name: "Nadan Rasapodi",
//     description:
//       "Freshly ground Rasam powder with a peppery bite and a hint of roasted lentils and cumin.",
//     quantity: "100 g",
//     price: 55.0,
//     image: "/images/rasaPodi.png",
//     category: "Powders",
//     slug: "rasapodi",
//   },
//   {
//     id: "12",
//     name: "Veg & Egg Masala",
//     description:
//       "A versatile, mild spice blend that enhances the natural flavor of stir-fries and egg curries.",
//     quantity: "100 g",
//     price: 50.0,
//     image: "/images/eggMasala.png",
//     category: "Powders",
//     slug: "veg-egg-masala",
//   },
//   {
//     id: "13",
//     name: "Classic Sambar Powder",
//     description:
//       "The perfect ratio of roasted dal and hand-picked spices for a thick and authentic South Indian Sambar.",
//     quantity: "100 g",
//     price: 50.0,
//     image: "/images/sambarPowder.png",
//     category: "Powders",
//     slug: "sambar-powder",
//   },
//   {
//     id: "14",
//     name: "Kannurappam",
//     description:
//       "Soft, sweet, and deep-fried rice dumplings. A legendary tea-time snack from the Malabar coast.",
//     quantity: "100 g",
//     price: 70.0,
//     image: "/images/kannurappam.png",
//     category: "Snacks",
//     slug: "kannurappam",
//   },
//   {
//     id: "15",
//     name: "Crispy Samoosa",
//     description:
//       "Golden, crunchy triangular pastries filled with a savory spiced potato and vegetable filling.",
//     quantity: "100 g",
//     price: 50.0,
//     image: "/images/samoosa.png",
//     category: "Snacks",
//     slug: "samoosa",
//   },
//   {
//     id: "16",
//     name: "Pani Puri Kit",
//     description:
//       "Everything you need for street-style Pani Puri: crispy puris, spicy water mix, and sweet chutney.",
//     quantity: "100 g",
//     price: 110.0,
//     image: "/images/paniPuri.png",
//     category: "Snacks",
//     slug: "pani-puri",
//   },
//   {
//     id: "17",
//     name: "Salted Brined Mango",
//     description:
//       "Traditional 'Uppumanga'. Tender whole mangoes preserved in a concentrated salt brine for months.",
//     quantity: "50 g",
//     price: 20.0,
//     image: "/images/saltMango.png",
//     category: "Salted",
//     slug: "salted-mango",
//   },
//   {
//     id: "18",
//     name: "Salted Pineapple Chunks",
//     description:
//       "Sweet tropical pineapple pieces with a salty, spicy twist. A refreshing and unique snack.",
//     quantity: "50 g",
//     price: 20.0,
//     image: "/images/saltPineapple.png",
//     category: "Salted",
//     slug: "salted-pineapple",
//   },
//   {
//     id: "19",
//     name: "Salted Cucumber Slices",
//     description:
//       "Crisp cucumber slices marinated in sea salt and green chili. Light, hydrating, and savory.",
//     quantity: "50 g",
//     price: 6.0,
//     image: "/images/saltCucumber.png",
//     category: "Salted",
//     slug: "salted-cucumber",
//   },
//   {
//     id: "26",
//     name: "Premium Turmeric Powder",
//     description:
//       "Pure, high-quality turmeric ground from sun-dried roots. Known for its vibrant golden color, earthy aroma, and high curcumin content.",
//     quantity: "1 kg",
//     price: 370.0,
//     image: "/images/turmericPowder.png",
//     category: "Spice_Powders",
//     slug: "turmeric-powder",
//   },
// ];
