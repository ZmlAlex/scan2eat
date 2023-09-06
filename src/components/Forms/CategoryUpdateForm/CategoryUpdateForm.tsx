import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "~/components/ui/useToast";
import { api } from "~/utils/api";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

import { Icons } from "../../Icons";
import type { ArrayElement } from "../../Menu/CategoryProduct";

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
    updateCategory({
      restaurantId,
      categoryId: category.id,
      name: values.name,
      //TODO: UPDATE ID
      languageCode: "english",
    });
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(event) => event.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Update category</DialogTitle>
          <DialogDescription>
            Edit details about your category here. Click save when you&apos;re
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

export default CategoryUpdateForm;
