import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/Tabs";

import type { SidebarNavItem } from "./DashboardNav";

interface DashboardNavProps {
  items: SidebarNavItem[];
}

export function DashboardMobileNav({ items }: DashboardNavProps) {
  const [selectedPath, setSelectedPath] = React.useState("");

  const path = usePathname();

  React.useEffect(() => setSelectedPath(path), [path]);

  return (
    <div className="fixed bottom-4 left-0 w-full md:hidden">
      <Tabs value={selectedPath} className="mx-2">
        <TabsList className="w-full">
          {items.map((item) => (
            <TabsTrigger key={item.title} className="flex-1" value={item.href}>
              <Link className="w-full" href={item.href}>
                {item.titleMobile}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
