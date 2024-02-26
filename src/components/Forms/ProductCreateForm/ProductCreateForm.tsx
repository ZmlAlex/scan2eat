import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import { useTranslations } from "next-intl";
import { parseCookies } from "nookies";
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
import { clientApi } from "~/libs/trpc/client";
import { useGetRestaurantWithUserCheck } from "~/libs/trpc/hooks/useGetRestaurantWithUserCheck";
import { measurementUnitS } from "~/server/helpers/common.schema";

const formSchema = z.object({
  name: z.string().trim().min(2).max(50),
  description: z.string().trim().max(150),
  price: z.number().nonnegative(),
  imageBase64: imageInput,
  measurementValue: z.string().optional(),
  measurementUnit: measurementUnitS.optional(),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  isModalOpen: boolean;
  toggleModal: () => void;
  categoryId: string;
};

export const ProductCreateForm = ({
  categoryId,
  isModalOpen,
  toggleModal,
}: Props) => {
  const trpcContext = clientApi.useContext();

  const {
    data: { id: restaurantId },
  } = useGetRestaurantWithUserCheck();

  const t = useTranslations("Form.productCreate");
  const tError = useTranslations("ResponseErrorMessage");

  const { mutate: createProduct, isLoading } =
    clientApi.product.createProduct.useMutation({
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
          title: t("createProductMutation.success.title"),
        });
        toggleModal();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      measurementValue: "",
      imageBase64: undefined,
    },
  });

  function onSubmit(values: FormSchema) {
    const cookies = parseCookies();
    const selectedRestaurantLang =
      cookies[`selectedRestaurantLang${restaurantId}`];

    if (selectedRestaurantLang) {
      createProduct({
        name: values.name,
        description: values.description,
        price: values.price,
        languageCode: selectedRestaurantLang as LanguageCode,
        imageBase64: values.imageBase64,
        measurementUnit: values.measurementUnit,
        measurementValue: values.measurementValue,
        restaurantId,
        categoryId,
      });
    }
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>{t("inputs.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("inputs.name")} {...field} />
                  </FormControl>
                  {/* <FormMessage /> */}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>{t("inputs.price")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("inputs.price")}
                      type="number"
                      {...field}
                      onChange={(event) =>
                        field.onChange(parseFloat(event.target.value))
                      }
                      step={0.1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name="measurementValue"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("inputs.measurementValue")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("inputs.measurementValue")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="measurementUnit"
                render={({ field }) => (
                  <FormItem className="">
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "inputs.measurementSelect.placeholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="g">
                          {t("inputs.measurementSelect.weight")}
                        </SelectItem>
                        <SelectItem value="ml">
                          {t("inputs.measurementSelect.volume")}
                        </SelectItem>
                        <SelectItem value="pcs">
                          {t("inputs.measurementSelect.quantity")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageBase64"
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
