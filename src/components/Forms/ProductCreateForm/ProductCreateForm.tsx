import { zodResolver } from "@hookform/resolvers/zod";
import type { LanguageCode } from "@prisma/client";
import { parseCookies } from "nookies";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { imageInput } from "~/utils/formTypes/common";

import { Icons } from "../../Icons";
import ImageUploadInput from "../../ImageUploadInput";

const formSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string(),
  price: z.number().nonnegative(),
  imageBase64: imageInput,
  measurementValue: z.string().optional(),
  measurementUnit: measurementUnitS,
});

type Props = {
  isModalOpen: boolean;
  toggleModal: () => void;
  restaurantId: string;

  categoryId: string;
};

type FormSchema = z.infer<typeof formSchema>;

const ProductCreateForm = ({
  restaurantId,
  categoryId,
  isModalOpen,
  toggleModal,
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
        toggleModal();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageBase64: undefined,
    },
  });

  function onSubmit(values: FormSchema) {
    const { selectedRestaurantLang } = parseCookies();

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
          <DialogTitle>Create product</DialogTitle>
          <DialogDescription>
            Add details about your product here. Click save when you&apos;re
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

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="measurementValue"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="take from selected val" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue="g">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a default measure unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="g">Weight, g</SelectItem>
                        <SelectItem value="ml">Volume, ml</SelectItem>
                        <SelectItem value="pcs">Quantity, pcs</SelectItem>
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
              Save changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateForm;
