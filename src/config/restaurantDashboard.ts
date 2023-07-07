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
      href: `/dashboard`,
      icon: "chevronLeft",
    },
    {
      title: "Categoies & Products",
      href: `/dashboard/restaurants/${restaurantId}`,
      icon: "store",
    },
    {
      title: "Settings",
      href: `/dashboard/restaurants/${restaurantId}/settings`,
      icon: "settings",
    },
  ],
});
