import React, { type ReactNode } from "react";

import ProductCreateForm from "~/components/Forms/ProductCreateForm";
import { Icons } from "~/components/Icons";
import type { ArrayElement } from "~/components/Menu/CategoryProduct";
import { SortableList } from "~/components/SortableList";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";
import { Button } from "~/components/ui/Button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table";
import { toast } from "~/components/ui/useToast";
import useModal from "~/hooks/useModal";
import { api } from "~/utils/api";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import { CategoryOperations } from "./CategoryOperations";
import CategoryProduct from "./CategoryProduct";

type Props = {
  restaurantId: string;
  products: RestaurantWithDetails["product"];
  category: ArrayElement<RestaurantWithDetails["category"]>;
  dragHandler?: ReactNode;
};

//TODO: GET RESTAURANT ID FROM ROUTER
const CategorySection = ({
  restaurantId,
  products,
  category,
  dragHandler,
}: Props) => {
  const { isModalOpen, toggleModal } = useModal();
  const trpcContext = api.useContext();

  // * It's required for drag and drop optimistic update
  const [sortableProducts, setSortableProducts] = React.useState(
    () => products
  );
  React.useEffect(() => setSortableProducts(products), [products]);

  // TODO: show loader for table while is loading
  const { mutate: updateProductsPosition, isLoading } =
    api.product.updateProductsPosition.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description:
            "Your update product position request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );
        toast({
          title: "Product has been updated.",
        });
      },
    });

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-1 py-2" />
                    <TableHead className="px-1 py-2">Name</TableHead>
                    <TableHead className="px-1 py-2">Price</TableHead>
                    <TableHead className="px-1 py-2">Description</TableHead>
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
            <Button className="mx-4" onClick={toggleModal}>
              <Icons.add className="mr-2 h-4 w-4" />
              Add Product
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

export default CategorySection;
