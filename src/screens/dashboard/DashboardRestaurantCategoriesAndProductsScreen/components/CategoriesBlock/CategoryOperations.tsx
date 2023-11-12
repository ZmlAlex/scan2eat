import { Pen, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { CategoryDeleteForm } from "~/components/Forms/CategoryDeleteForm";
import { CategoryUpdateForm } from "~/components/Forms/CategoryUpdateForm";
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
import type { ArrayElement } from "~/types/shared.type";

interface RestaurantOperationsProps {
  restaurantId: string;
  category: ArrayElement<RestaurantWithDetails["category"]>;
  restaurantLanguages: RestaurantWithDetails["restaurantLanguage"];
}

export function CategoryOperations({
  restaurantId,
  category,
  restaurantLanguages,
}: RestaurantOperationsProps) {
  const { isModalOpen: isModalDeleteOpen, toggleModal: toggleModalDelete } =
    useModal();
  const { isModalOpen: isModalUpdateOpen, toggleModal: toggleModalUpdate } =
    useModal();

  const t = useTranslations("Dashboard.categoryOperations");

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
            {t("editLabel")}
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
            {t("deleteLabel")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal window */}
      <CategoryDeleteForm
        restaurantId={restaurantId}
        categoryId={category.id}
        isModalOpen={isModalDeleteOpen}
        toggleModal={toggleModalDelete}
      />

      {/* Modal window */}
      {isModalUpdateOpen && (
        <CategoryUpdateForm
          restaurantId={restaurantId}
          category={category}
          restaurantLanguages={restaurantLanguages}
          isModalOpen={isModalUpdateOpen}
          toggleModal={toggleModalUpdate}
        />
      )}
    </>
  );
}
