import type { Currency } from "@prisma/client";
import Image from "next/image";
import React from "react";

import { Dialog, DialogContent } from "~/components/ui/Dialog";
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
      <Dialog open={isModalOpen} onOpenChange={toggleModal}>
        <DialogContent>
          {/* <DialogHeader> */}
          {/* <DialogTitle>{product.name}</DialogTitle> */}
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src={imageUrl} alt={name} fill />
          </div>
          <div>
            <p className="mb-3 text-2xl">{name}</p>
            <Badge className="mb-4 text-lg">
              {formatPrice(price, currencyCode)}
            </Badge>
            <p className="text-lg">{description}</p>
          </div>
          {/* </DialogDescription> */}
          {/* </DialogHeader> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryProduct;
