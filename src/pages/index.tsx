import type { NextPage } from "next";

import { getStaticPropsWithLanguage } from "~/helpers/getStaticPropsWithLanguage";
import { HomePageScreen } from "~/screens/homepage";

const HomePage: NextPage = () => <HomePageScreen />;

export const getStaticProps = getStaticPropsWithLanguage;

export default HomePage;
