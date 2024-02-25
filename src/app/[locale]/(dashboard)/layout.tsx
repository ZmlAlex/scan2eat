import { DashboardLayout } from "~/layouts/Dashboard.layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
