import type { LanguageCode } from "@prisma/client";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import React from "react";

import { DashboardHeader } from "~/components/DashboardHeader";
import { EmptyPlaceholder } from "~/components/EmptyPlaceholder";
import RestaurantCreateForm from "~/components/Forms/RestaurantCreateForm";
import { Icons } from "~/components/Icons";
import RestaurantItem from "~/components/RestaurantItem";
import { Button } from "~/components/ui/Button";
import { api } from "~/helpers/api";
import { formatTranslationToOneLanguage } from "~/helpers/formatTranslationToOneLanguage";
import { getServerSidePropsWithLanguage } from "~/helpers/getServerSidePropsWithLanguage";
import useModal from "~/hooks/useModal";
import DashboardLayout from "~/layouts/Dashboard.layout";

const RestaurantsList = () => {
  const { isModalOpen, toggleModal } = useModal();
  const router = useRouter();
  const t = useTranslations("Dashboard.page.allRestaurants");

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
      <DashboardLayout>
        <DashboardHeader heading={t("title")} text={t("description")}>
          <Button onClick={toggleModal}>
            <Icons.add className="mr-2 h-4 w-4" />
            {t("newRestaurantButtonLabel")}
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
                    {t("emptyPlaceholder.title")}
                  </EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    {t("emptyPlaceholder.description")}
                  </EmptyPlaceholder.Description>
                  <Button variant="outline" onClick={toggleModal}>
                    <Icons.add className="mr-2 h-4 w-4" />
                    {t("newRestaurantButtonLabel")}
                  </Button>
                </EmptyPlaceholder>
              )}
            </>
          )}
        </div>
      </DashboardLayout>

      {isModalOpen && (
        <RestaurantCreateForm
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
        />
      )}
    </>
  );
};

export const getServerSideProps = getServerSidePropsWithLanguage;

export default RestaurantsList;
