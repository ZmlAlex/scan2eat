import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import { useTranslations } from "next-intl";
import { parseCookies } from "nookies";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Icons } from "~/components/Icons";
import { ImageUploadInput } from "~/components/ImageUploadInput";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Checkbox } from "~/components/ui/Checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { Textarea } from "~/components/ui/Textarea";
import { toast } from "~/components/ui/useToast";
import { errorMapper } from "~/helpers/errorMapper";
import { imageInput } from "~/helpers/formTypes/common";
import { useGetRestaurantWithUserCheck } from "~/hooks/queries/useGetRestaurantWithUserCheck";
import { clientApi } from "~/libs/trpc/client";
import { currencyCodeS } from "~/server/api/schemas/common.schema";

const formSchema = z.object({
  name: z.string().trim().min(2).max(30),
  address: z.string().trim().min(2).max(50),
  description: z.string().trim().max(150).optional(),
  currencyCode: currencyCodeS,
  phone: z.string().optional(),
  link: z.string().optional(),
  logoImageBase64: imageInput,
  isImageDeleted: z.boolean(),
  workingHours: z.string(),
  autoTranslateEnabled: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

export const RestaurantUpdateForm = () => {
  const trpcContext = clientApi.useContext();

  const {
    data: { id: restaurantId, ...restaurant },
  } = useGetRestaurantWithUserCheck();

  const t = useTranslations("Form.restaurantUpdate");
  const tError = useTranslations("ResponseErrorMessage");

  const cookies = parseCookies();
  const selectedRestaurantLang =
    cookies[`selectedRestaurantLang${restaurantId}`];
  const hasMultipleLanguages = (restaurant.restaurantLanguage?.length ?? 0) > 1;

  const { mutate: updateRestaurant, isLoading } =
    clientApi.restaurant.updateRestaurant.useMutation({
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
          title: t("updateRestaurantMutation.success.title"),
        });
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currencyCode: restaurant.currencyCode,
      phone: restaurant.phone || "",
      name: restaurant.restaurantI18N.name,
      address: restaurant.restaurantI18N.address,
      description: restaurant.restaurantI18N.description,
      workingHours: restaurant.workingHours,
      logoImageBase64: undefined,
      isImageDeleted: false,
      autoTranslateEnabled: hasMultipleLanguages,
    },
  });

  function onSubmit(values: FormSchema) {
    const cookies = parseCookies();
    const selectedRestaurantLang =
      cookies[`selectedRestaurantLang${restaurantId}`];

    updateRestaurant({
      restaurantId,
      address: values.address,
      name: values.name,
      phone: values.phone,
      description: values.description,
      languageCode: selectedRestaurantLang as LanguageCode,
      currencyCode: values.currencyCode,
      logoImageBase64: values.logoImageBase64,
      workingHours: values.workingHours,
      isImageDeleted: values.isImageDeleted,
      autoTranslateEnabled: values.autoTranslateEnabled,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="update-restaurant-form"
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>{t("inputs.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("inputs.name")} {...field} />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("inputs.workingHours")}</FormLabel>

                  <FormControl>
                    <Input placeholder={t("inputs.workingHours")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>{t("inputs.address")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("inputs.address")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("inputs.description.title")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("inputs.description.placeholder")}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("inputs.phone")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("inputs.phone")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* //TODO: THINK ABOUT LINKS  */}
            {/* <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
            <FormField
              control={form.control}
              name="currencyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>
                    {t("inputs.currencySelect.title")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("inputs.currencySelect.description")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* TODO: MAKE IT DYNAMIC */}
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="RUB">RUB</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoImageBase64"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploadInput
                      {...field}
                      preselectedImageUrl={restaurant.logoUrl}
                      onImageDelete={() =>
                        form.setValue("isImageDeleted", true)
                      }
                    />
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
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
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
                  {restaurant.restaurantLanguage.map((lang) => (
                    <Badge className="capitalize" key={lang.languageCode}>
                      {lang.languageCode}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("primaryButtonLabel")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
