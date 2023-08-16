/*
  Warnings:

  - You are about to drop the column `menuId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `Product` table. All the data in the column will be lost.
  - The `measurementUnit` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `restaurantId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductMeasurementUnit" AS ENUM ('g', 'ml', 'pcs');

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_menuId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_menuId_fkey";

-- DropIndex
DROP INDEX "Category_menuId_idx";

-- DropIndex
DROP INDEX "Product_menuId_categoryId_idx";

-- DropIndex
DROP INDEX "Restaurant_userId_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "menuId",
ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "menuId",
ADD COLUMN     "restaurantId" TEXT NOT NULL,
DROP COLUMN "measurementUnit",
ADD COLUMN     "measurementUnit" "ProductMeasurementUnit",
ALTER COLUMN "measurementValue" DROP NOT NULL;

-- DropTable
DROP TABLE "Menu";

-- CreateIndex
CREATE INDEX "Category_restaurantId_idx" ON "Category"("restaurantId");

-- CreateIndex
CREATE INDEX "Product_restaurantId_categoryId_idx" ON "Product"("restaurantId", "categoryId");

-- CreateIndex
CREATE INDEX "Restaurant_userId_currencyCode_idx" ON "Restaurant"("userId", "currencyCode");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
