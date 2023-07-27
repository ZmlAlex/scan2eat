import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { DashboardNav } from "~/components/DashboardNav";
import { MainNav } from "~/components/MainNav";
import { ModeToggle } from "~/components/ModeToggle";
import { SiteFooter } from "~/components/SiteFooter";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import { UserAccountNav } from "~/components/UserAccountNav";
import { restaurantDashboardConfig } from "~/config/restaurantDashboard";

interface RestaurantDashboardLayoutProps {
  children?: React.ReactNode;
}

export default function RestaurantDashboardLayout({
  children,
}: RestaurantDashboardLayoutProps) {
  const { data: sessionData } = useSession();
  const {
    query: { restaurantId },
    pathname,
  } = useRouter();

  const config = restaurantDashboardConfig(restaurantId as string);

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between gap-x-4 py-4">
          <MainNav items={config.mainNav} />

          <div className="ml-auto">
            <ModeToggle />
          </div>
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
          <DashboardNav items={config.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className={"grid items-start gap-8"}>{children}</div>

          {/* Floating menu */}
          <div className="fixed bottom-4 left-0 w-full md:hidden">
            {/* TODO: USE MAP FOR CONFIG */}
            <Tabs defaultValue={pathname} className="mx-2">
              <TabsList className="w-full">
                <TabsTrigger className="flex-1" value="/dashboard">
                  <Link className="w-full" href={`/dashboard`}>
                    Back
                  </Link>
                </TabsTrigger>
                <TabsTrigger
                  className="flex-1"
                  value="/dashboard/restaurants/[restaurantId]/details"
                >
                  <Link
                    className="w-full"
                    // TODO: CHANGE IT!
                    href={`/dashboard/restaurants/${
                      restaurantId as string
                    }/details`}
                  >
                    Details
                  </Link>
                </TabsTrigger>
                <TabsTrigger
                  className="flex-1"
                  value="/dashboard/restaurants/[restaurantId]"
                >
                  <Link
                    className="w-full"
                    href={`/dashboard/restaurants/${restaurantId as string}`}
                  >
                    Categories
                  </Link>
                </TabsTrigger>
                <TabsTrigger
                  className="flex-1"
                  value="/dashboard/restaurants/[restaurantId]/settings"
                >
                  <Link
                    className="w-full"
                    href={`/dashboard/restaurants/${
                      restaurantId as string
                    }/settings`}
                  >
                    Settings
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
