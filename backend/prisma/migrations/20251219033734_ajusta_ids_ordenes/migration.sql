/*
  Warnings:

  - You are about to drop the column `creadoAt` on the `Orden` table. All the data in the column will be lost.
  - You are about to drop the column `emailInvitado` on the `Orden` table. All the data in the column will be lost.
  - You are about to drop the column `mp_payment_id` on the `Orden` table. All the data in the column will be lost.
  - You are about to drop the column `mp_preference_id` on the `Orden` table. All the data in the column will be lost.
  - You are about to drop the column `total_cents` on the `Orden` table. All the data in the column will be lost.
  - The `estado` column on the `Orden` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `precio_unit_cents` on the `OrdenItem` table. All the data in the column will be lost.
  - Added the required column `actualizadoEn` to the `Orden` table without a default value. This is not possible if the table is not empty.
  - Made the column `usuarioId` on table `Orden` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `precioUnitario` to the `OrdenItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrdenEstado" AS ENUM ('CART', 'PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Orden" DROP CONSTRAINT "Orden_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Orden" DROP COLUMN "creadoAt",
DROP COLUMN "emailInvitado",
DROP COLUMN "mp_payment_id",
DROP COLUMN "mp_preference_id",
DROP COLUMN "total_cents",
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "usuarioId" SET NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" "OrdenEstado" NOT NULL DEFAULT 'CART';

-- AlterTable
ALTER TABLE "OrdenItem" DROP COLUMN "precio_unit_cents",
ADD COLUMN     "precioUnitario" INTEGER NOT NULL,
ALTER COLUMN "cantidad" SET DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
