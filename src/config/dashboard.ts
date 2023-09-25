import { type SidebarNavItem } from "~/components/DashboardNav";
import { type MainNavItem } from "~/components/MainNav";

export type DashboardConfig = {
  type: "commonSidebar";
  mainNav: readonly MainNavItem[];
  sidebarNav: readonly SidebarNavItem[];
};

export const dashboardConfig: DashboardConfig = {
  type: "commonSidebar",
  mainNav: [],
  sidebarNav: [
    {
      title: "restaurantTitle",
      // TODO: THINK ABOUT MOBILE VIEW
      titleMobile: "restaurantTitleMobile",
      href: "/dashboard",
      icon: "store",
    },
    {
      title: "settingsTitle",
      titleMobile: "settingsTitleMobile",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ] as const,
};
