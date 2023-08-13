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
        className="flex cursor-pointer flex-col overflow-hidden rounded-2xl"
      >
        <div className="relative aspect-[3/2]">
          <Image src={imageUrl} alt={name} fill />
        </div>
        <div className="flex-1 rounded-b-2xl border px-2 py-4">
          <p className="mb-1 text-xl">{formatPrice(price, currencyCode)}</p>
          <p className="mb-3">{name}</p>
          {/* TODO: REPLACE MOCK DATA */}
          <p>300 g</p>
        </div>
      </div>

      {/* TODO: MOVE TO THE COMPONENT */}
      {/* Modal windows */}
      {isSm && (
        <Dialog open={isModalOpen} onOpenChange={toggleModal}>
          <DialogContent>
            <div className="relative  aspect-[3/2] overflow-hidden rounded-2xl">
              <Image className="object-cover" src={imageUrl} alt={name} fill />
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

      {!isSm && (
        <DrawerDialog open={isModalOpen} onOpenChange={toggleModal}>
          <DrawerDialogContent open={isModalOpen} toggleModal={toggleModal}>
            <div className="relative rounded-t-2xl bg-background">
              <div className="absolute left-1/2 top-4 z-10 mx-auto h-1.5 w-12 -translate-x-1/2 rounded-full bg-zinc-300" />

              <div className="mx-auto max-w-screen-sm">
                <div className="relative aspect-[3/2] overflow-hidden rounded-t-2xl">
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4 p-4">
                  <p className="text-2xl">{name}</p>
                  <Badge className="text-lg">
                    {formatPrice(price, currencyCode)}
                  </Badge>

                  <p className="block max-h-[calc(80dvh-65vw)] overflow-y-scroll text-lg no-scrollbar">
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
