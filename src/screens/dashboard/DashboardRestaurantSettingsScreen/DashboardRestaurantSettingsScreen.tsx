import { useTranslations } from "next-intl";
import React from "react";

import { DashboardHeader } from "~/components/DashboardHeader";
import { DashboardRestaurantHeaderContent } from "~/components/DashboardRestaurantHeaderContent";
import { SkeletonFactory } from "~/components/ui/Skeleton";
import { useGetRestaurantWithUserCheck } from "~/libs/trpc/hooks/useGetRestaurantWithUserCheck";

import { LanguagesBlock } from "./components/LanguagesBlock";

export const DashboardRestaurantSettingsScreen = () => {
  const t = useTranslations("Dashboard.page.restaurantSettings");

  const { status, isLoading } = useGetRestaurantWithUserCheck();

  return (
    <>
      {isLoading && <SkeletonFactory />}
      {status === "success" && (
        <>
          <DashboardHeader heading={t("title")} text={t("description")}>
            <DashboardRestaurantHeaderContent
              isRestauranatLanguageSelectorAvailable={false}
            />
          </DashboardHeader>
          <div className="grid gap-10">
            <div>
              <LanguagesBlock />
            </div>
          </div>
        </>
      )}
    </>
  );
};
