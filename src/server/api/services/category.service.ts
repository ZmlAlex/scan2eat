import type {
  CategoryTranslationField,
  Prisma,
  PrismaClient,
  PrismaPromise,
} from "@prisma/client";

import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";

import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schema";

export const createCategory = async (
  input: CreateCategoryInput,
  prisma: PrismaClient
) => {
  return await prisma.category.create({
    data: {
      menuId: input.menuId,
      categoryI18N: {
        create: {
          fieldName: "name",
          translation: input.name,
          languageCode: input.languageCode,
        },
      },
    },
  });
};

export const updateCategory = async (
  input: UpdateCategoryInput,
  prisma: PrismaClient
) => {
  // const translationFields: CategoryTranslationField[] = ["name"];

  const translations = formatFieldsToTranslationTable<CategoryTranslationField>(
    ["name"],
    input
  );

  const transactions: PrismaPromise<unknown>[] = translations
    .filter(({ translation }) => translation)
    .map((record) =>
      prisma.categoryI18N.upsert({
        where: {
          categoryId_languageCode_fieldName: {
            categoryId: input.categoryId,
            languageCode: record.languageCode,
            fieldName: record.fieldName,
          },
        },
        update: {
          translation: record.translation,
        },
        create: {
          translation: record.translation,
          categoryId: input.categoryId,
          languageCode: record.languageCode,
          fieldName: record.fieldName,
        },
      })
    );

  await prisma.$transaction(transactions);
};

export const deleteCategory = async (
  where: Prisma.CategoryWhereUniqueInput,
  prisma: PrismaClient
) => {
  return await prisma.category.delete({
    where,
  });
};
