import React from "react";

import useModal from "~/hooks/useModal";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import { Icons } from "../Icons";
import RestaurantLanguageCreateForm from "../RestaurantLanguageCreateForm";
import RestaurantLanguageUpdateForm from "../RestaurantLanguageUpdateForm/RestaurantLanguageUpdateForm";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

type Props = {
  restaurant: RestaurantWithDetails;
};

const LanguagesBlock = ({ restaurant }: Props) => {
  const { isModalOpen, toggleModal } = useModal();

  return (
    <>
      <div>
        <Button onClick={toggleModal} className="mb-4">
          <Icons.add className="mr-2 h-4 w-4" />
          Add new language
        </Button>

        <div>
          <RestaurantLanguageUpdateForm
            restaurant={restaurant}
            restaurantId={restaurant.id}
          />
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={toggleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new language</DialogTitle>
            <DialogDescription>
              Add details about your restaurant&apos;s language here. Click save
              when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <RestaurantLanguageCreateForm
            onSuccessCallback={toggleModal}
            restaurantId={restaurant.id}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LanguagesBlock;
