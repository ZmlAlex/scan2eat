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
            <TableCell className="font-medium">{dragHandler}</TableCell>
          )}
          <TableCell className="font-medium">
            {product.productI18N.name}
          </TableCell>
          <TableCell>{formatPrice(product.price, currencyCode)}</TableCell>
          <TableCell>{product.productI18N.description}</TableCell>
          <TableCell className="">
            <ProductOperations restaurantId={restaurantId} product={product} />
          </TableCell>
        </TableRow>
      </>
    );
  }
);

CategoryProduct.displayName = "CategoryProduct";

export default CategoryProduct;
