import type {
  LanguageCode,
  Prisma,
  PrismaClient,
  PrismaPromise,
  Product,
  ProductI18N,
  ProductTranslationField,
} from "@prisma/client";

import type {
  CreateProductInput,
  UpdateProductInput,
  UpdateProductsPositionInput,
} from "~/server/api/product/product.schema";

export const createProduct = async (
  input: CreateProductInput & { imageUrl?: string; userId: string },
  translations: Pick<
    ProductI18N,
    "fieldName" | "languageCode" | "translation"
  >[],
  prisma: PrismaClient
) => {
  const { position: biggestPosition } =
    (await prisma.product.findFirst({
      where: { categoryId: input.categoryId },
      select: { position: true },
      orderBy: { position: "desc" },
    })) ?? {};

  const nextPosition = biggestPosition ? biggestPosition + 1 : 0;

  return prisma.product.create({
    data: {
      userId: input.userId,
      isEnabled: input.isEnabled,
      price: input.price * 100,
      imageUrl: input.imageUrl ?? "",
      restaurantId: input.restaurantId,
      categoryId: input.categoryId,
      measurementUnit: input.measurementUnit,
      measurementValue: input.measurementValue,
      position: nextPosition,
      productI18N: {
        createMany: { data: translations },
      },
    },
  });
};

export const updateProduct = async (
  input: Omit<UpdateProductInput, "isImageDeleted" | "autoTranslateEnabled"> & {
    imageUrl?: string;
    userId: string;
  },
  translations: Pick<
    ProductI18N,
    "fieldName" | "languageCode" | "translation"
  >[],
  prisma: PrismaClient
) => {
  const updatedData: Partial<Product> = {
    price: input.price * 100,
    isEnabled: input.isEnabled,
    ...(input.measurementUnit && { measurementUnit: input.measurementUnit }),
    ...(input.measurementValue && { measurementValue: input.measurementValue }),
    ...(typeof input.imageUrl === "string" && { imageUrl: input.imageUrl }),
  };

  const transactions: PrismaPromise<unknown>[] = translations
    .filter(({ translation }) => translation)
    .map((record) =>
      prisma.productI18N.upsert({
        where: {
          productId_languageCode_fieldName: {
            languageCode: record.languageCode,
            fieldName: record.fieldName,
            productId: input.productId,
          },
        },
        update: {
          translation: record.translation,
        },
        create: {
          languageCode: record.languageCode,
          fieldName: record.fieldName,
          productId: input.productId,
          translation: record.translation,
        },
      })
    );

  const [updatedProduct] = await prisma.$transaction([
    prisma.product.update({
      where: { id: input.productId, userId: input.userId },
      data: updatedData,
    }),
    ...transactions,
  ]);

  return updatedProduct;
};

export const updateManyProductsTranslations = (
  translations: {
    productId?: string;
    languageCode: LanguageCode;
    translation: string;
    fieldName: ProductTranslationField;
  }[],
  prisma: PrismaClient
) => {
  const transactions: PrismaPromise<unknown>[] = translations
    //TODO: ADD TS PLUGIN FROM MATT POCK TO UPDATE TYPE FOR AS STRING
    .filter(({ translation }) => translation)
    .map((record) => {
      return prisma.productI18N.upsert({
        where: {
          productId_languageCode_fieldName: {
            languageCode: record.languageCode,
            fieldName: record.fieldName,
            productId: record.productId as string,
          },
        },
        update: {
          translation: record.translation,
        },
        create: {
          languageCode: record.languageCode,
          fieldName: record.fieldName,
          productId: record.productId as string,
          translation: record.translation,
        },
      });
    });

  return transactions;
};

export const updateManyProductsPositions = async (
  input: UpdateProductsPositionInput,
  userId: string,
  prisma: PrismaClient
) => {
  return prisma.$transaction(
    input.map((item) =>
      prisma.product.update({
        data: { position: item.position },
        where: { id: item.id, userId },
      })
    )
  );
};

export const deleteProduct = async (
  where: Prisma.ProductWhereUniqueInput,
  prisma: PrismaClient
) => {
  return await prisma.product.delete({
    where,
  });
};
