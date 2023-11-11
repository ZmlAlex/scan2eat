import React from "react";

import { getServerSidePropsWithLanguage } from "~/helpers/getServerSidePropsWithLanguage";
import { DashboardRestaurantSettingsScreen } from "~/screens/dashboard/DashboardRestaurantSettingsScreen";

const RestaurantSettingsPage = () => <DashboardRestaurantSettingsScreen />;

export const getServerSideProps = getServerSidePropsWithLanguage;

export default RestaurantSettingsPage;
