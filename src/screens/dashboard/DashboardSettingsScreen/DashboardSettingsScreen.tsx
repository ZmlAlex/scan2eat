import { useTranslations } from "next-intl";
import React from "react";

import { DashboardHeader } from "~/components/DashboardHeader";
import { DashboardLayout } from "~/layouts/Dashboard.layout";

export const DashboardSettingsScreen = () => {
  const t = useTranslations("Dashboard.page.settings");
  return (
    <DashboardLayout>
      <DashboardHeader heading={t("title")} text={t("description")} />
      <div className="grid gap-10">
        {/* <UserNameForm user={{ id: user.id, name: user.name || "" }} /> */}
      </div>
    </DashboardLayout>
  );
};
