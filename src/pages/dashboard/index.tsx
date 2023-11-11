import React from "react";

import { getServerSidePropsWithLanguage } from "~/helpers/getServerSidePropsWithLanguage";
import { DashboardAllRestaurantsScreen } from "~/screens/dashboard/DashboardAllRestaurantsScreen";

const DashboardAllRestaurantsPage = () => <DashboardAllRestaurantsScreen />;

export const getServerSideProps = getServerSidePropsWithLanguage;

export default DashboardAllRestaurantsPage;
