import React from "react";

import CategoryProduct from "./CategoryProduct";

const CategorySection = ({
  products,
  category,
  setSelectedCategory,
}: {
  products: {
    name: string;
    description: string;
    url: string;
    price: string;
    category: string;
  }[];
  category: string;
  setSelectedCategory: (category: string) => void;
}) => {
  return (
    <section key={category}>
      <h2 className="mb-4 text-3xl">{category}</h2>
      {/* TODO: USE INTERSECTION HOOK TO UPDATE VALUE */}
      <div
        id={category}
        className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6"
      >
        {products
          .filter((product) => product.category === category)
          .map((product, index) => (
            <CategoryProduct key={index} product={product} />
          ))}
      </div>
    </section>
  );
};

export default CategorySection;
