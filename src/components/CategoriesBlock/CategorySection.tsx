import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { ProductCreateForm } from "~/components/Forms/ProductCreateForm";
import { Icons } from "~/components/Icons";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";
import { Button } from "~/components/ui/Button";
import { type RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { useModal } from "~/hooks/useModal";
import type { ArrayElement } from "~/types/shared.interface";

import { CategoryOperations } from "./CategoryOperations";
import { CategoryProductsTable } from "./CategoryProductsTable";

type Props = {
  restaurantId: string;
  products: RestaurantWithDetails["product"];
  category: ArrayElement<RestaurantWithDetails["category"]>;
  dragHandler?: ReactNode;
};

//TODO: GET RESTAURANT ID FROM ROUTER
export const CategorySection = ({
  restaurantId,
  products,
  category,
  dragHandler,
}: Props) => {
  const { isModalOpen, toggleModal } = useModal();
  const t = useTranslations("Dashboard.categoriesBlock");

  return (
    <>
      <AccordionItem
        key={category.id}
        value={category.id}
        className="border-b-0"
      >
        <AccordionTrigger className="gap-x-4 p-4 capitalize">
          {dragHandler}
          <span>{category.categoryI18N.name}</span>
          <div className="ml-auto">
            <CategoryOperations
              restaurantId={restaurantId}
              category={category}
            />
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <div className="space-y-4">
            {!!products?.length && (
              <CategoryProductsTable
                restaurantId={restaurantId}
                products={products}
              />
            )}
            <Button className="mx-4" onClick={toggleModal}>
              <Icons.add className="mr-2 h-4 w-4" />
              {t("newProductButtonLabel")}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* //TODO MOVE IT TO COMPONENT  ProudctCreateModal*/}
      {isModalOpen && (
        <ProductCreateForm
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          restaurantId={restaurantId}
          categoryId={category?.id || ""}
        />
      )}
    </>
  );
};
