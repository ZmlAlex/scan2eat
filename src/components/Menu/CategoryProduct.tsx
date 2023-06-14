import React from "react";

import { Dialog, DialogContent } from "~/components/ui/Dialog";

import { Badge } from "../ui/Badge";

const CategoryProduct = ({
  product,
}: {
  product: {
    name: string;
    description: string;
    url: string;
    price: string;
    category: string;
  };
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer overflow-hidden rounded-2xl "
      >
        <div className="relative">
          {/* //TODO: IMPLEMENT VIA IMAGE COMPONENT */}
          <img src={product.url} alt="food" />
        </div>
        <div className="rounded-b-2xl border px-2  py-4 ">
          <p className="mb-1 text-xl">{product.price}</p>

          <p className="mb-3">{product.name}</p>
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
            <img src={product.url} />
          </div>
          <div>
            <p className="mb-3 text-2xl">{product.name}</p>
            <Badge className="mb-4 text-lg">{product.price}</Badge>
            <p className="text-lg">{product.description}</p>
          </div>
          {/* </DialogDescription> */}
          {/* </DialogHeader> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryProduct;
