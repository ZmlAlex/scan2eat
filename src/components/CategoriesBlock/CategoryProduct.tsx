import React from "react";

import { TableCell, TableRow } from "~/components/ui/Table";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import type { ArrayElement } from "../Menu/CategoryProduct";
import { ProductOperations } from "./ProductOperations";

type Props = {
  restaurantId: string;
  product: ArrayElement<RestaurantWithDetails["menu"]["product"]>;
};

const CategoryProduct = ({ product, restaurantId }: Props) => {
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {product.productI18N.name}
        </TableCell>
        <TableCell> {product.price}</TableCell>
        <TableCell> {product.productI18N.description}</TableCell>
        <TableCell className="">
          <ProductOperations restaurantId={restaurantId} product={product} />
        </TableCell>
      </TableRow>
    </>
  );
};

export default CategoryProduct;
