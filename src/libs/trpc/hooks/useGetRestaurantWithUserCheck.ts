import type { LanguageCode } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { parseCookies, setCookie } from "nookies";

import { toast } from "~/components/ui/useToast";
import { errorMapper } from "~/helpers/errorMapper";
import { formatTranslationToOneLanguageWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { clientApi } from "~/libs/trpc/client";
import { type findRestaurantById } from "~/server/api/services/restaurant.service";

const INITIAL_DATA: Awaited<ReturnType<typeof findRestaurantById>> = {
  id: "",
  userId: "",
  currencyCode: "USD",
  workingHours: "",
  phone: "",
  isPublished: false,
  logoUrl: "",
  restaurantI18N: {
    english: { address: "", description: "", name: "" },
    russian: { address: "", description: "", name: "" },
  },
  restaurantLanguage: [],
  category: [],
  product: [],
};

export const useGetRestaurantWithUserCheck = (
  restaurantIdQueryParam?: string
) => {
  const router = useRouter();
  const params = useParams();
  const restaurantId =
    restaurantIdQueryParam ?? (params.restaurantId as string);
  const tError = useTranslations("ResponseErrorMessage");

  return clientApi.restaurant.getRestaurantWithUserCheck.useQuery(
    {
      restaurantId,
    },
    {
      retry: false,
      enabled: Boolean(restaurantId),
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });

        if (error?.data?.code === "NOT_FOUND") {
          router.push("/dashboard");
        }
      },
      select: (restaurant) => {
        const defaultLanguage = restaurant.restaurantLanguage[0]?.languageCode;
        const cookies = parseCookies();
        const selectedRestaurantLang =
          cookies[`selectedRestaurantLang${restaurantId}`];

        if (!selectedRestaurantLang && defaultLanguage) {
          setCookie(
            null,
            `selectedRestaurantLang${restaurantId}`,
            defaultLanguage,
            {
              maxAge: 30 * 24 * 60 * 60,
              path: "/",
            }
          );
        }
        return formatTranslationToOneLanguageWithDetails(
          restaurant,
          // TODO: FIX WITH DEFAULT VALUE
          (selectedRestaurantLang || defaultLanguage) as LanguageCode
        );
      },
      // Needs to prevent "data = undefined" value when hooks is being used in components without status check
      initialData: INITIAL_DATA,
      initialDataUpdatedAt: 0,
    }
  );
};
