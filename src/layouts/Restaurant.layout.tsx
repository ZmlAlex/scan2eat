import { SiteFooter } from "~/components/SiteFooter";

interface RestaurantLayoutProps {
  children: React.ReactNode;
}

export function RestaurantLayout({ children }: RestaurantLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container isolate flex flex-1 flex-col items-stretch justify-center gap-8 md:max-w-screen-lg">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
