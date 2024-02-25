"use client";
import type { Currency } from "@prisma/client";
import React from "react";
import { isMobileSafari } from "react-device-detect";

import { Badge } from "~/components/ui/Badge";
import type { RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { useScrollDirection } from "~/hooks/utils/useScrollDirection";

import { CategorySection } from "./CategorySection";

// !it can cause the wrong behaviour if duration is too short
const SCROLL_TO_CATEGORY_SECTION_DURATION = isMobileSafari ? 300 : 700;

type Props = {
  categories: RestaurantWithDetails["category"];
  products: RestaurantWithDetails["product"];
  currencyCode: Currency["code"];
};

export const RestaurantMenu = ({
  // TODO: GET IT FROM HOOK
  categories = [],
  products = [],
  currencyCode,
}: Props) => {
  const scrollDirection = useScrollDirection();

  const [selectedCategory, setSelectedCategory] = React.useState(
    categories[0]?.id || ""
  );
  const [isAutoScrollingInProgress, setIsAutoScrollingInProgress] =
    React.useState(false);

  const categoriesPanelRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const categoriesPanelContainerRef = React.useRef<HTMLDivElement>(null);
  const categorySectionsRefs = React.useRef<Array<HTMLElement | null>>([]);

  //* Scroll into viewport in middle of selected category in the categories panel
  React.useEffect(() => {
    if (!isAutoScrollingInProgress) {
      const selectedCategoryRef = categoriesPanelRefs.current.find(
        (elem) => elem?.id === `badge-${selectedCategory}`
      );

      if (!selectedCategoryRef || !categoriesPanelContainerRef.current) return;

      const updatedScrollPosition =
        selectedCategoryRef.offsetLeft +
        selectedCategoryRef.offsetWidth / 2 -
        categoriesPanelContainerRef.current.offsetWidth / 2;

      categoriesPanelContainerRef.current.scroll({
        left: updatedScrollPosition,
        behavior: "smooth",
      });
    }
  }, [isAutoScrollingInProgress, selectedCategory]);

  const handleSelectCategory = (id: string) => () => {
    const selectedCategorySection = categorySectionsRefs.current.find(
      (elem) => elem?.id === id
    );

    setIsAutoScrollingInProgress(true);
    setSelectedCategory(id);

    selectedCategorySection?.scrollIntoView({
      behavior: "smooth",
    });

    //* When scroll event is completed, we need to enable ability scroll into viewport for categories panel(see useEffect above)
    setTimeout(() => {
      setIsAutoScrollingInProgress(false);
    }, SCROLL_TO_CATEGORY_SECTION_DURATION);
  };

  const selectedCategoryIndex = categories.findIndex(
    (category) => category.id === selectedCategory
  );

  return (
    <>
      {/* categories panel */}
      <div className="sticky top-[60px] z-40 w-full bg-background py-2">
        <div
          className="-mx-8 flex snap-x gap-3 overflow-x-auto no-scrollbar md:mx-0"
          ref={categoriesPanelContainerRef}
        >
          {categories.map(({ id, categoryI18N: { name } }) => (
            <div
              className="min-w-[auto] snap-center"
              key={name}
              id={`badge-${id}`}
              //* Push the ref onto the refs array.
              ref={(ref) =>
                !categoriesPanelRefs.current.includes(ref) &&
                categoriesPanelRefs.current.push(ref)
              }
            >
              <Badge
                onClick={handleSelectCategory(id)}
                className="cursor-pointer whitespace-nowrap px-4 py-1 text-lg"
                variant={selectedCategory === id ? "default" : "secondary"}
              >
                {name}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* products list */}
      <div>
        {categories.map(({ id, categoryI18N: { name } }, index) => (
          <CategorySection
            categorySectionsRefs={categorySectionsRefs}
            products={products}
            key={id}
            categoryId={id}
            name={name}
            isAutoScrollingInProgress={isAutoScrollingInProgress}
            currencyCode={currencyCode}
            setSelectedCategory={setSelectedCategory}
            scrollDirection={scrollDirection}
            //* these two values we need to prevent multiple selection of categories on interesection(scroll down/up)
            isHigherCategorySelected={selectedCategoryIndex <= index}
            isLowerCategorySelected={selectedCategoryIndex >= index}
          />
        ))}
      </div>
    </>
  );
};
