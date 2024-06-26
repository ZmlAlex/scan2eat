import Image from "next/image";
import React, { type ForwardedRef, type ReactNode } from "react";

import { Placeholder } from "~/components/ui/Placeholder";
import { TableCell, TableRow } from "~/components/ui/Table";
import { formatPrice } from "~/helpers/formatPrice";
import { type RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { useGetRestaurantWithUserCheck } from "~/libs/trpc/hooks/useGetRestaurantWithUserCheck";
import type { ArrayElement } from "~/types/shared.type";

import { ProductOperations } from "./ProductOperations";

type Props = {
  product: ArrayElement<RestaurantWithDetails["product"]>;
  dragHandler?: ReactNode;
};

export const CategoryProduct = React.forwardRef(
  (
    { product, dragHandler, ...props }: Props,
    forwardedRef: ForwardedRef<HTMLTableRowElement>
  ) => {
    const {
      data: { currencyCode },
    } = useGetRestaurantWithUserCheck();

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
            <ProductOperations product={product} />
          </TableCell>
        </TableRow>
      </>
    );
  }
);

CategoryProduct.displayName = "CategoryProduct";
