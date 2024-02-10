import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

import { RestaurantDeleteForm } from "~/components/Forms/RestaurantDeleteForm";
import { Icons } from "~/components/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
import { useModal } from "~/hooks/utils/useModal";

interface RestaurantOperationsProps {
  restaurantId: string;
}

export function RestaurantOperations({
  restaurantId,
}: RestaurantOperationsProps) {
  const { isModalOpen, toggleModal } = useModal();
  const t = useTranslations("Dashboard.restaurantOperations");

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
              {t("editLabel")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={toggleModal}
          >
            {t("deleteLabel")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal window */}
      <RestaurantDeleteForm
        restaurantId={restaurantId}
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
      />
    </>
  );
}
