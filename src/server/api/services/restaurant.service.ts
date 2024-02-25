import type {
  CategoryTranslationField,
  Prisma,
  PrismaClient,
  PrismaPromise,
  ProductTranslationField,
  Restaurant,
  RestaurantI18N,
  RestaurantTranslationField,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";

import type {
  CreateRestaurantInput,
  CreateRestaurantLanguageInput,
  UpdateRestaurantInput,
} from "~/server/api/schemas/restaurant.schema";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";

export const findRestaurant = async (
  { restaurantId, userId }: { restaurantId: string; userId?: string },
  prisma: PrismaClient
) => {
  try {
    const whereClause = userId
      ? { id: restaurantId, userId }
      : { id: restaurantId };

    const restaurantP = prisma.restaurant.findFirstOrThrow({
      where: whereClause,
      select: {
        userId: true,
        id: true,
        workingHours: true,
        logoUrl: true,
        isPublished: true,
        currencyCode: true,
        phone: true,
      },
    });
    const restaurantLanguagesP = prisma.restaurantLanguage.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "asc" },
    });
    const restaurantI18NP = prisma.restaurantI18N.findMany({
      where: { restaurantId },
    });
    const categoriesP = prisma.category.findMany({
      where: { restaurantId },
      include: {
        categoryI18N: true,
      },
      orderBy: { position: "asc" },
    });
    const productsP = prisma.product.findMany({
      where: { restaurantId },
      include: {
        productI18N: true,
      },
      orderBy: { position: "asc" },
    });

    const [
      restaurant,
      restaurantI18N,
      restaurantLanguages,
      categories,
      products,
    ] = await Promise.all([
      restaurantP,
      restaurantI18NP,
      restaurantLanguagesP,
      categoriesP,
      productsP,
    ]);

    return {
      ...restaurant,
      restaurantLanguage: restaurantLanguages,
      restaurantI18N:
        transformTranslation<RestaurantTranslationField>(restaurantI18N),
      category: categories.map((record) => ({
        ...record,
        categoryI18N: transformTranslation<CategoryTranslationField>(
          record.categoryI18N
        ),
      })),
      product: products.map((record) => ({
        ...record,
        productI18N: transformTranslation<ProductTranslationField>(
          record.productI18N
        ),
      })),
    };
  } catch (e) {
    // TODO: THINK ABOUT OTHER ERROR CODES
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "NotFound",
      cause: e,
    });
  }
};

// use it for a public route (ex. when we want to return restaurant details)
export const findRestaurantById = async (
  restaurantId: string,
  prisma: PrismaClient
) => {
  return findRestaurant({ restaurantId }, prisma);
};

// use it for private routes (ex. when we want to update restaurant details)
export const findRestaurantByIdAndUserId = async (
  { restaurantId, userId }: { restaurantId: string; userId: string },
  prisma: PrismaClient
) => {
  return findRestaurant({ restaurantId, userId }, prisma);
};

export const findAllRestaurants = async (
  where: Partial<Prisma.RestaurantWhereInput>,
  prisma: PrismaClient
) => {
  const result = await prisma.restaurant.findMany({
    where,
    include: {
      restaurantI18N: {
        select: {
          fieldName: true,
          translation: true,
          languageCode: true,
        },
      },
      restaurantLanguage: {
        select: { languageCode: true, isEnabled: true },
      },
      currency: {
        select: {
          code: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return result.map((record) => ({
    ...record,
    restaurantI18N: transformTranslation<RestaurantTranslationField>(
      record.restaurantI18N
    ),
  }));
};

export const createRestaurant = async (
  input: CreateRestaurantInput & { userId: string; logoUrl?: string },
  prisma: PrismaClient
) => {
  const translations =
    formatFieldsToTranslationTable<RestaurantTranslationField>(
      ["name", "description", "address"],
      input
    );
  const result = await prisma.restaurant.create({
    data: {
      userId: input.userId,
      workingHours: input.workingHours,
      logoUrl: input.logoUrl ?? "",
      currencyCode: input.currencyCode,
      phone: input.phone,
      restaurantLanguage: {
        create: {
          languageCode: input.languageCode,
        },
      },
      restaurantI18N: {
        createMany: {
          data: translations,
        },
      },
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      currencyCode: true,
      workingHours: true,
      logoUrl: true,
      isPublished: true,
      phone: true,
      restaurantLanguage: {
        select: {
          languageCode: true,
          isEnabled: true,
        },
      },
      restaurantI18N: {
        select: {
          fieldName: true,
          translation: true,
          languageCode: true,
        },
      },
      currency: {
        select: {
          code: true,
          title: true,
        },
      },
    },
  });

  return {
    ...result,
    restaurantI18N: transformTranslation<RestaurantTranslationField>(
      result.restaurantI18N
    ),
  };
};

export const createRestaurantLanguage = (
  input: CreateRestaurantLanguageInput & { userId: string },
  translations: Pick<
    RestaurantI18N,
    "translation" | "fieldName" | "languageCode"
  >[],
  prisma: PrismaClient
) => {
  return prisma.restaurant.update({
    where: {
      id: input.restaurantId,
      userId: input.userId,
    },
    data: {
      restaurantI18N: { createMany: { data: translations } },
      restaurantLanguage: {
        create: { languageCode: input.languageCode },
      },
    },
  });
};

export const updateRestaurant = async (
  input: Omit<
    UpdateRestaurantInput,
    "isImageDeleted" | "autoTranslateEnabled"
  > & {
    logoUrl?: string;
  },
  additionalTranslations: Pick<
    RestaurantI18N,
    "fieldName" | "languageCode" | "translation"
  >[],
  where: Prisma.RestaurantWhereUniqueInput,
  prisma: PrismaClient
) => {
  const updatedData: Partial<Restaurant> = {
    workingHours: input.workingHours,
    currencyCode: input.currencyCode,
    phone: input.phone,
    ...(typeof input.logoUrl === "string" && { logoUrl: input.logoUrl }),
  };

  const translations =
    formatFieldsToTranslationTable<RestaurantTranslationField>(
      ["name", "description", "address"],
      input
    );

  const transactions: PrismaPromise<unknown>[] = [
    ...translations,
    ...additionalTranslations,
  ]
    .filter(({ translation }) => translation)
    .map((record) =>
      prisma.restaurantI18N.upsert({
        where: {
          restaurantId_languageCode_fieldName: {
            languageCode: record.languageCode,
            fieldName: record.fieldName,
            restaurantId: input.restaurantId,
          },
        },
        update: {
          translation: record.translation,
        },
        create: {
          restaurantId: input.restaurantId,
          languageCode: record.languageCode,
          fieldName: record.fieldName,
          translation: record.translation,
        },
      })
    );

  await prisma.$transaction([
    ...transactions,
    prisma.restaurant.update({
      where,
      data: updatedData,
    }),
  ]);
};

export const deleteRestaurant = async (
  where: Prisma.RestaurantWhereUniqueInput,
  prisma: PrismaClient
) => {
  await prisma.restaurant.delete({
    where,
  });
};
