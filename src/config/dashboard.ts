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
      titleMobile: "restaurantTitleMobile",
      href: "/dashboard",
      icon: "store",
    },
    // TODO: UNCOMMENT WHEN GLOBAL SETTINGS WILL BE ADDED
    // {
    //   title: "settingsTitle",
    //   titleMobile: "settingsTitleMobile",
    //   href: "/dashboard/settings",
    //   icon: "settings",
    // },
  ] as const,
};
