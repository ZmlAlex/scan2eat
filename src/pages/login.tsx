import { getStaticPropsWithLanguage } from "~/helpers/getStaticPropsWithLanguage";
import { LoginScreen } from "~/screens/login";

const LoginPage = () => <LoginScreen />;

export const getStaticProps = getStaticPropsWithLanguage;

export default LoginPage;
