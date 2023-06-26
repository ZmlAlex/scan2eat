import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
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
import {
  currencyCodeS,
  languageCodeS,
} from "~/server/api/schemas/common.schema";
import { api } from "~/utils/api";

import { Icons } from "../Icons";
import { Button } from "../ui/Button";
import { toast } from "../ui/useToast";

const formSchema = z.object({
  languageCode: languageCodeS,
  name: z.string().trim().min(2),
  address: z.string().trim().min(2),
  description: z.string(),
  currencyCode: currencyCodeS,
  phone: z.string().optional(),
  link: z.string().optional(),
});

type Props = {
  onSuccessCallback?: () => void;
};
const RestaurantCreateForm = ({ onSuccessCallback }: Props) => {
  const trpcContext = api.useContext();

  const { mutate: createRestaurant, isLoading } =
    api.restaurant.createRestaurant.useMutation({
      onError: (err) =>
        toast({
          title: "Something went wrong.",
          description:
            "Your create restaurant request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (newRestaurant) => {
        trpcContext.restaurant.getAllRestaurants.setData(
          undefined,
          (prevRestaurants = []) => [...prevRestaurants, newRestaurant]
        );

        toast({
          title: "Restaurant has been updated.",
        });
        onSuccessCallback?.();
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createRestaurant({
      address: values.address,
      name: values.name,
      currencyCode: values.currencyCode,
      languageCode: values.languageCode,
      //TODO: REMOVE THIS FIELD
      workingHours: "24hrs",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="create-restaurant-form"
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="languageCode"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Language</FormLabel> */}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a default language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="russian">Russian</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Default language for your restaurant. After creating you can add
                aditional languages
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
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
                  placeholder="Tell us a little bit about your restaurant"
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Phone" {...field} />
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
        <FormField
          control={form.control}
          name="currencyCode"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Currency</FormLabel> */}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="RUB">RUB</SelectItem>
                </SelectContent>
              </Select>

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

export default RestaurantCreateForm;
