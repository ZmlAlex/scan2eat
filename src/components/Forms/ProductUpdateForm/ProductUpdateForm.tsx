import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import { useTranslations } from "next-intl";
import { parseCookies } from "nookies";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import ImageUploadInput from "~/components/ImageUploadInput";
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
import { measurementUnitS } from "~/server/api/schemas/common.schema";
import { api } from "~/utils/api";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";
import { imageInput } from "~/utils/formTypes/common";

import { Icons } from "../../Icons";
import type { ArrayElement } from "../../Menu/CategoryProduct";

const formSchema = z.object({
  name: z.string().trim().min(2).max(50),
  description: z.string().trim().max(150),
  price: z.number().nonnegative(),
  imageBase64: imageInput,
  isImageDeleted: z.boolean(),
  measurementValue: z.string(),
  // TODO: FIX OPTIONAL VALUE
  measurementUnit: measurementUnitS.optional(),
});

type Props = {
  isModalOpen: boolean;
  toggleModal: () => void;
  restaurantId: string;
  //TODO: MOVE TO THE GLOBAL
  product: ArrayElement<RestaurantWithDetails["product"]>;
};

type FormSchema = z.infer<typeof formSchema>;

const ProductUpdateForm = ({
  restaurantId,
  product,
  isModalOpen,
  toggleModal,
}: Props) => {
  const trpcContext = api.useContext();
  const t = useTranslations("Form.productUpdate");

  const { mutate: updateProduct, isLoading } =
    api.product.updateProduct.useMutation({
      onError: () =>
        toast({
          title: t("updateProductMutation.error.title"),
          description: t("updateProductMutation.error.description"),
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurants) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurants
        );

        toast({
          title: t("updateProductMutation.success.title"),
        });

        toggleModal();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.productI18N.name,
      description: product.productI18N.description,
      measurementUnit: product.measurementUnit ?? undefined,
      measurementValue: product.measurementValue ?? "",
      price: product.price / 100,
      isImageDeleted: false,
    },
  });

  function onSubmit(values: FormSchema) {
    const { selectedRestaurantLang } = parseCookies();

    updateProduct({
      productId: product.id,
      name: values.name,
      description: values.description,
      price: values.price,
      languageCode: selectedRestaurantLang as LanguageCode,
      isEnabled: true,
      measurementUnit: values.measurementUnit,
      measurementValue: values.measurementValue,
      imageBase64: values.imageBase64,
      isImageDeleted: values.isImageDeleted,
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Name</FormLabel> */}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder={t("inputs.description")}
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

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="measurementValue"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={product.measurementUnit ?? "g"}
                    >
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
                    <ImageUploadInput
                      {...field}
                      preselectedImageUrl={product.imageUrl}
                      onImageDelete={() =>
                        form.setValue("isImageDeleted", true)
                      }
                    />
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

export default ProductUpdateForm;
