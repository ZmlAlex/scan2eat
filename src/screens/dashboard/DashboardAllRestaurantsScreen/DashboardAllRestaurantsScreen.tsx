import { useTranslations } from "next-intl";
import React from "react";

import { DashboardHeader } from "~/components/DashboardHeader";
import { RestaurantCreateForm } from "~/components/Forms/RestaurantCreateForm";
import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";
import { SkeletonFactory } from "~/components/ui/Skeleton";
import { formatTranslationsToOneLanguage } from "~/helpers/formatTranslationToOneLanguage";
import { useModal } from "~/hooks/useModal";
import { clientApi } from "~/libs/trpc/client";

import { AllRestaurantsPlaceholder } from "./components/AllRestaurantsEmptyPlaceholder";
import { RestaurantItem } from "./components/RestaurantItem";

export const DashboardAllRestaurantsScreen = () => {
  const { isModalOpen, toggleModal } = useModal();
  const t = useTranslations("Dashboard.page.allRestaurants");

  const { data: restaurants, status } =
    clientApi.restaurant.getAllRestaurants.useQuery(undefined, {
      select: (restaurants) => formatTranslationsToOneLanguage(restaurants),
    });

  return (
    <>
      <DashboardHeader heading={t("title")} text={t("description")}>
        <Button onClick={toggleModal}>
          <Icons.add className="mr-2 h-4 w-4" />
          {t("newRestaurantButtonLabel")}
        </Button>
      </DashboardHeader>
      <div className="grid gap-10">
        {status === "loading" && <SkeletonFactory />}
        {status === "success" && (
          <>
            {restaurants?.length ? (
              <div className="divide-y divide-border rounded-md border">
                {restaurants.map((restaurant) => (
                  <RestaurantItem key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <AllRestaurantsPlaceholder onClick={toggleModal} />
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <RestaurantCreateForm
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
        />
      )}
    </>
  );
};
