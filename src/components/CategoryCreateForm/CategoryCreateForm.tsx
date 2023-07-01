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

import { Icons } from "../Icons";
import { Button } from "../ui/Button";
import { toast } from "../ui/useToast";

const formSchema = z.object({
  name: z.string().trim().min(2),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  menuId: string;
  restaurantId: string;

  onSuccessCallback?: () => void;
};

const CategoryCreateForm = ({
  menuId,
  restaurantId,
  onSuccessCallback,
}: Props) => {
  const trpcContext = api.useContext();

  const { mutate: createCategory, isLoading } =
    api.category.createCategory.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description: "Your create category request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        toast({
          title: "Category has been created.",
        });
        onSuccessCallback?.();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: FormSchema) {
    createCategory({
      menuId,
      name: values.name,
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

export default CategoryCreateForm;
