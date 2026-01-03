/*
  Warnings:

  - Made the column `passwordHash` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "actualizadoAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "apellido" TEXT,
ALTER COLUMN "passwordHash" SET NOT NULL;
