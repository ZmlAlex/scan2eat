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
import { errorMapper } from "~/helpers/errorMapper";
import { useGetRestaurantWithUserCheck } from "~/hooks/queries/useGetRestaurantWithUserCheck";
import { clientApi } from "~/libs/trpc/client";

interface RestaurantOperationsProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  productId: string;
}

export function ProductDeleteForm({
  isModalOpen,
  toggleModal,
  productId,
}: RestaurantOperationsProps) {
  const trpcContext = clientApi.useContext();

  const {
    data: { id: restaurantId },
  } = useGetRestaurantWithUserCheck();

  const t = useTranslations("Dashboard.productOperations");
  const tError = useTranslations("ResponseErrorMessage");

  const { mutate: deleteProduct, isLoading } =
    clientApi.product.deleteProduct.useMutation({
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
          title: t("deleteProductMutation.success.title"),
        });
      },
    });

  return (
    <AlertDialog open={isModalOpen} onOpenChange={toggleModal}>
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
              deleteProduct({ productId });
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
