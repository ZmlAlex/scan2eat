import React from "react";

import { Icons } from "~/components/Icons";
import RestaurantLanguageSelector from "~/components/RestaurantLanguageSelector";
import { Button } from "~/components/ui/Button";
import useModal from "~/hooks/useModal";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import RestaurantPublishForm from "./Forms/RestaurantPublishForm";

type Props = {
  restaurant: RestaurantWithDetails;
};

const DashboardRestaurantHeaderContent = ({ restaurant }: Props) => {
  const { isModalOpen, toggleModal } = useModal();

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={toggleModal}
          variant={restaurant.isPublished ? "success" : "destructive"}
        >
          {restaurant.isPublished ? (
            <Icons.eye className="mr-2" />
          ) : (
            <Icons.eyeOff className="mr-2" />
          )}
          {restaurant.isPublished ? "Published" : " Not Published"}
        </Button>

        {!!restaurant && <RestaurantLanguageSelector restaurant={restaurant} />}
      </div>

      {/* Modal window */}
      {isModalOpen && (
        <RestaurantPublishForm
          restaurantId={restaurant.id}
          isPublished={restaurant.isPublished}
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
        />
      )}
    </>
  );
};

export default DashboardRestaurantHeaderContent;
