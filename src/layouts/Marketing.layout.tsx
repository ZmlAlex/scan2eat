import Link from "next/link";

import { Icons } from "~/components/Icons";
import { ModeToggle } from "~/components/ModeToggle";
import { SiteFooter } from "~/components/SiteFooter";
import { buttonVariants } from "~/components/ui/Button";
import { siteConfig } from "~/config/site";
import { cn } from "~/utils/cn";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between gap-x-4 py-6">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo />
            <span className="inline-block text-lg font-bold md:text-2xl">
              {siteConfig.name}
            </span>
          </Link>

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
