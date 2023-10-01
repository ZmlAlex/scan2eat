import { useTranslations } from "next-intl";
import React from "react";

import { SortableList } from "~/components/SortableList";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table";
import { toast } from "~/components/ui/useToast";
import { api } from "~/utils/api";
import { errorMapper } from "~/utils/errorMapper";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import CategoryProduct from "./CategoryProduct";

type Props = {
  restaurantId: string;
  products: RestaurantWithDetails["product"];
};

//TODO: GET RESTAURANT ID FROM ROUTER
const CategoryProductsTable = ({ restaurantId, products }: Props) => {
  // * It's required for drag and drop optimistic update
  const [sortableProducts, setSortableProducts] = React.useState(
    () => products
  );

  const trpcContext = api.useContext();
  const t = useTranslations("Dashboard.categoryProductsTable");
  const tError = useTranslations("ResponseErrorMessage");

  React.useEffect(() => setSortableProducts(products), [products]);

  // TODO: show loader for table while is loading
  const { mutate: updateProductsPosition, isLoading } =
    api.product.updateProductsPosition.useMutation({
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );
        toast({
          title: t("updateProductPosition.success.title"),
        });
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
              onChange={(updatedProducts) => {
                setSortableProducts(updatedProducts);

                updateProductsPosition(
                  updatedProducts.map((product, index) => ({
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
                    restaurantId={restaurantId}
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

export default CategoryProductsTable;
