import React from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";

import { Badge } from "~/components/ui/Badge";
import type { RouterOutputs } from "~/utils/api";

import CategorySection from "./CategorySection";

type Props = {
  menu: RouterOutputs["restaurant"]["getRestaurant"]["menu"];
};

const Menu = ({ menu }: Props) => {
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
            <Badge
              onClick={() => setSelectedCategory(id)}
              key={name}
              className="cursor-pointer px-4 py-1 text-lg"
              variant={selectedCategory === id ? "default" : "secondary"}
            >
              <AnchorLink href={`#${id}`} offset={170}>
                {name}
              </AnchorLink>
            </Badge>
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
            setSelectedCategory={setSelectedCategory}
          />
        ))}
      </div>
    </>
  );
};

export default Menu;
