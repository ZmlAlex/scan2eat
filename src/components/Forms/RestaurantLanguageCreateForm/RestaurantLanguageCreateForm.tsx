import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { languageCodeS } from "~/server/api/schemas/common.schema";
import { api } from "~/utils/api";

import { Icons } from "../../Icons";
import { Button } from "../../ui/Button";
import { toast } from "../../ui/useToast";

const formSchema = z.object({
  languageCode: languageCodeS,
});

type Props = {
  restaurantId: string;
  toggleModal: () => void;
  isModalOpen: boolean;
};
const RestaurantLanguageCreateForm = ({
  restaurantId,
  isModalOpen,
  toggleModal,
}: Props) => {
  const trpcContext = api.useContext();

  const { mutate: createRestaurantLanguage, isLoading } =
    api.restaurant.createRestaurantLanguage.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description:
            "Your create restaurant language request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        toast({
          title: "Restaurant's language has been added.",
        });
        toggleModal();
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createRestaurantLanguage({
      languageCode: values.languageCode,
      restaurantId,
    });
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new language</DialogTitle>
          <DialogDescription>
            Add details about your restaurant&apos;s language here. Click save
            when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="languageCode"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a new language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* TODO: ADD HERE FILTERING  */}
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="russian">Russian</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Additional language for your restaurant. After creating
                    restaurant&apos;s details and all existing products,
                    categories will be translate automaticaly. You can edit
                    positions after
                  </FormDescription>
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

export default RestaurantLanguageCreateForm;
