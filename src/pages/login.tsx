import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";

import { UserAuthForm } from "~/components/Forms/UserAuthForm";
import { getStaticPropsWithLanguage } from "~/helpers/getStaticPropsWithLanguage";
import { AuthLayout } from "~/layouts/Auth.layout";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginPage = () => {
  const t = useTranslations("Login");
  const tSEO = useTranslations("SEO.login");

  return (
    <>
      <NextSeo title={tSEO("title")} />

      <AuthLayout>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <UserAuthForm />
        </div>
      </AuthLayout>
    </>
  );
};

export const getStaticProps = getStaticPropsWithLanguage;

export default LoginPage;
