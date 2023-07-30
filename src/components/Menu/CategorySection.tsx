import type { Currency } from "@prisma/client";
import React from "react";

import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import CategoryProduct from "./CategoryProduct";

type Props = {
  products: RestaurantWithDetails["menu"]["product"];
  // TODO: TAKE IT FROM CONTEXT
  currencyCode: Currency["code"];
  categoryId: string;
  name: string;
  setSelectedCategory: (category: string) => void;
};

const CategorySection = ({
  products,
  categoryId,
  name,
  currencyCode,
  setSelectedCategory,
}: Props) => {
  return (
    <section key={categoryId} id={categoryId} className="scroll-mt-[120px]">
      <h2 className="mb-4 font-heading text-3xl font-medium capitalize">
        {name}
      </h2>
      {/* TODO: USE INTERSECTION HOOK TO UPDATE VALUE */}
      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {products
          ?.filter((product) => product.categoryId === categoryId)
          .map((product, index) => (
            <CategoryProduct
              key={index}
              product={product}
              currencyCode={currencyCode}
            />
          ))}
      </div>
    </section>
  );
};

export default CategorySection;
