import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import { parseCookies } from "nookies";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/Button";
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

import { Icons } from "../Icons";
import ImageUploadInput from "../ImageUploadInput";

//TODO MOVE IT TO REUSABLE PLACE
// const MAX_FILE_SIZE = 500000;
// const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

const formSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string(),
  price: z.number().nonnegative(),
  // TODO:VALIDATION SIZE
  imageBase64: z.string(),
  // image: z
  //   .any()
  //   .refine((file: Blob) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`) // this should be greater than or equals (>=) not less that or equals (<=)
  //   .refine(
  //     (file: Blob) => ACCEPTED_IMAGE_TYPES.includes(file.type),
  //     ".jpg, .jpeg, .png and .webp files are accepted."
  //   ),
});

type Props = {
  onSuccessCallback?: () => void;
  restaurantId: string;
  menuId: string;
  categoryId: string;
};

type FormSchema = z.infer<typeof formSchema>;

const ProductCreateForm = ({
  restaurantId,
  menuId,
  categoryId,
  onSuccessCallback,
}: Props) => {
  const trpcContext = api.useContext();

  const { mutate: createProduct, isLoading } =
    api.product.createProduct.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description: "Your create product request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        toast({
          title: "Product has been created.",
        });
        onSuccessCallback?.();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageBase64: "",
    },
  });

  function onSubmit(values: FormSchema) {
    const { selectedRestaurantLang } = parseCookies();
    console.log("Values", values);

    if (selectedRestaurantLang) {
      createProduct({
        name: values.name,
        description: values.description,
        price: values.price,
        languageCode: selectedRestaurantLang as LanguageCode,
        imageBase64: values.imageBase64,
        menuId,
        categoryId,
      });
    }
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
        {/* TODO: MOVE TO THE SEPARATE COMPONENT */}

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
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </form>
    </Form>
  );
};

export default ProductCreateForm;
