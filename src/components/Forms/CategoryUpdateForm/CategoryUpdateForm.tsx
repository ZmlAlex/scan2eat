import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import { useTranslations } from "next-intl";
import { parseCookies } from "nookies";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import { toast } from "~/components/ui/useToast";
import { api } from "~/utils/api";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

// TODO: MOVE TO THE GLOBAL
import type { ArrayElement } from "../../RestaurantMenu/CategoryProduct";

const formSchema = z.object({
  name: z.string().trim().min(1).max(30),
});

type Props = {
  isModalOpen: boolean;
  toggleModal: () => void;
  restaurantId: string;
  //TODO: MOVE TO THE GLOBAL
  category: ArrayElement<RestaurantWithDetails["category"]>;
};

type FormSchema = z.infer<typeof formSchema>;

const CategoryUpdateForm = ({
  isModalOpen,
  restaurantId,
  category,
  toggleModal,
}: Props) => {
  const trpcContext = api.useContext();
  const t = useTranslations("Form.categoryUpdate");

  const { mutate: updateCategory, isLoading } =
    api.category.updateCategory.useMutation({
      onError: () =>
        toast({
          title: t("updateCategoryMutation.error.title"),
          description: t("updateCategoryMutation.error.description"),
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurants) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
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
    },
  });

  function onSubmit(values: FormSchema) {
    const cookies = parseCookies();
    const selectedRestaurantLang =
      cookies[`selectedRestaurantLang${restaurantId}`];

    updateCategory({
      restaurantId,
      categoryId: category.id,
      name: values.name,
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

export default CategoryUpdateForm;
