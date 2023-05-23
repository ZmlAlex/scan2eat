import type {
  Prisma,
  RestaurantTranslationFields,
  PrismaClient,
  PrismaPromise,
  Restaurant,
} from "@prisma/client";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";
import type {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../schemas/restaurant.schema";

export const findRestaurant = async (
  where: Partial<Prisma.RestaurantWhereUniqueInput>,
  prisma: PrismaClient
) => {
  const result = await prisma.restaurant.findUniqueOrThrow({
    where,
    include: {
      restaurantI18N: {
        select: {
          fieldName: true,
          translation: true,
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
            include: { categoryI18N: true },
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
    ...transformTranslation<RestaurantTranslationFields>(result.restaurantI18N),
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
            include: { categoryI18N: true },
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

  return result.map((record) => ({
    ...record,
    ...transformTranslation<RestaurantTranslationFields>(record.restaurantI18N),
  }));
};

export const createRestaurant = async (
  input: CreateRestaurantInput & { userId: string },
  prisma: PrismaClient
) => {
  const translations =
    formatFieldsToTranslationTable<RestaurantTranslationFields>(
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
      restaurantI18N: {
        createMany: {
          data: translations,
        },
      },
    },
    include: {
      restaurantI18N: {
        select: {
          fieldName: true,
          translation: true,
        },
      },
    },
  });

  return {
    ...result,
    ...transformTranslation<RestaurantTranslationFields>(result.restaurantI18N),
  };
};

export const updateRestaurant = async (
  input: UpdateRestaurantInput,
  where: Partial<Prisma.RestaurantWhereUniqueInput>,
  prisma: PrismaClient
) => {
  const updatedData: Partial<Restaurant> = {
    logoUrl: input.logoUrl,
    workingHours: input.workingHours,
    currencyCode: input.currencyCode,
  };

  const translations =
    formatFieldsToTranslationTable<RestaurantTranslationFields>(
      ["name", "description", "address"],
      input
    );

  const transactions: PrismaPromise<unknown>[] = translations
    .filter(({ translation }) => translation)
    .map((record) =>
      prisma.restaurantI18N.updateMany({
        data: {
          translation: record.translation,
        },
        where: {
          languageCode: { equals: record.languageCode },
          fieldName: record.fieldName,
          restaurantId: input.restaurantId,
        },
      })
    );

  await prisma.$transaction([
    ...transactions,
    prisma.restaurant.updateMany({
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
