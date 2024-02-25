// "use client";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Icons } from "~/components/Icons";
import { LanguageToggle } from "~/components/LanguageToggle";
import { ModeToggle } from "~/components/ModeToggle";
import { SiteFooter } from "~/components/SiteFooter";
import { buttonVariants } from "~/components/ui/Button";
import { siteConfig } from "~/config/site";
import { cn } from "~/libs/cn";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const t = useTranslations("Common");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-background">
        <div className="container flex items-center justify-between gap-x-4 py-6">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.pizza />
            <span className="inline-block text-lg font-bold md:text-2xl">
              {siteConfig.name}
            </span>
          </Link>

          <div className="ml-auto">
            <ModeToggle />
          </div>

          <LanguageToggle />

          <nav>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
            >
              {t("loginButtonLabel")}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
