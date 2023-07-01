import React from "react";

import ProductCreateForm from "~/components/ProductCreateForm";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table";
import useModal from "~/hooks/useModal";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import type { ArrayElement } from "../Menu/CategoryProduct";
import CategoryProduct from "./CategoryProduct";

type Props = {
  restaurantId: string;
  products: RestaurantWithDetails["menu"]["product"];
  category: ArrayElement<RestaurantWithDetails["menu"]["category"]>;
};

const CategorySection = ({ restaurantId, products, category }: Props) => {
  const { isModalOpen, toggleModal } = useModal();

  return (
    <>
      <AccordionItem key={category.id} value={category.id}>
        <AccordionTrigger className="capitalize">
          {category.categoryI18N.name}
        </AccordionTrigger>
        <AccordionContent>
          {!!products?.length && (
            <Table>
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
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
          <Button onClick={toggleModal}>add product</Button>
        </AccordionContent>
      </AccordionItem>

      {/* //TODO MOVE IT TO COMPONENT  ProudctCreateModal*/}
      <Dialog open={isModalOpen} onOpenChange={toggleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create product</DialogTitle>
            <DialogDescription>
              Add details about your product here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <ProductCreateForm
            onSuccessCallback={toggleModal}
            menuId={category.menuId}
            restaurantId={restaurantId}
            categoryId={category?.id || ""}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategorySection;
