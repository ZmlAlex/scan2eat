import { useTranslations } from "next-intl";
import React from "react";

import { SortableList } from "~/components/SortableList";
import { Accordion } from "~/components/ui/Accordion";
import { toast } from "~/components/ui/useToast";
import { errorMapper } from "~/helpers/errorMapper";
import { type RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { clientApi } from "~/libs/trpc/client";
import { useGetRestaurantWithUserCheck } from "~/libs/trpc/hooks/useGetRestaurantWithUserCheck";

import { CategorySection } from "./CategorySection";

export const CategoriesTable = () => {
  const { data: restaurant } = useGetRestaurantWithUserCheck();

  const [activeAccordionSection, setActiveAccordionSection] =
    React.useState("");
  // * It's required for drag and drop optimistic update
  const [sortableCategories, setSortableCategories] = React.useState(
    restaurant.category
  );

  const trpcContext = clientApi.useContext();
  const t = useTranslations("Dashboard.categoriesBlock");
  const tError = useTranslations("ResponseErrorMessage");

  React.useEffect(
    () => setSortableCategories(restaurant.category),
    [restaurant.category]
  );

  const { mutate: updateCategoriesPosition } =
    clientApi.category.updateCategoriesPosition.useMutation({
      onMutate: () => {
        toast({
          title: t("updateCategoriesPosition.start.title"),
        });
      },
      onError: (error) => {
        const errorMessage = errorMapper(error.message);
        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurantWithUserCheck.setData(
          { restaurantId: restaurant.id },
          () => updatedRestaurant
        );
        toast({
          title: t("updateCategoriesPosition.success.title"),
        });
      },
    });

  const handleDragStart = () => setActiveAccordionSection("");
  const handleDragEnd = (items: RestaurantWithDetails["category"]) => {
    setSortableCategories(items);

    updateCategoriesPosition(
      items.map((category, index) => ({
        id: category.id,
        position: index,
      }))
    );
  };

  return (
    <Accordion
      type="single"
      value={activeAccordionSection}
      onValueChange={setActiveAccordionSection}
      collapsible
      className="divide-y divide-border rounded-md border px-4"
    >
      <SortableList
        items={sortableCategories}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        renderItem={(category) => (
          <SortableList.Item id={category.id}>
            <CategorySection
              key={category.id}
              dragHandler={<SortableList.DragHandle />}
              category={category}
              products={restaurant.product?.filter(
                (product) => product.categoryId === category.id
              )}
            />
          </SortableList.Item>
        )}
      />
    </Accordion>
  );
};
