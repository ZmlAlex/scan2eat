import React from "react";

import { getServerSidePropsWithLanguage } from "~/helpers/getServerSidePropsWithLanguage";
import { DashboardRestaurantDetailsScreen } from "~/screens/dashboard/DashboardRestaurantDetailsScreen";

const DashboardRestaurantDetailsPage = () => (
  <DashboardRestaurantDetailsScreen />
);

export const getServerSideProps = getServerSidePropsWithLanguage;

export default DashboardRestaurantDetailsPage;
