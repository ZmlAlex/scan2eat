import React from "react";

import type { RouterOutputs } from "~/utils/api";

import CategoryProduct from "./CategoryProduct";

type Props = {
  products: RouterOutputs["restaurant"]["getRestaurant"]["menu"]["product"];
  categoryId: string;
  name: string;
  setSelectedCategory: (category: string) => void;
};

const CategorySection = ({
  products,
  categoryId,
  name,
  setSelectedCategory,
}: Props) => {
  return (
    <section key={categoryId}>
      <h2 className="mb-4 text-3xl font-medium capitalize">{name}</h2>
      {/* TODO: USE INTERSECTION HOOK TO UPDATE VALUE */}
      <div
        id={categoryId}
        className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6"
      >
        {products
          ?.filter((product) => product.categoryId === categoryId)
          .map((product, index) => (
            <CategoryProduct key={index} product={product} />
          ))}
      </div>
    </section>
  );
};

export default CategorySection;
