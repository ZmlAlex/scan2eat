import { type SidebarNavItem } from "~/components/DashboardNav";
import { type MainNavItem } from "~/components/MainNav";

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export const dashboardConfig: DashboardConfig = {
  mainNav: [],
  sidebarNav: [
    {
      title: "Restaurants",
      // TODO: THINK ABOUT MOBILE VIEW
      titleMobile: "Restaurants",
      href: "/dashboard",
      icon: "store",
    },
    {
      title: "Settings",
      titleMobile: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};
