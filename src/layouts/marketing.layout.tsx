import Link from "next/link";

import { MainNav } from "~/components/MainNav";
import { ModeToggle } from "~/components/ModeToggle";
import { SiteFooter } from "~/components/SiteFooter";
import { buttonVariants } from "~/components/ui/Button";
import { marketingConfig } from "~/config/marketing";
import { cn } from "~/lib/utils";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between gap-x-4 py-6">
          <MainNav items={marketingConfig.mainNav} />

          <div className="ml-auto">
            <ModeToggle />
          </div>

          <nav>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
