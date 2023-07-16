import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/Form";
import { api } from "~/utils/api";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import { Button } from "../../ui/Button";
import { Switch } from "../../ui/Switch";
import { toast } from "../../ui/useToast";

//TODO: UPDATE WITH ALL POSSIBLE LANGUAGES
const formSchema = z.object({
  english: z.boolean().optional(),
  russian: z.boolean().optional(),
});

type Props = {
  restaurantId: string;
  //TODO: CHANGE WITH LANGUAGES TYPE
  restaurant: RestaurantWithDetails;
  onSuccessCallback?: () => void;
};

const RestaurantLanguageUpdateForm = ({ restaurantId, restaurant }: Props) => {
  const trpcContext = api.useContext();

  const { mutate: setEnabledRestaurantLanguages, isLoading } =
    api.restaurant.setEnabledRestaurantLanguages.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description:
            "Your update restaurant languages request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        toast({
          title: "Restaurant's languages have been updated.",
        });
      },
    });

  const defaultFormValues = restaurant.restaurantLanguage.reduce((acc, cur) => {
    return { ...acc, [cur.languageCode]: cur.isEnabled };
  }, {});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  // It requires when we add new language to get relevant value for switch component
  React.useEffect(() => {
    restaurant.restaurantLanguage.forEach((language) =>
      form.setValue(language.languageCode, language.isEnabled)
    );
  }, [form, restaurant.restaurantLanguage]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const languageCodes = Object.entries(values)
      .filter((language) => language[1] !== undefined)
      .map((language) => ({
        languageCode: language[0] as LanguageCode,
        isEnabled: language[1],
      }));

    setEnabledRestaurantLanguages({
      languageCodes,
      restaurantId,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Language visibility</h3>
          <div className="space-y-4">
            {restaurant.restaurantLanguage.map((language) => (
              <FormField
                key={language.languageCode}
                control={form.control}
                name={language.languageCode}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
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
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default RestaurantLanguageUpdateForm;
