import { Pen, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { ProductDeleteForm } from "~/components/Forms/ProductDeleteForm";
import { ProductUpdateForm } from "~/components/Forms/ProductUpdateForm";
import { Icons } from "~/components/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
import type { RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { useModal } from "~/hooks/useModal";
import type { ArrayElement } from "~/types/shared.interface";

interface RestaurantOperationsProps {
  restaurantId: string;
  product: ArrayElement<RestaurantWithDetails["product"]>;
}

export function ProductOperations({
  restaurantId,
  product,
}: RestaurantOperationsProps) {
  const { isModalOpen: isModalDeleteOpen, toggleModal: toggleModalDelete } =
    useModal();
  const { isModalOpen: isModalUpdateOpen, toggleModal: toggleModalUpdate } =
    useModal();
  const t = useTranslations("Dashboard.productOperations");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={toggleModalUpdate}>
            <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {t("editLabel")}
          </DropdownMenuItem>
          {/* TODO: THINK ABOUT THIS OPTION */}
          {/* <DropdownMenuItem>
            <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Make a copy
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onClick={toggleModalDelete}
          >
            <Trash className="mr-2 h-3.5 w-3.5 text-destructive" />
            {t("deleteLabel")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductDeleteForm
        isModalOpen={isModalDeleteOpen}
        toggleModal={toggleModalDelete}
        restaurantId={restaurantId}
        productId={product.id}
      />

      {/* Modal window */}
      {isModalUpdateOpen && (
        <ProductUpdateForm
          isModalOpen={isModalUpdateOpen}
          toggleModal={toggleModalUpdate}
          restaurantId={restaurantId}
          product={product}
        />
      )}
    </>
  );
}
