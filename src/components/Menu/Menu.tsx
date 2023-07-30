import type { Currency } from "@prisma/client";
import Link from "next/link";
import React from "react";

import { Badge } from "~/components/ui/Badge";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import CategorySection from "./CategorySection";

type Props = {
  menu: RestaurantWithDetails["menu"];
  currencyCode: Currency["code"];
};

const Menu = ({ menu, currencyCode }: Props) => {
  const { category = [], product = [] } = menu;

  const [selectedCategory, setSelectedCategory] = React.useState(
    category[0]?.id
  );

  return (
    <>
      {/* categories list */}
      <div className="sticky top-[60px] z-40 w-full bg-background  py-2">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {category.map(({ id, categoryI18N: { name } }) => (
            <Link href={`#${id}`} scroll={false} key={name}>
              <Badge
                onClick={() => setSelectedCategory(id)}
                className="cursor-pointer px-4 py-1 text-lg"
                variant={selectedCategory === id ? "default" : "secondary"}
              >
                {name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* products list */}
      <div className="">
        {category.map(({ id, categoryI18N: { name } }) => (
          <CategorySection
            products={product}
            key={id}
            categoryId={id}
            name={name}
            currencyCode={currencyCode}
            setSelectedCategory={setSelectedCategory}
          />
        ))}
      </div>
    </>
  );
};

export default Menu;
