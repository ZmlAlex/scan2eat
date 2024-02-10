import { useTranslations } from "next-intl";
import React from "react";

import { CategoryCreateForm } from "~/components/Forms/CategoryCreateForm/CategoryCreateForm";
import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";
import { useGetRestaurantWithUserCheck } from "~/hooks/queries/useGetRestaurantWithUserCheck";
import { useModal } from "~/hooks/utils/useModal";

import { CategoriesEmptyPlaceholder } from "./CategoriesEmptyPlaceholder";
import { CategoriesTable } from "./CategoriesTable";

export const CategoriesBlock = () => {
  const { data: restaurant } = useGetRestaurantWithUserCheck();
  const { isModalOpen, toggleModal } = useModal();
  const t = useTranslations("Dashboard.categoriesBlock");

  const hasCategories = !!restaurant?.category?.length;

  return (
    <>
      {hasCategories ? (
        <>
          <Button className="mb-4" onClick={toggleModal}>
            <Icons.add className="mr-2 h-4 w-4" />
            {t("newCategoryButtonLabel")}
          </Button>
          <CategoriesTable />
        </>
      ) : (
        <CategoriesEmptyPlaceholder onClick={toggleModal} />
      )}

      {/* Modal window */}
      {isModalOpen && (
        <CategoryCreateForm
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
        />
      )}
    </>
  );
};
