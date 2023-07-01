import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/Textarea";
import { api } from "~/utils/api";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import { Icons } from "../Icons";
import type { ArrayElement } from "../Menu/CategoryProduct";
import { Button } from "../ui/Button";
import { toast } from "../ui/useToast";

const formSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string(),
  price: z.number().nonnegative(),
});

type Props = {
  onSuccessCallback?: () => void;
  restaurantId: string;
  //TODO: MOVE TO THE GLOBAL
  product: ArrayElement<RestaurantWithDetails["menu"]["product"]>;
};

type FormSchema = z.infer<typeof formSchema>;

const ProductUpdateForm = ({
  restaurantId,
  product,
  onSuccessCallback,
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

        onSuccessCallback?.();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.productI18N.name,
      description: product.productI18N.description,
      price: product.price,
    },
  });

  function onSubmit(values: FormSchema) {
    updateProduct({
      productId: product.id,
      name: values.name,
      description: values.description,
      price: values.price,
      languageCode: "english",
      //TODO: REMOVE THIS FIELD
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
      isEnabled: true,
    });
  }

  return (
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

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </form>
    </Form>
  );
};

export default ProductUpdateForm;
