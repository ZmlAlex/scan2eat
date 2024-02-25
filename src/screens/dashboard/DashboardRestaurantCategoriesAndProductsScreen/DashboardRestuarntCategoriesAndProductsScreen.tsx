import { useTranslations } from "next-intl";
import React from "react";

import { DashboardHeader } from "~/components/DashboardHeader";
import { DashboardRestaurantHeaderContent } from "~/components/DashboardRestaurantHeaderContent";
import { SkeletonFactory } from "~/components/ui/Skeleton";
import { useGetRestaurantWithUserCheck } from "~/libs/trpc/hooks/useGetRestaurantWithUserCheck";

import { CategoriesBlock } from "./components/CategoriesBlock";

export const DashboardRestuarntCategoriesAndProductsScreen = () => {
  const t = useTranslations("Dashboard.page.restaurantCategoriesAndProducts");

  // TODO: REPLACE WITH PREFETCH ON THE SERVER SIDE
  const {
    data: restaurant,
    status,
    isLoading,
  } = useGetRestaurantWithUserCheck();

  return (
    <>
      {/* TODO: REPLACE IT WITH SUSPENCE? */}
      {isLoading && <SkeletonFactory />}

      {status === "success" && (
        <>
          <DashboardHeader
            heading={`${restaurant.restaurantI18N.name}`}
            text={t("description")}
          >
            <DashboardRestaurantHeaderContent />
          </DashboardHeader>
          <div className="grid gap-10">
            <div className="min-w-0">
              <CategoriesBlock />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardRestuarntCategoriesAndProductsScreen;
