import { useTranslations } from "next-intl";
import React from "react";

import { SortableList } from "~/components/SortableList";
import { Accordion } from "~/components/ui/Accordion";
import { toast } from "~/components/ui/useToast";
import { api } from "~/utils/api";
import { errorMapper } from "~/utils/errorMapper";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import CategorySection from "./CategorySection";

type Props = {
  restaurant: RestaurantWithDetails;
};

const CategoriesTable = ({ restaurant }: Props) => {
  const [activeAccordionSection, setActiveAccordionSection] =
    React.useState("");
  // * It's required for drag and drop optimistic update
  const [sortableCategories, setSortableCategories] = React.useState(
    () => restaurant.category
  );

  const trpcContext = api.useContext();
  const t = useTranslations("Dashboard.categoriesBlock");
  const tError = useTranslations("ResponseErrorMessage");

  React.useEffect(
    () => setSortableCategories(restaurant.category),
    [restaurant.category]
  );

  // TODO: ADD LOADER WHILE ORDER IS BEING UPDATED
  const { mutate: updateCategoriesPosition, isLoading } =
    api.category.updateCategoriesPosition.useMutation({
      onError: (error) => {
        const errorMessage = errorMapper(error.message);
        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId: restaurant.id },
          () => updatedRestaurant
        );
        toast({
          title: t("updateCategoriesPosition.success.title"),
        });
      },
    });

  return (
    <>
      <Accordion
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
  );
};

export default CategoriesTable;
