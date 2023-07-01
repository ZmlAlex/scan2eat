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

import { EmptyPlaceholder } from "../EmptyPlaceholder";
import { Icons } from "../Icons";
import CategorySection from "./CategorySection";

type Props = {
  restaurant: RestaurantWithDetails;
};

const CategoryBlock = ({ restaurant }: Props) => {
  const { isModalOpen, toggleModal } = useModal();

  const hasCategories = !!restaurant.menu.category?.length;

  return (
    <>
      <div>
        {/* //TODO: MOVE IT TO THE COMPONENT */}
        {hasCategories ? (
          <>
            <Button className="mb-4" onClick={toggleModal}>
              <Icons.add className="mr-2 h-4 w-4" />
              Create Category
            </Button>

            <Accordion
              type="multiple"
              className="divide-y divide-border rounded-md border px-4"
            >
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
          </>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="layoutList" />
            <EmptyPlaceholder.Title>
              No categories created
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any categories yet. Start creating content.
            </EmptyPlaceholder.Description>
            <Button variant="outline" onClick={toggleModal}>
              <Icons.add className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </EmptyPlaceholder>
        )}
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
