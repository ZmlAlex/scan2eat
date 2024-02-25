import { MarketingLayout } from "~/layouts/Marketing.layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
