import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
import { type Pathnames } from "next-intl/navigation";

export const locales = ["english", "russian"] as const;

export const defaultLocale = locales[0];

export type Locale = (typeof locales)[number];

// default configuration for all locales
export const pathnames = {
  "/": "/",
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
  });
