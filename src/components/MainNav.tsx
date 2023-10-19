import Link from "next/link";
import React from "react";

import { Icons } from "~/components/Icons";
import { MobileNav } from "~/components/MobileNav";
import { siteConfig } from "~/config/site";
import { cn } from "~/helpers/cn";

export type MainNavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

interface MainNavProps {
  items?: readonly MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo />
        <span className="inline-block font-bold md:text-2xl">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                //TODO: FIX IT
                // item.href.startsWith(`/${segment}`)
                //   ? "text-foreground"
                //   : "text-foreground/60",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {/* TODO: THINK ABOUT MENU */}
        {/* {showMobileMenu ? <Icons.close /> : <Icons.logo />}
        <span className="font-bold">Menu</span> */}
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )}
    </div>
  );
}
