import React from "react";

import CategoryCreateForm from "~/components/CategoryCreateForm/CategoryCreateForm";
import { Accordion } from "~/components/ui/Accordion";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import useModal from "~/hooks/useModal";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import CategorySection from "./CategorySection";

type Props = {
  restaurant: RestaurantWithDetails;
};

const CategoryBlock = ({ restaurant }: Props) => {
  const { isModalOpen, toggleModal } = useModal();

  return (
    <>
      <div>
        <Button onClick={toggleModal}>Create Category</Button>
        {/* //TODO: MOVE IT TO THE COMPONENT */}
        <Accordion type="multiple">
          {restaurant.menu.category?.map((category) => (
            <CategorySection
              key={category.id}
              restaurantId={restaurant.id || ""}
              category={category}
              products={restaurant.menu.product?.filter(
                (product) => product.categoryId === category.id
              )}
            />
          ))}
        </Accordion>
      </div>

      {/* //TODO MOVE IT TO COMPONENT CategoryCreateModal*/}
      <Dialog open={isModalOpen} onOpenChange={toggleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create category</DialogTitle>
            <DialogDescription>
              Add details about your category here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <CategoryCreateForm
            onSuccessCallback={toggleModal}
            menuId={restaurant?.menu.id || ""}
            restaurantId={restaurant?.id || ""}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryBlock;
