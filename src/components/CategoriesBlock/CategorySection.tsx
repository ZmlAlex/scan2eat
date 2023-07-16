import React from "react";

import ProductCreateForm from "~/components/Forms/ProductCreateForm";
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
import useModal from "~/hooks/useModal";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import { Icons } from "../Icons";
import type { ArrayElement } from "../Menu/CategoryProduct";
import { CategoryOperations } from "./CategoryOperations";
import CategoryProduct from "./CategoryProduct";

type Props = {
  restaurantId: string;
  products: RestaurantWithDetails["menu"]["product"];
  category: ArrayElement<RestaurantWithDetails["menu"]["category"]>;
};

//TODO: GET RESTAURANT ID FROM ROUTER
const CategorySection = ({ restaurantId, products, category }: Props) => {
  const { isModalOpen, toggleModal } = useModal();
  return (
    <>
      <AccordionItem
        key={category.id}
        value={category.id}
        className="border-b-0"
      >
        <AccordionTrigger className="gap-x-4 capitalize">
          <span>{category.categoryI18N.name}</span>
          <div className="ml-auto">
            <CategoryOperations
              restaurantId={restaurantId}
              category={category}
            />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {!!products?.length && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right"> </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <CategoryProduct
                      key={product.id}
                      product={product}
                      restaurantId={restaurantId}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
            <Button onClick={toggleModal}>
              <Icons.add className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* //TODO MOVE IT TO COMPONENT  ProudctCreateModal*/}

      <ProductCreateForm
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        menuId={category.menuId}
        restaurantId={restaurantId}
        categoryId={category?.id || ""}
      />
    </>
  );
};

export default CategorySection;
