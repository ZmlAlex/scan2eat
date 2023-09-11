import React, { type ForwardedRef, type ReactNode } from "react";

import { TableCell, TableRow } from "~/components/ui/Table";
import { api } from "~/utils/api";
import { formatPrice } from "~/utils/formatPrice";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import type { ArrayElement } from "../Menu/CategoryProduct";
import { ProductOperations } from "./ProductOperations";

type Props = {
  restaurantId: string;
  product: ArrayElement<RestaurantWithDetails["product"]>;
  dragHandler?: ReactNode;
};

const CategoryProduct = React.forwardRef(
  (
    { product, restaurantId, dragHandler, ...props }: Props,
    forwardedRef: ForwardedRef<HTMLTableRowElement>
  ) => {
    const tprcContext = api.useContext();

    const currencyCode = tprcContext.restaurant.getRestaurant.getData({
      restaurantId,
    })?.currencyCode;

    return (
      <>
        <TableRow {...props} ref={forwardedRef}>
          {dragHandler && (
            <TableCell className="px-1 py-2 font-medium">
              {dragHandler}
            </TableCell>
          )}
          <TableCell className="font-medum px-1 py-2">
            {product.productI18N.name}
          </TableCell>
          <TableCell className="px-1 py-2">
            {formatPrice(product.price, currencyCode)}
          </TableCell>
          <TableCell className="px-1 py-2">
            {product.productI18N.description}
          </TableCell>
          <TableCell className="sticky right-0 bg-background px-1 py-2">
            <ProductOperations restaurantId={restaurantId} product={product} />
          </TableCell>
        </TableRow>
      </>
    );
  }
);

CategoryProduct.displayName = "CategoryProduct";

export default CategoryProduct;
