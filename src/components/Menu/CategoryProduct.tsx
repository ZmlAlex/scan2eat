import React from "react";

import { Dialog, DialogContent } from "~/components/ui/Dialog";
import { type RouterOutputs } from "~/utils/api";

import { Badge } from "../ui/Badge";

//TODO: MOVE TO GLOBAL
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type Product = ArrayElement<
  RouterOutputs["restaurant"]["getRestaurant"]["menu"]["product"]
>;

type Props = {
  product: Product;
};

const CategoryProduct = ({ product }: Props) => {
  const {
    productI18N: { name, description },
    price,
    imageUrl,
  } = product;
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer overflow-hidden rounded-2xl "
      >
        <div className="relative">
          {/* //TODO: IMPLEMENT VIA IMAGE COMPONENT */}
          <img src={imageUrl} alt="food" />
        </div>
        <div className="rounded-b-2xl border px-2  py-4 ">
          <p className="mb-1 text-xl">{price}</p>

          <p className="mb-3">{name}</p>
          <p>300 g</p>
        </div>
      </div>

      {/* Modal window */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {/* <DialogHeader> */}
          {/* <DialogTitle>{product.name}</DialogTitle> */}
          <div className="relative overflow-hidden rounded-2xl">
            {/* //TODO: IMPLEMENT VIA IMAGE COMPONENT */}
            <img src={imageUrl} />
          </div>
          <div>
            <p className="mb-3 text-2xl">{name}</p>
            <Badge className="mb-4 text-lg">{price}</Badge>
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
