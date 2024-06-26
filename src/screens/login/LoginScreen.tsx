import { useTranslations } from "next-intl";

import { UserAuthForm } from "~/components/Forms/UserAuthForm";

export const LoginScreen = () => {
  const t = useTranslations("Page.login");

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <UserAuthForm />
      </div>
    </>
  );
};
