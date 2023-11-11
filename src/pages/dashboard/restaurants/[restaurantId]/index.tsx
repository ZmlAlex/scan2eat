import React from "react";

import { getServerSidePropsWithLanguage } from "~/helpers/getServerSidePropsWithLanguage";
import { DashboardRestuarntCategoriesAndProductsScreen } from "~/screens/dashboard/DashboardRestaurantCategoriesAndProductsScreen";

const RestaurantCategoriesAndProductsPage = () => (
  <DashboardRestuarntCategoriesAndProductsScreen />
);

export const getServerSideProps = getServerSidePropsWithLanguage;

export default RestaurantCategoriesAndProductsPage;
