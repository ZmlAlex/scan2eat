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
import { api } from "~/libs/api";

interface RestaurantOperationsProps {
  restaurantId: string;
  isModalOpen: boolean;
  toggleModal: () => void;
}

export function RestaurantDeleteForm({
  restaurantId,
  isModalOpen,
  toggleModal,
}: RestaurantOperationsProps) {
  const t = useTranslations("Dashboard.restaurantOperations");
  const tError = useTranslations("ResponseErrorMessage");

  const trpcContext = api.useContext();

  const { mutate: deleteRestaurant, isLoading } =
    api.restaurant.deleteRestaurant.useMutation({
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (updatedRestaurants) => {
        trpcContext.restaurant.getAllRestaurants.setData(
          undefined,
          () => updatedRestaurants
        );

        toast({
          title: t("deleteRestaurantMutation.success.title"),
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
              deleteRestaurant({ restaurantId });
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
