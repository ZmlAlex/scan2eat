import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import React from "react";

import CategoriesBlock from "~/components/CategoriesBlock";
import { DashboardHeader } from "~/components/DashboardHeader";
import DashboardRestaurantHeaderContent from "~/components/DashboardRestaurantHeaderContent";
import { getServerSidePropsWithLanguage } from "~/helpers/getServerSidePropsWithLanguage";
import useGetRestaurant from "~/hooks/useGetRestaurant";
import DashboardLayout from "~/layouts/Dashboard.layout";

const RestaurantCategoriesAndProducts = () => {
  const router = useRouter();
  const t = useTranslations("Dashboard.page.restaurantCategoriesAndProducts");

  const { data: restaurant, status } = useGetRestaurant(
    router.query.restaurantId as string
  );

  return (
    <DashboardLayout>
      {status === "loading" && <div>loading</div>}
      {status === "success" && (
        <>
          <DashboardHeader
            heading={`${restaurant.restaurantI18N.name}`}
            text={t("description")}
          >
            <DashboardRestaurantHeaderContent restaurant={restaurant} />
          </DashboardHeader>
          <div className="grid gap-10">
            <div className="min-w-0">
              <CategoriesBlock restaurant={restaurant} />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export const getServerSideProps = getServerSidePropsWithLanguage;

export default RestaurantCategoriesAndProducts;
