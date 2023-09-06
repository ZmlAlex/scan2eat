import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import { parseCookies } from "nookies";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import ImageUploadInput from "~/components/ImageUploadInput";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { currencyCodeS } from "~/server/api/schemas/common.schema";
import { api } from "~/utils/api";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";
import { imageInput } from "~/utils/formTypes/common";

import { Icons } from "../../Icons";

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
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  restaurant: RestaurantWithDetails;
};
const RestaurantUpdateForm = ({
  // TODO: THINK ABOUT CONTEXT
  restaurant,
}: Props) => {
  const trpcContext = api.useContext();
  const { mutate: updateRestaurant, isLoading } =
    api.restaurant.updateRestaurant.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description:
            "Your update restaurant request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId: restaurant.id },
          () => updatedRestaurant
        );

        toast({
          title: "Restaurant has been updated.",
        });
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currencyCode: restaurant.currencyCode,
      phone: "",
      name: restaurant.restaurantI18N.name,
      address: restaurant.restaurantI18N.address,
      description: restaurant.restaurantI18N.description,
      workingHours: restaurant.workingHours,
      logoImageBase64: undefined,
      isImageDeleted: false,
    },
  });

  function onSubmit(values: FormSchema) {
    const { selectedRestaurantLang } = parseCookies();

    updateRestaurant({
      restaurantId: restaurant.id,
      address: values.address,
      name: values.name,
      description: values.description,
      languageCode: selectedRestaurantLang as LanguageCode,
      currencyCode: values.currencyCode,
      logoImageBase64: values.logoImageBase64,
      workingHours: values.workingHours,
      isImageDeleted: values.isImageDeleted,
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
            <CardTitle>Restaurant Details</CardTitle>
            <CardDescription>
              Edit your restaurant details and click submit when you&apos;re
              done
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Name</FormLabel> */}
                  <FormControl>
                    <Input placeholder="Name" {...field} />
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
                  <FormControl>
                    <Input placeholder="Working hours" {...field} />
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
                  <FormControl>
                    <Input placeholder="Address" {...field} />
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
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about your restaurant"
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
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
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
                  {/* <FormLabel>Currency</FormLabel> */}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default RestaurantUpdateForm;
