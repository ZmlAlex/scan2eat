import type { LanguageCode } from "@prisma/client";
import React from "react";

import { RestaurantLanguageCreateForm } from "~/components/Forms/RestaurantLanguageCreateForm";
import { RestaurantLanguageUpdateForm } from "~/components/Forms/RestaurantLanguageUpdateForm";
import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";
import { type RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { useModal } from "~/hooks/useModal";

// TODO: GET IT FROM CONTEXT
type Props = {
  restaurant: RestaurantWithDetails;
};

const LANGUAGES: LanguageCode[] = ["english", "russian"];

export const LanguagesBlock = ({ restaurant }: Props) => {
  const { isModalOpen, toggleModal } = useModal();

  const restaurantLanguages = restaurant.restaurantLanguage.map(
    (language) => language.languageCode
  );
  const availableLanguages = LANGUAGES.filter(
    (language) => !restaurantLanguages.includes(language)
  );

  return (
    <>
      <div>
        <Button
          onClick={toggleModal}
          className="mb-4"
          disabled={!availableLanguages.length}
        >
          <Icons.add className="mr-2 h-4 w-4" />
          Add new language
        </Button>

        <div>
          {/* // TODO: GET IT FROM CONTEXT */}
          <RestaurantLanguageUpdateForm
            restaurantLanguages={restaurant.restaurantLanguage}
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
          availableLanguages={availableLanguages}
        />
      )}
    </>
  );
};
