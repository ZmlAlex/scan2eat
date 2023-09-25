import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Icons } from "~/components/Icons";
import type { DashboardConfig } from "~/config/dashboard";
import type { RestaurantDashboardConfig } from "~/config/restaurantDashboard";
import { cn } from "~/utils/cn";

export type SidebarNavItem = {
  title:
    | keyof IntlMessages["Dashboard"]["commonSidebar"]
    | keyof IntlMessages["Dashboard"]["restaurantSidebar"];
  titleMobile:
    | keyof IntlMessages["Dashboard"]["commonSidebar"]
    | keyof IntlMessages["Dashboard"]["restaurantSidebar"];
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & {
  href: string;
  items?: never;
};

interface DashboardNavProps {
  type: RestaurantDashboardConfig["type"] | DashboardConfig["type"];
  items: readonly SidebarNavItem[];
}

export function DashboardNav({ items, type }: DashboardNavProps) {
  const t = useTranslations(`Dashboard.${type}`);

  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map(({ icon, href, disabled, title }, index) => {
        const Icon = Icons[icon || "arrowRight"];
        return (
          href && (
            <Link key={index} href={disabled ? "/" : href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === href ? "bg-accent" : "transparent",
                  disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{t(title)}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
