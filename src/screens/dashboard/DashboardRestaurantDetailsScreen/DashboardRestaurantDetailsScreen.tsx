import { useTranslations } from "next-intl";
import React from "react";

import { DashboardHeader } from "~/components/DashboardHeader";
import { DashboardRestaurantHeaderContent } from "~/components/DashboardRestaurantHeaderContent";
import { RestaurantUpdateForm } from "~/components/Forms/RestaurantUpdateForm";
import { SkeletonFactory } from "~/components/ui/Skeleton";
import { useGetRestaurantWithUserCheck } from "~/hooks/queries/useGetRestaurantWithUserCheck";

export const DashboardRestaurantDetailsScreen = () => {
  const t = useTranslations("Dashboard.page.restaurantDetails");

  const {
    data: restaurant,
    status,
    isLoading,
  } = useGetRestaurantWithUserCheck();

  return (
    <>
      {isLoading && <SkeletonFactory />}
      {status === "success" && (
        <>
          <DashboardHeader
            heading={restaurant.restaurantI18N.name}
            text={t("description")}
          >
            <DashboardRestaurantHeaderContent />
          </DashboardHeader>
          <div className="grid gap-10">
            {/*  Update main details */}
            <div>
              <RestaurantUpdateForm
                // * force update on language change
                key={restaurant.category[0]?.categoryI18N.name}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
