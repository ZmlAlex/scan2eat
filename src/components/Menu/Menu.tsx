import React from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";

import { Badge } from "~/components/ui/Badge";

import CategorySection from "./CategorySection";

const categories = ["hamburgers", "juices"];

const products = [
  {
    category: "hamburgers",
    name: "bigmac",
    description: "test description",
    url: "https://menusa.dodostatic.net/images/8b28d671de8911edb6fcf91e983811c9_11edcc8aa1c1286ba6ec99b1ded312f0_900_900_520x520.jpeg",
    price: "200 $",
  },
  {
    category: "hamburgers",
    name: "royal",
    description: "test description",
    url: "https://menusa.dodostatic.net/images/8b28d671de8911edb6fcf91e983811c9_11edcc8aa1c1286ba6ec99b1ded312f0_900_900_520x520.jpeg",
    price: "200 $",
  },
  {
    category: "hamburgers",
    name: "bigtasy",
    description: "test description",
    url: "https://menusa.dodostatic.net/images/8b28d671de8911edb6fcf91e983811c9_11edcc8aa1c1286ba6ec99b1ded312f0_900_900_520x520.jpeg",
    price: "200 $",
  },
  {
    category: "hamburgers",
    name: "bigtasy",
    description: "test description",
    url: "https://menusa.dodostatic.net/images/8b28d671de8911edb6fcf91e983811c9_11edcc8aa1c1286ba6ec99b1ded312f0_900_900_520x520.jpeg",
    price: "200 $",
  },
  {
    category: "juices",
    name: "orange",
    description: "test description",
    url: "https://menusa.dodostatic.net/images/2868f5ebde9f11edb7502b8a8bb89127_11edcc912fa501fdbe8a61e83d29bf99_0_0_520x520.jpeg",
    price: "200 $",
  },
  {
    category: "juices",
    name: "apple",
    description: "test description",
    url: "https://menusa.dodostatic.net/images/2868f5ebde9f11edb7502b8a8bb89127_11edcc912fa501fdbe8a61e83d29bf99_0_0_520x520.jpeg",
    price: "200 $",
  },
  {
    category: "juices",
    name: "cherry",
    description: "test description",
    url: "https://menusa.dodostatic.net/images/2868f5ebde9f11edb7502b8a8bb89127_11edcc912fa501fdbe8a61e83d29bf99_0_0_520x520.jpeg",
    price: "200 $",
  },
];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = React.useState(categories[0]);

  return (
    <>
      {/* categories list */}
      <div className="sticky top-[60px] z-40 w-full bg-background  py-2">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <Badge
              onClick={() => setSelectedCategory(category)}
              key={category}
              className="cursor-pointer px-4 py-1 text-lg"
              variant={selectedCategory === category ? "secondary" : "default"}
            >
              <AnchorLink key={category} href={`#${category}`} offset={170}>
                {category}
              </AnchorLink>
            </Badge>
          ))}
        </div>
      </div>

      {/* products list */}
      <div className="self-stretch">
        {categories.map((category) => (
          <CategorySection
            products={products}
            key={category}
            category={category}
            setSelectedCategory={setSelectedCategory}
          />
        ))}
      </div>
    </>
  );
};

export default Menu;
