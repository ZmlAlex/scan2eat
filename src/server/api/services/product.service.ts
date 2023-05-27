import type {
  Prisma,
  PrismaClient,
  PrismaPromise,
  ProductTranslationField,
  Product,
} from "@prisma/client";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";

export const createProduct = async (
  input: CreateProductInput,
  prisma: PrismaClient
) => {
  const { price, isEnabled, ...restInput } = input;

  const translations = formatFieldsToTranslationTable<ProductTranslationField>(
    ["name", "description"],
    restInput
  );

  return await prisma.product.create({
    data: {
      price,
      isEnabled,

      imageUrl: input.imageUrl,
      menuId: input.menuId,
      categoryId: input.categoryId,
      measurementUnit: input.measurmentUnit ?? "",
      measurementValue: input.measurmentValue ?? "",
      productI18N: {
        createMany: { data: translations },
      },
    },
  });
};

export const updateProduct = async (
  input: UpdateProductInput,
  prisma: PrismaClient
) => {
  const { price, isEnabled, ...restInput } = input;

  const updatedData: Partial<Product> = {
    price,
    isEnabled,
    measurementUnit: input.measurmentUnit,
    measurementValue: input.measurmentValue,
    imageUrl: input.imageUrl,
  };

  const translations = formatFieldsToTranslationTable<ProductTranslationField>(
    ["name", "description"],
    restInput
  );

  const transactions: PrismaPromise<unknown>[] = translations
    .filter(({ translation }) => translation)
    .map((record) =>
      prisma.productI18N.updateMany({
        data: {
          translation: record.translation,
        },
        where: {
          languageCode: { equals: record.languageCode },
          fieldName: record.fieldName,
          productId: input.productId,
        },
      })
    );

  const [updatedProduct] = await prisma.$transaction([
    prisma.product.update({
      where: { id: input.productId },
      data: updatedData,
    }),
    ...transactions,
  ]);

  return updatedProduct;
};

export const deleteProduct = async (
  where: Prisma.ProductWhereUniqueInput,
  prisma: PrismaClient
) => {
  return await prisma.category.delete({
    where,
  });
};
