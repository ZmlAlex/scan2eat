import React from "react";

import { Button } from "~/components/ui/Button";
import useModal from "~/hooks/useModal";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import RestaurantLanguageCreateForm from "../Forms/RestaurantLanguageCreateForm";
import RestaurantLanguageUpdateForm from "../Forms/RestaurantLanguageUpdateForm";
import { Icons } from "../Icons";

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

      {/* Modal window */}
      {isModalOpen && (
        <RestaurantLanguageCreateForm
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          restaurantId={restaurant.id}
        />
      )}
    </>
  );
};

export default LanguagesBlock;
