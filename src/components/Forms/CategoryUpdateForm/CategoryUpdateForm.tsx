import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import { useTranslations } from "next-intl";
import { parseCookies } from "nookies";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Icons } from "~/components/Icons";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Checkbox } from "~/components/ui/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import { toast } from "~/components/ui/useToast";
import { errorMapper } from "~/helpers/errorMapper";
import type { RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { useGetRestaurantWithUserCheck } from "~/hooks/queries/useGetRestaurantWithUserCheck";
import { clientApi } from "~/libs/trpc/client";
import type { ArrayElement } from "~/types/shared.type";

const formSchema = z.object({
  name: z.string().trim().min(1).max(30),
  autoTranslateEnabled: z.boolean(),
});

type Props = {
  isModalOpen: boolean;
  toggleModal: () => void;
  category: ArrayElement<RestaurantWithDetails["category"]>;
};

type FormSchema = z.infer<typeof formSchema>;

export const CategoryUpdateForm = ({
  isModalOpen,
  category,
  toggleModal,
}: Props) => {
  const trpcContext = clientApi.useContext();

  const { data: restaurant } = useGetRestaurantWithUserCheck();

  const t = useTranslations("Form.categoryUpdate");
  const tError = useTranslations("ResponseErrorMessage");

  const cookies = parseCookies();
  const selectedRestaurantLang =
    cookies[`selectedRestaurantLang${restaurant.id}`];
  const hasMultipleLanguages = restaurant.restaurantLanguage.length > 1;

  const { mutate: updateCategory, isLoading } =
    clientApi.category.updateCategory.useMutation({
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (updatedRestaurants) => {
        trpcContext.restaurant.getRestaurantWithUserCheck.setData(
          { restaurantId: restaurant.id },
          () => updatedRestaurants
        );

        toast({
          title: t("updateCategoryMutation.success.title"),
        });

        toggleModal();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.categoryI18N.name,
      autoTranslateEnabled: hasMultipleLanguages,
    },
  });

  function onSubmit(values: FormSchema) {
    updateCategory({
      restaurantId: restaurant.id,
      categoryId: category.id,
      name: values.name,
      autoTranslateEnabled: values.autoTranslateEnabled,
      languageCode: selectedRestaurantLang as LanguageCode,
    });
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(event) => event.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>{t("inputs.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("inputs.name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hasMultipleLanguages && (
              <>
                <FormField
                  control={form.control}
                  name="autoTranslateEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormLabel>
                        {t("inputs.autoTranslateEnabled.firstRow")}
                        <p className="text-sm">
                          ({t("inputs.autoTranslateEnabled.secondRow")}{" "}
                          <Badge className="capitalize" variant="secondary">
                            {selectedRestaurantLang}
                          </Badge>
                          )
                        </p>
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-x-2">
                  {restaurant.restaurantLanguage
                    .filter(
                      (lang) => selectedRestaurantLang !== lang.languageCode
                    )
                    .map((lang) => (
                      <Badge className="capitalize" key={lang.languageCode}>
                        {lang.languageCode}
                      </Badge>
                    ))}
                </div>
              </>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("primaryButtonLabel")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
