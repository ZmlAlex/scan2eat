import { useTranslations } from "next-intl";
import React from "react";

import { RestaurantPublishForm } from "~/components/Forms/RestaurantPublishForm";
import { Icons } from "~/components/Icons";
import { RestaurantLanguageSelector } from "~/components/RestaurantLanguageSelector";
import { Button } from "~/components/ui/Button";
import { useModal } from "~/hooks/useModal";
import { useGetRestaurantWithUserCheck } from "~/libs/trpc/hooks/useGetRestaurantWithUserCheck";

type Props = {
  isRestauranatLanguageSelectorAvailable?: boolean;
};

export const DashboardRestaurantHeaderContent = ({
  isRestauranatLanguageSelectorAvailable = true,
}: Props) => {
  const { data: restaurant } = useGetRestaurantWithUserCheck();
  const { isModalOpen, toggleModal } = useModal();

  const t = useTranslations("Form.restaurantPublish.publishButton");

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
          {restaurant.isPublished ? t("publishedLabel") : t("unpublishedLabel")}
        </Button>

        {!!restaurant && isRestauranatLanguageSelectorAvailable && (
          <RestaurantLanguageSelector />
        )}
      </div>

      {/* Modal window */}
      {isModalOpen && (
        <RestaurantPublishForm
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
        />
      )}
    </>
  );
};
