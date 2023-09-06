import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "~/components/ui/useToast";
import {
  currencyCodeS,
  languageCodeS,
} from "~/server/api/schemas/common.schema";
import { api } from "~/utils/api";
import { imageInput } from "~/utils/formTypes/common";

import { Icons } from "../../Icons";

const formSchema = z.object({
  languageCode: languageCodeS,
  name: z.string().trim().min(2).max(30),
  address: z.string().trim().min(2).max(50),
  workingHours: z.string(),
  description: z.string().trim().max(150).optional(),
  currencyCode: currencyCodeS,
  phone: z.string().optional(),
  link: z.string().optional(),
  logoImageBase64: imageInput,
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  isModalOpen: boolean;
  toggleModal: () => void;
};

const RestaurantCreateForm = ({ isModalOpen, toggleModal }: Props) => {
  const trpcContext = api.useContext();

  const { mutate: createRestaurant, isLoading } =
    api.restaurant.createRestaurant.useMutation({
      onError: () =>
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
          title: "Restaurant has been created.",
        });
        toggleModal();
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      workingHours: "",
      phone: "",
      logoImageBase64: undefined,
    },
  });

  function onSubmit(values: FormSchema) {
    createRestaurant({
      address: values.address,
      name: values.name,
      currencyCode: values.currencyCode,
      languageCode: values.languageCode,
      logoImageBase64: values.logoImageBase64,
      description: values.description,
      // TODO: ADD PHONE
      //TODO: REMOVE THIS FIELD
      workingHours: "from 9:00 to 21:00",
    });
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create restaurant</DialogTitle>
          <DialogDescription>
            Add details about your restaurant here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                    Default language for your restaurant. After creating you can
                    add aditional languages
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
              name="workingHours"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Name</FormLabel> */}
                  <FormControl>
                    <Input placeholder="Working hours" {...field} />
                  </FormControl>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <FormField
              control={form.control}
              name="logoImageBase64"
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

export default RestaurantCreateForm;
