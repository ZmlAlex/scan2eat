import { useTranslations } from "next-intl";
import React from "react";

import { EmptyPlaceholder } from "~/components/EmptyPlaceholder";
import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";

type Props = {
  onClick: () => void;
};

export const CategoriesEmptyPlaceholder = ({ onClick }: Props) => {
  const t = useTranslations("Dashboard.categoriesBlock");

  return (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="layoutList" />
      <EmptyPlaceholder.Title>
        {t("emptyPlaceholder.title")}
      </EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        {t("emptyPlaceholder.description")}
      </EmptyPlaceholder.Description>
      <Button variant="outline" onClick={onClick}>
        <Icons.add className="mr-2 h-4 w-4" />
        {t("newCategoryButtonLabel")}
      </Button>
    </EmptyPlaceholder>
  );
};
