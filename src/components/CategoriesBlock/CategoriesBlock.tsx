import React from "react";

import CategoryCreateForm from "~/components/Forms/CategoryCreateForm/CategoryCreateForm";
import { SortableList } from "~/components/SortableList";
import { Accordion } from "~/components/ui/Accordion";
import { Button } from "~/components/ui/Button";
import { toast } from "~/components/ui/useToast";
import useModal from "~/hooks/useModal";
import { api } from "~/utils/api";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import { EmptyPlaceholder } from "../EmptyPlaceholder";
import { Icons } from "../Icons";
import CategorySection from "./CategorySection";

type Props = {
  restaurant: RestaurantWithDetails;
};

const CategoriesBlock = ({ restaurant }: Props) => {
  const trpcContext = api.useContext();
  const { isModalOpen, toggleModal } = useModal();

  const [activeAccordionSection, setActiveAccordionSection] =
    React.useState("");
  // * It's required for drag and drop optimistic update
  const [sortableCategories, setSortableCategories] = React.useState(
    () => restaurant.category
  );
  React.useEffect(
    () => setSortableCategories(restaurant.category),
    [restaurant.category]
  );

  // TODO: ADD LOADER WHILE ORDER IS BEING UPDATED
  const { mutate: updateCategoriesPosition, isLoading } =
    api.category.updateCategoriesPosition.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description:
            "Your update product position request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId: restaurant.id },
          () => updatedRestaurant
        );
        toast({
          title: "Category has been updated.",
        });
      },
    });

  const hasCategories = !!restaurant.category?.length;

  return (
    <>
      {/* //TODO: MOVE IT TO THE COMPONENT */}
      {hasCategories ? (
        <>
          <Button className="mb-4" onClick={toggleModal}>
            <Icons.add className="mr-2 h-4 w-4" />
            Create Category
          </Button>
          <Accordion
            // type="multiple"
            type="single"
            value={activeAccordionSection}
            onValueChange={setActiveAccordionSection}
            collapsible
            className="divide-y divide-border rounded-md border px-4"
          >
            <SortableList
              items={sortableCategories}
              onDragStart={() => setActiveAccordionSection("")}
              onChange={(updatedCategories) => {
                setSortableCategories(updatedCategories);

                updateCategoriesPosition(
                  updatedCategories.map((category, index) => ({
                    id: category.id,
                    position: index,
                  }))
                );
              }}
              renderItem={(category) => (
                <SortableList.Item id={category.id}>
                  <>
                    <CategorySection
                      key={category.id}
                      restaurantId={restaurant.id || ""}
                      category={category}
                      dragHandler={<SortableList.DragHandle />}
                      products={restaurant.product?.filter(
                        (product) => product.categoryId === category.id
                      )}
                    />
                  </>
                </SortableList.Item>
              )}
            />
          </Accordion>
        </>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="layoutList" />
          <EmptyPlaceholder.Title>No categories created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any categories yet. Start creating content.
          </EmptyPlaceholder.Description>
          <Button variant="outline" onClick={toggleModal}>
            <Icons.add className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </EmptyPlaceholder>
      )}

      {/* Modal window */}
      <CategoryCreateForm
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        restaurantId={restaurant?.id || ""}
      />
    </>
  );
};

export default CategoriesBlock;
