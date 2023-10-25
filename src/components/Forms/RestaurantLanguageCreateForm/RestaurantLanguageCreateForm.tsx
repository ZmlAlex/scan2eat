import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "~/components//ui/useToast";
import { Icons } from "~/components/Icons";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { api } from "~/helpers/api";
import { errorMapper } from "~/helpers/errorMapper";
import { languageCodeS } from "~/server/api/schemas/common.schema";

const formSchema = z.object({
  languageCode: languageCodeS,
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  toggleModal: () => void;
  isModalOpen: boolean;
  availableLanguages: LanguageCode[];
  restaurantId: string;
};

export const RestaurantLanguageCreateForm = ({
  availableLanguages,
  // TODO: GET FROM QUERY?
  restaurantId,
  isModalOpen,
  toggleModal,
}: Props) => {
  const trpcContext = api.useContext();
  const t = useTranslations("Form.restaurantLanguageCreate");
  const tError = useTranslations("ResponseErrorMessage");

  const { mutate: createRestaurantLanguage, isLoading } =
    api.restaurant.createRestaurantLanguage.useMutation({
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        toast({
          title: t("createRestaurantLanguageMutation.success.title"),
        });
        toggleModal();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: FormSchema) {
    createRestaurantLanguage({
      languageCode: values.languageCode,
      restaurantId,
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      {availableLanguages.map((language) => (
                        <SelectItem
                          className="capitalize"
                          key={language}
                          value={language}
                        >
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("inputs.languageSelect.description")}
                  </FormDescription>
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
