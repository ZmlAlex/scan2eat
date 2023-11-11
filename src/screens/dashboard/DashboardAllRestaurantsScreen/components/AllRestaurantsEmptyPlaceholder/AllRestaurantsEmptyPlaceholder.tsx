import { useTranslations } from "next-intl";
import React from "react";

import { EmptyPlaceholder } from "~/components/EmptyPlaceholder";
import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";

type Props = {
  onClick: () => void;
};

export const AllRestaurantsPlaceholder = ({ onClick }: Props) => {
  const t = useTranslations("Dashboard.page.allRestaurants");

  return (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="store" />
      <EmptyPlaceholder.Title>
        {t("emptyPlaceholder.title")}
      </EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        {t("emptyPlaceholder.description")}
      </EmptyPlaceholder.Description>
      <Button variant="outline" onClick={onClick}>
        <Icons.add className="mr-2 h-4 w-4" />
        {t("newRestaurantButtonLabel")}
      </Button>
    </EmptyPlaceholder>
  );
};
