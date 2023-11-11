import type { NextPage } from "next";

import { getStaticPropsWithLanguage } from "~/helpers/getStaticPropsWithLanguage";
import { TermsAndConditionsScreen } from "~/screens/termsAndConditions";

const TermsAndConditionsPage: NextPage = () => <TermsAndConditionsScreen />;

export const getStaticProps = getStaticPropsWithLanguage;

export default TermsAndConditionsPage;
