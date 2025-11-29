-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subcategoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    CONSTRAINT "Subcategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Producto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio_cents" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "imagen_url" TEXT,
    "creadoAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoriaId" TEXT,
    "subcategoriaId" TEXT,
    CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Producto_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "Subcategoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Producto" ("creadoAt", "descripcion", "id", "imagen_url", "nombre", "precio_cents", "slug", "stock") SELECT "creadoAt", "descripcion", "id", "imagen_url", "nombre", "precio_cents", "slug", "stock" FROM "Producto";
DROP TABLE "Producto";
ALTER TABLE "new_Producto" RENAME TO "Producto";
CREATE UNIQUE INDEX "Producto_slug_key" ON "Producto"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategoria_nombre_categoriaId_key" ON "Subcategoria"("nombre", "categoriaId");
