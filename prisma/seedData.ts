import {
  type CurrencyCode,
  type LanguageCode,
  type LanguageTitle,
} from "@prisma/client";

export const languages: { title: LanguageTitle; code: LanguageCode }[] = [
  {
    title: "english",
    code: "english",
  },
  {
    title: "russian",
    code: "russian",
  },
];

export const currencies: { code: CurrencyCode; title: string }[] = [
  {
    code: "USD",
    title: "dollar",
  },
  {
    code: "RUB",
    title: "рубль",
  },
];

export const categories = [
  "snacks",
  "soups",
  "pizza",
  "vegan",
  "meat",
  "pastry",
  "juices",
  "alcohol",
  "combos",
];

export const products = [
  {
    name: "Chips",
    description: "",
    price: 10,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    categoryIndex: 0,
  },
  {
    name: "Tomato Soup",
    description: "",
    price: 10,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    categoryIndex: 1,
  },
  {
    name: "Chicken and ham",
    description: "",
    price: 10,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    categoryIndex: 2,
  },
  {
    name: "Smashed potato",
    description: "",
    price: 10,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    categoryIndex: 3,
  },
  {
    name: "Beef steak",
    description: "",
    price: 10,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    categoryIndex: 4,
  },
  {
    name: "Cheese pie",
    description: "",
    price: 10,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    categoryIndex: 5,
  },
  {
    name: "Orange juice",
    description: "",
    price: 10,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    categoryIndex: 6,
  },
  {
    name: "Vodka",
    description: "",
    price: 10,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    categoryIndex: 7,
  },
  {
    name: "Big mac combo",
    description: "",
    price: 10,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    categoryIndex: 8,
  },
];
