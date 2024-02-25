import { RestaurantLayout } from "~/layouts/Restaurant.layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RestaurantLayout>{children}</RestaurantLayout>;
}
