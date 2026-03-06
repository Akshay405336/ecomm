/*
  Warnings:

  - You are about to alter the column `name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `slug` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(160)`.
  - You are about to alter the column `shortDesc` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `originalPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `discountPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `metaTitle` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(160)`.
  - You are about to alter the column `metaDescription` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(160),
ALTER COLUMN "shortDesc" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "originalPrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "discountPrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "metaTitle" SET DATA TYPE VARCHAR(160),
ALTER COLUMN "metaDescription" SET DATA TYPE VARCHAR(300);

-- CreateIndex
CREATE INDEX "Product_isFeatured_idx" ON "Product"("isFeatured");

-- CreateIndex
CREATE INDEX "Product_isTrending_idx" ON "Product"("isTrending");
