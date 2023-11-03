import { RestaurantSiteFooter } from "~/components/RestaurantSiteFooter";

interface RestaurantLayoutProps {
  children: React.ReactNode;
}

export function RestaurantLayout({ children }: RestaurantLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container isolate mb-8 flex flex-1 flex-col items-stretch gap-8 md:max-w-screen-lg">
        {children}
      </main>
      <RestaurantSiteFooter />
    </div>
  );
}
