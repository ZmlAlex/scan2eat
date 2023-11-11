import React from "react";

import { getServerSidePropsWithLanguage } from "~/helpers/getServerSidePropsWithLanguage";
import { DashboardSettingsScreen } from "~/screens/dashboard/DashboardSettingsScreen";

const DashboardSettingsPage = () => <DashboardSettingsScreen />;

export const getServerSideProps = getServerSidePropsWithLanguage;

export default DashboardSettingsPage;
