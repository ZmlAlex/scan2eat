import type { NextPage } from "next";

import { getStaticPropsWithLanguage } from "~/helpers/getStaticPropsWithLanguage";
import { PrivacyPolicyScreen } from "~/screens/privacyPolicy";

const PrivacyPolicyPage: NextPage = () => <PrivacyPolicyScreen />;

export const getStaticProps = getStaticPropsWithLanguage;

export default PrivacyPolicyPage;
