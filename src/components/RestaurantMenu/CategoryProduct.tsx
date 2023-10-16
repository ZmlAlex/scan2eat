import type { Currency } from "@prisma/client";
import Image from "next/image";
import React from "react";

import { Badge } from "~/components/ui/Badge";
import { Dialog, DialogContent } from "~/components/ui/Dialog";
import {
  DrawerDialog,
  DrawerDialogContent,
} from "~/components/ui/DrawerDialog";
import { Placeholder } from "~/components/ui/Placeholder";
import { useBreakpoint } from "~/hooks/useBreakpoints";
import useModal from "~/hooks/useModal";
import { formatPrice } from "~/helpers/formatPrice";
import type { RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";

//TODO: MOVE TO GLOBAL
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

type Product = ArrayElement<RestaurantWithDetails["product"]>;

type Props = {
  product: Product;
  currencyCode: Currency["code"];
};

const CategoryProduct = ({ product, currencyCode }: Props) => {
  const {
    productI18N: { name, description },
    price,
    imageUrl,
    measurementUnit,
    measurementValue,
  } = product;

  const { isModalOpen, toggleModal } = useModal();
  const isSm = useBreakpoint("sm");

  return (
    <>
      <div
        onClick={toggleModal}
        className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border"
      >
        <div className="relative aspect-[3/2]">
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill loading="lazy" />
          ) : (
            <Placeholder />
          )}
        </div>
        <div className="flex flex-1 flex-col border-t p-2">
          <p className="mb-1 text-xl font-semibold">
            {formatPrice(price, currencyCode)}
          </p>
          <p className="mb-2 font-medium trimmed-line-3 md:text-lg">{name}</p>
          {!!measurementValue && (
            <p className="mt-auto">
              {measurementValue} {measurementUnit}
            </p>
          )}
        </div>
      </div>

      {/* TODO: MOVE TO THE COMPONENT */}
      {/* Modal windows */}
      {isSm && (
        <Dialog open={isModalOpen} onOpenChange={toggleModal}>
          <DialogContent>
            <div className="relative  aspect-[3/2] overflow-hidden rounded-2xl">
              {imageUrl ? (
                <Image
                  className="object-cover"
                  src={imageUrl}
                  alt={name}
                  fill
                />
              ) : (
                <Placeholder />
              )}
            </div>
            <div className="space-y-4">
              <div className="space-x-2">
                <span className="text-2xl font-medium">{name}</span>
                {!!measurementValue && (
                  <span className="font-medium">
                    {measurementValue} {measurementUnit}
                  </span>
                )}
              </div>
              <Badge className="mb-4 text-lg">
                {formatPrice(price, currencyCode)}
              </Badge>
              <p className="text-lg font-medium">{description}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {!isSm && (
        <DrawerDialog open={isModalOpen} onOpenChange={toggleModal}>
          <DrawerDialogContent open={isModalOpen} toggleModal={toggleModal}>
            <div className="relative rounded-t-2xl bg-background">
              <div className="absolute left-1/2 top-4 z-10 mx-auto h-1.5 w-12 -translate-x-1/2 rounded-full bg-zinc-300" />

              <div className="mx-auto max-w-screen-sm">
                <div className="relative aspect-[3/2] overflow-hidden rounded-t-2xl">
                  {imageUrl ? (
                    <Image
                      className="object-cover"
                      src={imageUrl}
                      alt={name}
                      fill
                    />
                  ) : (
                    <Placeholder />
                  )}
                </div>
                <div className="space-y-4 p-4">
                  <div className="space-x-2">
                    <span className="text-2xl font-medium">{name}</span>
                    {!!measurementValue && (
                      <span className="font-medium">
                        {measurementValue} {measurementUnit}
                      </span>
                    )}
                  </div>

                  <Badge className="text-lg">
                    {formatPrice(price, currencyCode)}
                  </Badge>
                  {/* todo max 200px */}
                  <p className="block max-h-[30dvh] overflow-y-scroll text-lg font-medium no-scrollbar">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          </DrawerDialogContent>
        </DrawerDialog>
      )}
    </>
  );
};

export default CategoryProduct;
