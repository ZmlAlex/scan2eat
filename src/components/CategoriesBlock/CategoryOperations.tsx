import { Pen, Trash } from "lucide-react";
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

import CategoryUpdateForm from "../CategoryUpdateForm";
import type { ArrayElement } from "../Menu/CategoryProduct";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

interface RestaurantOperationsProps {
  restaurantId: string;
  category: ArrayElement<RestaurantWithDetails["menu"]["category"]>;
}

export function CategoryOperations({
  restaurantId,
  category,
}: RestaurantOperationsProps) {
  const { isModalOpen: isModalDeleteOpen, toggleModal: toggleModalDelete } =
    useModal();
  const { isModalOpen: isModalUpdateOpen, toggleModal: toggleModalUpdate } =
    useModal();

  const trpcContext = api.useContext();

  const { mutate: deleteCategory, isLoading } =
    api.category.deleteCategory.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description: "Your delete category request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        toast({
          title: "Category has been deleted.",
        });
      },
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[160px]"
          onClick={(event) => event.stopPropagation()}
        >
          <DropdownMenuItem onClick={toggleModalUpdate}>
            <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              toggleModalDelete();
            }}
          >
            <Trash className="mr-2 h-3.5 w-3.5 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* //TODO CHECK IT HERE */}
      <AlertDialog open={isModalDeleteOpen} onOpenChange={toggleModalDelete}>
        <AlertDialogContent onClick={(event) => event.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this category?
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
                deleteCategory({ categoryId: category.id });
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

      {/* //TODO MOVE IT TO COMPONENT */}
      <Dialog open={isModalUpdateOpen} onOpenChange={toggleModalUpdate}>
        <DialogContent
          className="sm:max-w-[425px]"
          onClick={(event) => event.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Update category</DialogTitle>
            <DialogDescription>
              Edit details about your category here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <CategoryUpdateForm
            restaurantId={restaurantId}
            category={category}
            onSuccessCallback={toggleModalUpdate}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
