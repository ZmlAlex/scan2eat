import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Switch } from "~/components//ui/Switch";
import { Button } from "~/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/Form";
import { toast } from "~/components/ui/useToast";
import { api } from "~/helpers/api";
import { errorMapper } from "~/helpers/errorMapper";
import { useGetRestaurantWithUserCheck } from "~/hooks/useGetRestaurantWithUserCheck";

//TODO: UPDATE WITH ALL POSSIBLE LANGUAGES
const formSchema = z.object({
  english: z.boolean().optional(),
  russian: z.boolean().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export const RestaurantLanguageUpdateForm = () => {
  const trpcContext = api.useContext();

  const {
    data: { id: restaurantId, ...restaurant },
  } = useGetRestaurantWithUserCheck();

  const t = useTranslations("Form.restaurantLanguageUpdate");
  const tError = useTranslations("ResponseErrorMessage");

  const { mutate: setEnabledRestaurantLanguages, isLoading } =
    api.restaurant.setEnabledRestaurantLanguages.useMutation({
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurantWithUserCheck.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        toast({
          title: t("updateRestaurantLanguageMutation.success.title"),
        });
      },
    });

  const defaultFormValues = restaurant.restaurantLanguage.reduce((acc, cur) => {
    return { ...acc, [cur.languageCode]: cur.isEnabled };
  }, {});

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  // It requires when we add new language to get relevant value for switch component
  React.useEffect(() => {
    restaurant.restaurantLanguage.forEach((language) =>
      form.setValue(language.languageCode, language.isEnabled)
    );
  }, [form, restaurant.restaurantLanguage]);

  function onSubmit(values: FormSchema) {
    const languageCodes = Object.entries(values)
      .filter((language) => language[1] !== undefined)
      .map((language) => ({
        languageCode: language[0] as LanguageCode,
        isEnabled: language[1],
      }));

    if (!languageCodes.some((lang) => lang.isEnabled)) {
      toast({
        title: t(
          "updateRestaurantLanguageMutation.error.allLanguagesIsDisabled.title"
        ),
        variant: "destructive",
      });
      return;
    }

    setEnabledRestaurantLanguages({
      languageCodes,
      restaurantId,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">{t("title")}</h3>
          <div className="space-y-4">
            {restaurant.restaurantLanguage.map((language) => (
              <FormField
                key={language.languageCode}
                control={form.control}
                name={language.languageCode}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base capitalize">
                        {language.languageCode}
                      </FormLabel>
                      {/* <FormDescription>
                        Receive emails about new products, features, and more.
                      </FormDescription> */}
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {t("primaryButtonLabel")}
        </Button>
      </form>
    </Form>
  );
};
