import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import React from "react";

import { DashboardHeader } from "~/components/DashboardHeader";
import { DashboardRestaurantHeaderContent } from "~/components/DashboardRestaurantHeaderContent";
import { RestaurantUpdateForm } from "~/components/Forms/RestaurantUpdateForm";
import { SkeletonFactory } from "~/components/ui/Skeleton";
import { useGetRestaurant } from "~/hooks/useGetRestaurant";
import { DashboardLayout } from "~/layouts/Dashboard.layout";

export const DashboardRestaurantDetailsScreen = () => {
  const router = useRouter();
  const t = useTranslations("Dashboard.page.restaurantDetails");

  const { data: restaurant, status } = useGetRestaurant(
    router.query.restaurantId as string
  );

  return (
    <DashboardLayout>
      {status === "loading" && <SkeletonFactory />}
      {status === "success" && (
        <>
          <DashboardHeader
            heading={restaurant.restaurantI18N.name}
            text={t("description")}
          >
            <DashboardRestaurantHeaderContent restaurant={restaurant} />
          </DashboardHeader>
          <div className="grid gap-10">
            {/*  Update main details */}
            <div>
              <RestaurantUpdateForm
                // * force update on language change
                key={restaurant.category[0]?.categoryI18N.name}
                restaurant={restaurant}
              />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};
