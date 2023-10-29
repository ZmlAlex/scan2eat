import { useTranslations } from "next-intl";
import React from "react";

import { CategoryCreateForm } from "~/components/Forms/CategoryCreateForm/CategoryCreateForm";
import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";
import { type RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { useModal } from "~/hooks/useModal";

import { CategoriesEmptyPlaceholder } from "./CategoriesEmptyPlaceholder";
import { CategoriesTable } from "./CategoriesTable";

type Props = {
  restaurant: RestaurantWithDetails;
};

export const CategoriesBlock = ({ restaurant }: Props) => {
  const { isModalOpen, toggleModal } = useModal();
  const t = useTranslations("Dashboard.categoriesBlock");

  const hasCategories = !!restaurant.category?.length;

  return (
    <>
      {hasCategories ? (
        <>
          <Button className="mb-4" onClick={toggleModal}>
            <Icons.add className="mr-2 h-4 w-4" />
            {t("newCategoryButtonLabel")}
          </Button>
          <CategoriesTable restaurant={restaurant} />
        </>
      ) : (
        <CategoriesEmptyPlaceholder onClick={toggleModal} />
      )}

      {/* Modal window */}
      {isModalOpen && (
        <CategoryCreateForm
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          restaurantId={restaurant?.id || ""}
        />
      )}
    </>
  );
};
