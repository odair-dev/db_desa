/*
  Warnings:

  - Added the required column `district` to the `adresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adresses" ADD COLUMN     "district" VARCHAR(255) NOT NULL;
