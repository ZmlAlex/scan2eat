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
import { api } from "~/utils/api";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import { Icons } from "../Icons";
import type { ArrayElement } from "../Menu/CategoryProduct";
import { Button } from "../ui/Button";
import { toast } from "../ui/useToast";

const formSchema = z.object({
  name: z.string().trim().min(2),
});

type Props = {
  onSuccessCallback?: () => void;
  restaurantId: string;
  //TODO: MOVE TO THE GLOBAL
  category: ArrayElement<RestaurantWithDetails["menu"]["category"]>;
};

type FormSchema = z.infer<typeof formSchema>;

const CategoryUpdateForm = ({
  restaurantId,
  category,
  onSuccessCallback,
}: Props) => {
  const trpcContext = api.useContext();

  const { mutate: updateCategory, isLoading } =
    api.category.updateCategory.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description: "Your update category request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurants) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurants
        );

        toast({
          title: "Category has been updated.",
        });

        onSuccessCallback?.();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.categoryI18N.name,
    },
  });

  function onSubmit(values: FormSchema) {
    updateCategory({
      categoryId: category.id,
      name: values.name,
      //TODO: UPDATE ID
      languageCode: "english",
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

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </form>
    </Form>
  );
};

export default CategoryUpdateForm;
