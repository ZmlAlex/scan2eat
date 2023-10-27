import { useTranslations } from "next-intl";
import React from "react";

import { EmptyPlaceholder } from "~/components/EmptyPlaceholder";
import { CategoryCreateForm } from "~/components/Forms/CategoryCreateForm/CategoryCreateForm";
import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";
import { type RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { useModal } from "~/hooks/useModal";

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
      {/* //TODO: MOVE IT TO THE COMPONENT */}
      {hasCategories ? (
        <>
          <Button className="mb-4" onClick={toggleModal}>
            <Icons.add className="mr-2 h-4 w-4" />
            {t("newCategoryButtonLabel")}
          </Button>
          <CategoriesTable restaurant={restaurant} />
        </>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="layoutList" />
          <EmptyPlaceholder.Title>
            {t("emptyPlaceholder.title")}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {t("emptyPlaceholder.description")}
          </EmptyPlaceholder.Description>
          <Button variant="outline" onClick={toggleModal}>
            <Icons.add className="mr-2 h-4 w-4" />
            {t("newCategoryButtonLabel")}
          </Button>
        </EmptyPlaceholder>
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
