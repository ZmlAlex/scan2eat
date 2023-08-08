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
      "https://res.cloudinary.com/du3ndixsk/image/upload/v1690921329/foodmate-development/clksqdgat00083s3wm7pu76dl/7301641e42907e2f83035b15ef7b6108214164d1.png",
    categoryIndex: 0,
  },
  {
    name: "Tomato Soup",
    description: "",
    price: 10,
    imageUrl:
      "https://res.cloudinary.com/du3ndixsk/image/upload/v1690921329/foodmate-development/clksqdgat00083s3wm7pu76dl/7301641e42907e2f83035b15ef7b6108214164d1.png",

    categoryIndex: 1,
  },
  {
    name: "Chicken and ham",
    description: "",
    price: 10,
    imageUrl:
      "https://res.cloudinary.com/du3ndixsk/image/upload/v1690921329/foodmate-development/clksqdgat00083s3wm7pu76dl/7301641e42907e2f83035b15ef7b6108214164d1.png",

    categoryIndex: 2,
  },
  {
    name: "Smashed potato",
    description: "",
    price: 10,
    imageUrl:
      "https://res.cloudinary.com/du3ndixsk/image/upload/v1690921329/foodmate-development/clksqdgat00083s3wm7pu76dl/7301641e42907e2f83035b15ef7b6108214164d1.png",

    categoryIndex: 3,
  },
  {
    name: "Beef steak",
    description: "",
    price: 10,
    imageUrl:
      "https://res.cloudinary.com/du3ndixsk/image/upload/v1690921329/foodmate-development/clksqdgat00083s3wm7pu76dl/7301641e42907e2f83035b15ef7b6108214164d1.png",

    categoryIndex: 4,
  },
  {
    name: "Cheese pie",
    description: "",
    price: 10,
    imageUrl:
      "https://res.cloudinary.com/du3ndixsk/image/upload/v1690921329/foodmate-development/clksqdgat00083s3wm7pu76dl/7301641e42907e2f83035b15ef7b6108214164d1.png",

    categoryIndex: 5,
  },
  {
    name: "Orange juice",
    description: "",
    price: 10,
    imageUrl:
      "https://res.cloudinary.com/du3ndixsk/image/upload/v1690921329/foodmate-development/clksqdgat00083s3wm7pu76dl/7301641e42907e2f83035b15ef7b6108214164d1.png",

    categoryIndex: 6,
  },
  {
    name: "Vodka",
    description: "",
    price: 10,
    imageUrl:
      "https://res.cloudinary.com/du3ndixsk/image/upload/v1690921329/foodmate-development/clksqdgat00083s3wm7pu76dl/7301641e42907e2f83035b15ef7b6108214164d1.png",

    categoryIndex: 7,
  },
  {
    name: "Big mac combo",
    description: "",
    price: 10,
    imageUrl:
      "https://res.cloudinary.com/du3ndixsk/image/upload/v1690921329/foodmate-development/clksqdgat00083s3wm7pu76dl/7301641e42907e2f83035b15ef7b6108214164d1.png",

    categoryIndex: 8,
  },
];
