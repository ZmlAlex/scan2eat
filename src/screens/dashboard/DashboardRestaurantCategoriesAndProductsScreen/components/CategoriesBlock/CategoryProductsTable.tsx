import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "sonner";

import { SortableList } from "~/components/SortableList";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table";
import { errorMapper } from "~/helpers/errorMapper";
import { type RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { clientApi } from "~/libs/trpc/client";
import { useGetRestaurantWithUserCheck } from "~/libs/trpc/hooks/useGetRestaurantWithUserCheck";

import { CategoryProduct } from "./CategoryProduct";

type Props = {
  products: RestaurantWithDetails["product"];
};

export const CategoryProductsTable = ({ products }: Props) => {
  const {
    data: { id: restaurantId },
  } = useGetRestaurantWithUserCheck();
  // * It's required for drag and drop optimistic update
  const [sortableProducts, setSortableProducts] = React.useState(
    () => products
  );

  const trpcContext = clientApi.useContext();
  const t = useTranslations("Dashboard.categoryProductsTable");
  const tError = useTranslations("ResponseErrorMessage");

  React.useEffect(() => setSortableProducts(products), [products]);

  const { mutate: updateProductsPosition } =
    clientApi.product.updateProductsPosition.useMutation({
      onMutate: () => {
        toast.info(t("updateProductPosition.start.title"));
      },
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast.error(tError(errorMessage));
      },
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurantWithUserCheck.setData(
          { restaurantId },
          () => updatedRestaurant
        );
        toast.success(t("updateProductPosition.success.title"));
      },
    });

  return (
    <>
      {!!products?.length && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-1 py-2" />
              <TableHead className="px-1 py-2" />
              <TableHead className="px-1 py-2">{t("columns.name")}</TableHead>
              <TableHead className="px-1 py-2">{t("columns.price")}</TableHead>
              <TableHead className="px-1 py-2">
                {t("columns.description")}
              </TableHead>
              <TableHead className="px-1 py-2 text-right"> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="whitespace-nowrap">
            <SortableList
              items={sortableProducts}
              onDragEnd={(updatedProducts) => {
                setSortableProducts(updatedProducts);

                updateProductsPosition(
                  updatedProducts.map((product, index) => ({
                    restaurantId: product.restaurantId,
                    id: product.id,
                    position: index,
                  }))
                );
              }}
              // TODO: THINK ABOUT TABLE STYLES
              renderItem={(product) => (
                <SortableList.Item id={product.id} asChild>
                  <CategoryProduct
                    key={product.id}
                    product={product}
                    dragHandler={<SortableList.DragHandle />}
                  />
                </SortableList.Item>
              )}
            />
          </TableBody>
        </Table>
      )}
    </>
  );
};
