import { type SidebarNavItem } from "~/components/DashboardNav";
import { type MainNavItem } from "~/components/MainNav";

export type RestaurantDashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export const restaurantDashboardConfig = (
  restaurantId: string
): RestaurantDashboardConfig => ({
  mainNav: [],
  sidebarNav: [
    {
      title: "Back to restaurants",
      titleMobile: "Back",
      href: `/dashboard`,
      icon: "chevronLeft",
    },
    {
      title: "Details",
      titleMobile: "Details",
      // TODO: CHANGE IT
      href: `/dashboard/restaurants/${restaurantId}/details`,
      icon: "store",
    },
    {
      title: "Categoies & Products",
      titleMobile: "Products",
      href: `/dashboard/restaurants/${restaurantId}`,
      icon: "pizza",
    },
    {
      title: "Settings",
      titleMobile: "Settings",
      href: `/dashboard/restaurants/${restaurantId}/settings`,
      icon: "settings",
    },
  ],
});
