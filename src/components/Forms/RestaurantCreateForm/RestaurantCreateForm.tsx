import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Icons } from "~/components/Icons";
import { ImageUploadInput } from "~/components/ImageUploadInput";
import { Button } from "~/components/ui/Button";
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
  FormDescription,
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
import { api } from "~/helpers/api";
import { errorMapper } from "~/helpers/errorMapper";
import { imageInput } from "~/helpers/formTypes/common";
import {
  currencyCodeS,
  languageCodeS,
} from "~/server/api/schemas/common.schema";

const formSchema = z.object({
  languageCode: languageCodeS,
  name: z.string().trim().min(2).max(30),
  address: z.string().trim().min(2).max(50),
  workingHours: z.string(),
  description: z.string().trim().max(150).optional(),
  currencyCode: currencyCodeS,
  phone: z.string().optional(),
  link: z.string().optional(),
  logoImageBase64: imageInput,
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  isModalOpen: boolean;
  toggleModal: () => void;
};

export const RestaurantCreateForm = ({ isModalOpen, toggleModal }: Props) => {
  const trpcContext = api.useContext();
  const t = useTranslations("Form.restaurantCreate");
  const tError = useTranslations("ResponseErrorMessage");

  const { mutate: createRestaurant, isLoading } =
    api.restaurant.createRestaurant.useMutation({
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (newRestaurant) => {
        trpcContext.restaurant.getAllRestaurants.setData(
          undefined,
          (prevRestaurants = []) => [...prevRestaurants, newRestaurant]
        );

        toast({
          title: t("createRestaurantMutation.success.title"),
        });
        toggleModal();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      workingHours: "",
      phone: "",
      logoImageBase64: undefined,
    },
  });

  function onSubmit(values: FormSchema) {
    createRestaurant({
      address: values.address,
      name: values.name,
      currencyCode: values.currencyCode,
      languageCode: values.languageCode,
      logoImageBase64: values.logoImageBase64,
      description: values.description,
      // TODO: ADD PHONE
      //TODO: REMOVE THIS FIELD
      workingHours: "from 9:00 to 21:00",
    });
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="create-restaurant-form"
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="languageCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>
                    {t("inputs.languageSelect.title")}
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("inputs.languageSelect.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* TODO: REPLACE */}
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="russian">Russian</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("inputs.languageSelect.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>{t("inputs.address")}</FormLabel>
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
                    <ImageUploadInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
