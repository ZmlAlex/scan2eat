import { type SidebarNavItem } from "~/components/DashboardNav";
import { type MainNavItem } from "~/components/MainNav";

export type RestaurantDashboardConfig = {
  type: "restaurantSidebar";
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export const restaurantDashboardConfig = (
  restaurantId: string
): RestaurantDashboardConfig => ({
  type: "restaurantSidebar",
  mainNav: [],
  sidebarNav: [
    {
      title: "backTitle",
      titleMobile: "backTitleMobile",
      href: `/dashboard`,
      icon: "chevronLeft",
    },
    {
      title: "detailsTitle",
      titleMobile: "detailsTitleMobile",
      // TODO: CHANGE IT
      href: `/dashboard/restaurants/${restaurantId}/details`,
      icon: "store",
    },
    {
      title: "categoriesTitle",
      titleMobile: "categoriesTitleMobile",
      href: `/dashboard/restaurants/${restaurantId}`,
      icon: "pizza",
    },
    {
      title: "settingsTitle",
      titleMobile: "settingsTitleMobile",
      href: `/dashboard/restaurants/${restaurantId}/settings`,
      icon: "settings",
    },
  ],
});
