import { Copy, Pen, Trash } from "lucide-react";
import React from "react";

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
import useModal from "~/hooks/useModal";
import { api } from "~/utils/api";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import ProductUpdateForm from "../Forms/ProductUpdateForm";
import type { ArrayElement } from "../Menu/CategoryProduct";

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

  const trpcContext = api.useContext();

  const { mutate: deleteProduct, isLoading } =
    api.product.deleteProduct.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description: "Your delete product request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        toast({
          title: "Product has been deleted.",
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
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Make a copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onClick={toggleModalDelete}
          >
            <Trash className="mr-2 h-3.5 w-3.5 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* //TODO CHECK IT HERE */}
      <AlertDialog open={isModalDeleteOpen} onOpenChange={toggleModalDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
              <span>Delete</span>
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
