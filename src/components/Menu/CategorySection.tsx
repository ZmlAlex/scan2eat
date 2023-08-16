import type { Currency } from "@prisma/client";
import React from "react";

import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import CategoryProduct from "./CategoryProduct";

// * when distance more than these values -> we should trigger selecting of category
const TOP_OFFSET = 130;
const BOTTOM_OFFSET = 140;

type Props = {
  products: RestaurantWithDetails["product"];
  categorySectionsRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  // TODO: TAKE IT FROM CONTEXT
  currencyCode: Currency["code"];
  categoryId: string;
  name: string;
  scrollDirection: "up" | "down";
  isHigherCategorySelected: boolean;
  isAutoScrollingInProgress: boolean;
  isLowerCategorySelected: boolean;
  setSelectedCategory: (categoryId: string) => void;
};

const CategorySection = ({
  categorySectionsRefs,
  products,
  categoryId,
  name,
  currencyCode,
  scrollDirection,
  setSelectedCategory,
  isHigherCategorySelected,
  isLowerCategorySelected,
  isAutoScrollingInProgress,
}: Props) => {
  React.useEffect(() => {
    // don't listen scroll event when user click on category in panel
    if (isAutoScrollingInProgress) {
      return;
    }

    const switchCategoryOnIntersection = () => {
      // find ref for current category sections
      const {
        y: distanceToTop,
        bottom: distanceBetweenBottomBorderCategorySectionAndTopPage,
      } =
        categorySectionsRefs.current
          .find((elem) => elem?.id === categoryId)
          ?.getBoundingClientRect() || {};

      // on scroll down
      if (
        scrollDirection === "down" &&
        distanceToTop &&
        distanceToTop <= TOP_OFFSET &&
        !isLowerCategorySelected
      ) {
        setSelectedCategory(categoryId);
      }
      //  on scroll up
      if (
        scrollDirection === "up" &&
        distanceBetweenBottomBorderCategorySectionAndTopPage &&
        distanceBetweenBottomBorderCategorySectionAndTopPage > BOTTOM_OFFSET &&
        !isHigherCategorySelected
      ) {
        setSelectedCategory(categoryId);
      }
    };

    window.addEventListener("scroll", switchCategoryOnIntersection);

    return () =>
      window.removeEventListener("scroll", switchCategoryOnIntersection);
  }, [
    categoryId,
    isHigherCategorySelected,
    isLowerCategorySelected,
    isAutoScrollingInProgress,
    name,
    scrollDirection,
    setSelectedCategory,
    categorySectionsRefs,
  ]);

  return (
    <section
      //* Push the ref onto the refs array.
      ref={(ref) =>
        !categorySectionsRefs.current.includes(ref) &&
        categorySectionsRefs.current.push(ref)
      }
      key={categoryId}
      id={categoryId}
      className="scroll-mt-[120px]"
    >
      <h2 className="mb-4 font-heading text-3xl font-medium capitalize">
        {name}
      </h2>
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
