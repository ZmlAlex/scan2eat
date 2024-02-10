import type { LanguageCode } from "@prisma/client";
import { useTranslations } from "next-intl";
import React from "react";

import { RestaurantLanguageCreateForm } from "~/components/Forms/RestaurantLanguageCreateForm";
import { RestaurantLanguageUpdateForm } from "~/components/Forms/RestaurantLanguageUpdateForm";
import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";
import { useGetRestaurantWithUserCheck } from "~/hooks/queries/useGetRestaurantWithUserCheck";
import { useModal } from "~/hooks/utils/useModal";

// TODO: GET IT FROM CONTEXT
const LANGUAGES: LanguageCode[] = ["english", "russian"];

export const LanguagesBlock = () => {
  const t = useTranslations("Dashboard.page.restaurantSettings");
  const { isModalOpen, toggleModal } = useModal();

  const { data: restaurant } = useGetRestaurantWithUserCheck();

  const availableLanguages = LANGUAGES.filter(
    (language) =>
      !restaurant.restaurantLanguage.find(
        (restaurantLanguage) => restaurantLanguage.languageCode === language
      )
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
          {t("newLanguageButtonLabel")}
        </Button>

        <div>
          <RestaurantLanguageUpdateForm />
        </div>
      </div>

      {/* Modal window */}
      {isModalOpen && (
        <RestaurantLanguageCreateForm
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          availableLanguages={availableLanguages}
        />
      )}
    </>
  );
};
