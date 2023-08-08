import { SiteFooter } from "~/components/SiteFooter";

interface RestaurantLayoutProps {
  children: React.ReactNode;
}

export default function RestaurantLayout({ children }: RestaurantLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="isolate flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
