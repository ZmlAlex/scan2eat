import type {
  CategoryTranslationField,
  Prisma,
  PrismaClient,
  PrismaPromise,
  ProductTranslationField,
  Restaurant,
  RestaurantTranslationField,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";

import type {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "~/server/api/schemas/restaurant.schema";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";

export const findRestaurantById = async (
  restaurantId: string,
  prisma: PrismaClient
) => {
  try {
    console.time("Restaurant");
    const restaurantP = prisma.restaurant.findFirstOrThrow({
      where: { id: restaurantId },
      select: {
        id: true,
        workingHours: true,
        logoUrl: true,
        isPublished: true,
        currencyCode: true,
      },
    });
    const restaurantLanguagesP = prisma.restaurantLanguage.findMany({
      where: { restaurantId },
    });
    const restaurantI18NP = prisma.restaurantI18N.findMany({
      where: { restaurantId },
    });
    const categoriesP = prisma.category.findMany({
      where: { restaurantId },
      include: {
        categoryI18N: true,
      },
    });
    const productsP = prisma.product.findMany({
      where: { restaurantId },
      include: {
        productI18N: true,
      },
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

    console.timeEnd("Restaurant");

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
      message: "Restaurant not found",
      cause: e,
    });
  }
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

export const updateRestaurant = async (
  input: Omit<UpdateRestaurantInput, "isImageDeleted"> & { logoUrl?: string },
  where: Prisma.RestaurantWhereUniqueInput,
  prisma: PrismaClient
) => {
  const updatedData: Partial<Restaurant> = {
    workingHours: input.workingHours,
    currencyCode: input.currencyCode,
    ...(typeof input.logoUrl === "string" && { logoUrl: input.logoUrl }),
  };

  const translations =
    formatFieldsToTranslationTable<RestaurantTranslationField>(
      ["name", "description", "address"],
      input
    );

  const transactions: PrismaPromise<unknown>[] = translations
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
