import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
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
import { Textarea } from "~/components/ui/Textarea";
import { toast } from "~/components/ui/useToast";
import { api } from "~/utils/api";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";
import { imageInput } from "~/utils/formTypes/common";

import { Icons } from "../../Icons";
import type { ArrayElement } from "../../Menu/CategoryProduct";

const formSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string(),
  price: z.number().nonnegative(),
  imageBase64: imageInput,
  isImageDeleted: z.boolean(),
});

type Props = {
  isModalOpen: boolean;
  toggleModal: () => void;
  restaurantId: string;
  //TODO: MOVE TO THE GLOBAL
  product: ArrayElement<RestaurantWithDetails["menu"]["product"]>;
};

type FormSchema = z.infer<typeof formSchema>;

const ProductUpdateForm = ({
  restaurantId,
  product,
  isModalOpen,
  toggleModal,
}: Props) => {
  const trpcContext = api.useContext();

  const { mutate: updateProduct, isLoading } =
    api.product.updateProduct.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description: "Your update product request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurants) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurants
        );

        toast({
          title: "Product has been updated.",
        });

        toggleModal();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.productI18N.name,
      description: product.productI18N.description,
      price: product.price,
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
      imageBase64: values.imageBase64,
      isImageDeleted: values.isImageDeleted,
    });
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update product</DialogTitle>
          <DialogDescription>
            Edit details about your product here. Click save when you&apos;re
            done.
          </DialogDescription>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about your product"
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
                      placeholder="Price"
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
              Save changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductUpdateForm;
