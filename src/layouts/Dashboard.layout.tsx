"use client";
import { useParams, usePathname } from "next/navigation";
// TODO: REPLACE
import { useSession } from "next-auth/react";

import { DashboardMobileNav } from "~/components/DashboardMobileNav";
import { DashboardNav } from "~/components/DashboardNav";
import { LanguageToggle } from "~/components/LanguageToggle";
import { MainNav } from "~/components/MainNav";
import { ModeToggle } from "~/components/ModeToggle";
import { SiteFooter } from "~/components/SiteFooter";
import { UserAccountNav } from "~/components/UserAccountNav";
import { dashboardConfig } from "~/config/dashboard";
import { restaurantDashboardConfig } from "~/config/restaurantDashboard";

interface RestaurantDashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: RestaurantDashboardLayoutProps) {
  const { data: sessionData } = useSession();
  const { restaurantId } = useParams();
  const pathname = usePathname();

  const config = pathname.includes("restaurant")
    ? restaurantDashboardConfig(restaurantId as string)
    : dashboardConfig;

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex items-center justify-between gap-x-4 py-6">
          <MainNav items={config.mainNav} />

          <div className="ml-auto">
            <ModeToggle />
          </div>

          <LanguageToggle
          />

          {sessionData && (
            <UserAccountNav
              user={{
                name: sessionData.user.name,
                image: sessionData.user.image,
                email: sessionData.user.email,
              }}
            />
          )}
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav type={config.type} items={config.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className={"grid items-start gap-8"}>{children}</div>
          <DashboardMobileNav type={config.type} items={config.sidebarNav} />
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
