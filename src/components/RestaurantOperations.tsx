import Link from "next/link";
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
import { api } from "~/utils/api";

interface RestaurantOperationsProps {
  restaurantId: string;
}

export function RestaurantOperations({
  restaurantId,
}: RestaurantOperationsProps) {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const trpcContext = api.useContext();

  const { mutate: deleteRestaurant, isLoading } =
    api.restaurant.deleteRestaurant.useMutation({
      onError: (err) =>
        toast({
          title: "Something went wrong.",
          description:
            "Your delete restaurant request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurants) => {
        trpcContext.restaurant.getAllRestaurants.setData(
          undefined,
          () => updatedRestaurants
        );

        toast({
          title: "Restaurant has been deleted.",
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link
              href={`/dashboard/restaurants/${restaurantId}`}
              className="flex w-full"
            >
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setIsModalOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* //TODO CHECK IT HERE */}
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this restaurant?
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
                deleteRestaurant({ restaurantId });
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
    </>
  );
}
