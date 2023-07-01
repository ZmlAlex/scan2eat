import type { LanguageCode } from "@prisma/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import { DashboardHeader } from "~/components/DashboardHeader";
import { EmptyPlaceholder } from "~/components/EmptyPlaceholder";
import { Icons } from "~/components/Icons";
import RestaurantCreateForm from "~/components/RestaurantCreateForm";
import { RestaurantItem } from "~/components/RestaurantItem";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import useModal from "~/hooks/useModal";
import DashboardLayout from "~/layouts/Dashboard.layout";
import { api } from "~/utils/api";
import { formatTranslationToOneLanguage } from "~/utils/formatTranslationToOneLanguage";

const RestaurantList = () => {
  const { isModalOpen, toggleModal } = useModal();

  const router = useRouter();

  const { data: restaurants, status } =
    api.restaurant.getAllRestaurants.useQuery(undefined, {
      select: (restaurants) =>
        formatTranslationToOneLanguage(
          restaurants,
          router.locale as LanguageCode
        ),
    });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <DashboardHeader
          heading="Restaurants"
          text="Create and manage restaurants"
        >
          <Button onClick={toggleModal}>
            <Icons.add className="mr-2 h-4 w-4" />
            New Restaurant
          </Button>
        </DashboardHeader>
        <div className="grid gap-10">
          {status === "loading" && <div>loading</div>}
          {status === "success" && (
            <>
              {restaurants?.length ? (
                <div className="divide-y divide-border rounded-md border">
                  {restaurants.map((restaurant) => (
                    <RestaurantItem
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
                </div>
              ) : (
                <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="store" />
                  <EmptyPlaceholder.Title>
                    No restaurants created
                  </EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    You don&apos;t have any restaurants yet. Start creating
                    content.
                  </EmptyPlaceholder.Description>
                  <Button variant="outline" onClick={toggleModal}>
                    <Icons.add className="mr-2 h-4 w-4" />
                    New Restaurant
                  </Button>
                </EmptyPlaceholder>
              )}
            </>
          )}
        </div>
      </DashboardLayout>

      {/* //TODO MOVE IT TO COMPONENT */}
      <Dialog open={isModalOpen} onOpenChange={toggleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create restaurant</DialogTitle>
            <DialogDescription>
              Add details about your restaurant here. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <RestaurantCreateForm onSuccessCallback={toggleModal} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RestaurantList;
