import { type Metadata } from "next";
import Link from "next/link";

import { Icons } from "~/components/Icons";
import { ModeToggle } from "~/components/ModeToggle";
import { buttonVariants } from "~/components/ui/Button";
import { UserAuthForm } from "~/components/UserAuthForm";
import { cn } from "~/utils/cn";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute left-4  right-4 top-4 flex items-center justify-between md:left-8 md:right-8 md:top-8">
        <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
          <>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back
          </>
        </Link>

        <ModeToggle />
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Welcome to FoodMate
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in or create new account
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  );
}
