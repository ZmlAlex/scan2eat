import { Pen, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { ProductUpdateForm } from "~/components/Forms/ProductUpdateForm";
import { Icons } from "~/components/Icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/AlertDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
import { toast } from "~/components/ui/useToast";
import { api } from "~/helpers/api";
import { errorMapper } from "~/helpers/errorMapper";
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
  const tError = useTranslations("ResponseErrorMessage");

  const trpcContext = api.useContext();

  const { mutate: deleteProduct, isLoading } =
    api.product.deleteProduct.useMutation({
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        toast({
          title: t("deleteProductMutation.success.title"),
        });
      },
    });

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

      {/* //TODO CHECK IT HERE */}
      <AlertDialog open={isModalDeleteOpen} onOpenChange={toggleModalDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("deleteDialog.secondayButtonLabel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                deleteProduct({ productId: product.id });
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>{t("deleteDialog.primaryButtonLabel")}</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
