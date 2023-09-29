import Image from "next/image";
import React, { type ForwardedRef, type ReactNode } from "react";

import type { ArrayElement } from "~/components/RestaurantMenu/CategoryProduct";
import { Placeholder } from "~/components/ui/Placeholder";
import { TableCell, TableRow } from "~/components/ui/Table";
import { api } from "~/utils/api";
import { formatPrice } from "~/utils/formatPrice";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

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
            <div className="relative h-[32px] w-[48px] overflow-hidden rounded-md">
              {product.imageUrl ? (
                <Image
                  className="h-full object-contain"
                  src={product.imageUrl}
                  alt="dish image"
                  fill
                />
              ) : (
                <Placeholder className="[&>svg]:h-4 [&>svg]:w-4" />
              )}
            </div>
          </TableCell>
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
