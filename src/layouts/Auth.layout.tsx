import Link from "next/link";
import { useTranslations } from "next-intl";

import { Icons } from "~/components/Icons";
import { LanguageToggle } from "~/components/LanguageToggle";
import { ModeToggle } from "~/components/ModeToggle";
import { buttonVariants } from "~/components/ui/Button";
import { cn } from "~/libs/cn";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const t = useTranslations("Page.login");
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-x-4 md:left-8 md:right-8 md:top-8">
        <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
          <>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            {t("backButtonLabel")}
          </>
        </Link>

        <div className="ml-auto">
          <ModeToggle />
        </div>

        <LanguageToggle />
      </div>

      <main>{children}</main>
    </div>
  );
}
