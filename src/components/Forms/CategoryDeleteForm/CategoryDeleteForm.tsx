import { useTranslations } from "next-intl";
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
import { toast } from "~/components/ui/useToast";
import { api } from "~/helpers/api";
import { errorMapper } from "~/helpers/errorMapper";
import { useGetRestaurantWithUserCheck } from "~/hooks/useGetRestaurantWithUserCheck";

interface RestaurantOperationsProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  categoryId: string;
}

export function CategoryDeleteForm({
  isModalOpen,
  toggleModal,
  categoryId,
}: RestaurantOperationsProps) {
  const {
    data: { id: restaurantId },
  } = useGetRestaurantWithUserCheck();

  const t = useTranslations("Dashboard.categoryOperations");
  const tError = useTranslations("ResponseErrorMessage");

  const trpcContext = api.useContext();

  const { mutate: deleteCategory, isLoading } =
    api.category.deleteCategory.useMutation({
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurantWithUserCheck.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        toast({
          title: t("deleteCategoryMutation.success.title"),
        });
      },
    });

  return (
    <AlertDialog open={isModalOpen} onOpenChange={toggleModal}>
      <AlertDialogContent onClick={(event) => event.stopPropagation()}>
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
              deleteCategory({ categoryId });
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
  );
}
