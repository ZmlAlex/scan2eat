import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import type { DashboardConfig } from "~/config/dashboard";
import type { RestaurantDashboardConfig } from "~/config/restaurantDashboard";

import type { SidebarNavItem } from "./DashboardNav";

interface DashboardNavProps {
  type: RestaurantDashboardConfig["type"] | DashboardConfig["type"];
  items: readonly SidebarNavItem[];
}

export function DashboardMobileNav({ type, items }: DashboardNavProps) {
  const [selectedPath, setSelectedPath] = React.useState("");

  const t = useTranslations(`Dashboard.${type}`);
  const path = usePathname();

  React.useEffect(() => setSelectedPath(path), [path]);

  return (
    <div className="fixed bottom-4 left-0 w-full md:hidden">
      <Tabs value={selectedPath} className="mx-2">
        <TabsList className="w-full">
          {items.map(({ titleMobile, href }) => (
            <TabsTrigger key={titleMobile} className="flex-1" value={href}>
              <Link className="w-full" href={href}>
                {t(titleMobile)}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
