import type {
  CategoryTranslationField,
  Prisma,
  PrismaClient,
  PrismaPromise,
  ProductTranslationField,
  Restaurant,
  RestaurantTranslationField,
} from "@prisma/client";

import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";

import type {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../schemas/restaurant.schema";

export const findRestaurant = async (
  where: Partial<Prisma.RestaurantWhereInput>,
  prisma: PrismaClient
) => {
  const result = await prisma.restaurant.findFirstOrThrow({
    where,
    select: {
      id: true,
      workingHours: true,
      logoUrl: true,
      isPublished: true,
      restaurantLanguage: {
        select: { languageCode: true },
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
      menu: {
        include: {
          category: {
            include: {
              categoryI18N: true,
            },
          },
          product: {
            include: {
              productI18N: true,
            },
          },
        },
      },
    },
  });

  return {
    ...result,
    restaurantI18N: transformTranslation<RestaurantTranslationField>(
      result.restaurantI18N
    ),
    //temporary return first menu
    menu: {
      ...result.menu[0],
      category: result.menu[0]?.category.map((record) => ({
        ...record,
        categoryI18N: transformTranslation<CategoryTranslationField>(
          record.categoryI18N
        ),
      })),
      product: result.menu[0]?.product.map((record) => ({
        ...record,
        productI18N: transformTranslation<ProductTranslationField>(
          record.productI18N
        ),
      })),
    },
  };
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
        select: { languageCode: true },
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
  input: CreateRestaurantInput & { userId: string },
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
      logoUrl: input.logoUrl,
      currencyCode: input.currencyCode,
      menu: {
        create: {},
      },
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
  input: UpdateRestaurantInput,
  where: Partial<Prisma.RestaurantWhereUniqueInput>,
  prisma: PrismaClient
) => {
  const updatedData: Partial<Restaurant> = {
    workingHours: input.workingHours,
    currencyCode: input.currencyCode,
    ...(input.logoUrl && { logoUrl: input.logoUrl }),
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
