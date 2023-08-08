import type { Currency } from "@prisma/client";
import Image from "next/image";
import React from "react";

import { Dialog, DialogContent } from "~/components/ui/Dialog";
import {
  DrawerDialog,
  DrawerDialogContent,
} from "~/components/ui/DrawerDialog";
import { useBreakpoint } from "~/hooks/useBreakpoints";
import useModal from "~/hooks/useModal";
import { formatPrice } from "~/utils/formatPrice";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import { Badge } from "../ui/Badge";

//TODO: MOVE TO GLOBAL
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

type Product = ArrayElement<RestaurantWithDetails["menu"]["product"]>;

type Props = {
  product: Product;
  currencyCode: Currency["code"];
};

const CategoryProduct = ({ product, currencyCode }: Props) => {
  const {
    productI18N: { name, description },
    price,
    imageUrl,
  } = product;

  const { isModalOpen, toggleModal } = useModal();
  const isSm = useBreakpoint("sm");

  return (
    <>
      <div
        onClick={toggleModal}
        className="cursor-pointer overflow-hidden rounded-2xl "
      >
        <div className="relative aspect-square">
          <Image src={imageUrl} alt={name} fill />
        </div>
        <div className="rounded-b-2xl border px-2  py-4 ">
          <p className="mb-1 text-xl">{formatPrice(price, currencyCode)}</p>
          <p className="mb-3">{name}</p>
          {/* TODO: REPLACE MOCK DATA */}
          <p>300 g</p>
        </div>
      </div>

      {/* Modal window */}
      {isSm && (
        <Dialog open={isModalOpen} onOpenChange={toggleModal}>
          <DialogContent className="hidden md:block">
            <div className="relative  aspect-square overflow-hidden rounded-2xl">
              <Image src={imageUrl} alt={name} fill />
            </div>
            <div>
              <p className="mb-3 text-2xl">{name}</p>
              <Badge className="mb-4 text-lg">
                {formatPrice(price, currencyCode)}
              </Badge>
              <p className="text-lg">{description}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Mobile modal window */}
      {!isSm && (
        <DrawerDialog open={isModalOpen} onOpenChange={toggleModal}>
          <DrawerDialogContent className="z-50">
            <div className="relative rounded-t-2xl bg-background">
              <div className="absolute left-1/2 top-4 z-10 mx-auto h-1.5 w-12 -translate-x-1/2 rounded-full bg-zinc-300" />
              <div className="mx-auto max-w-screen-sm">
                <div className="relative aspect-[6/4] overflow-hidden rounded-t-2xl">
                  <Image src={imageUrl} alt={name} fill />
                </div>
                <div className="space-y-4 p-4">
                  <p className="text-2xl">{name}</p>
                  <Badge className="text-lg">
                    {formatPrice(price, currencyCode)}
                  </Badge>
                  <p className="max-h-48 overflow-y-scroll text-lg">
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
