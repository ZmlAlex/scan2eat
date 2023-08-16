import React from "react";

import { TableCell, TableRow } from "~/components/ui/Table";
import { api } from "~/utils/api";
import { formatPrice } from "~/utils/formatPrice";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import type { ArrayElement } from "../Menu/CategoryProduct";
import { ProductOperations } from "./ProductOperations";

type Props = {
  restaurantId: string;
  product: ArrayElement<RestaurantWithDetails["product"]>;
};

const CategoryProduct = ({ product, restaurantId }: Props) => {
  const tprcContext = api.useContext();

  const currencyCode = tprcContext.restaurant.getRestaurant.getData({
    restaurantId,
  })?.currencyCode;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {product.productI18N.name}
        </TableCell>
        <TableCell> {formatPrice(product.price, currencyCode)}</TableCell>
        <TableCell> {product.productI18N.description}</TableCell>
        <TableCell className="">
          <ProductOperations restaurantId={restaurantId} product={product} />
        </TableCell>
      </TableRow>
    </>
  );
};

export default CategoryProduct;
