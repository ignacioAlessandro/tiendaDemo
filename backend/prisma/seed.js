import prisma from "../src/config/prisma.js";

async function main() {
  console.log("🚀 Iniciando seed de base de datos...");

  // 1️⃣ Categorías (idempotentes con upsert)
  const categoriaElectronica = await prisma.categoria.upsert({
    where: { nombre: "Electronica" },  // nombre es @unique
    update: {},
    create: {
      nombre: "Electronica",
    },
  });

  const categoriaInformatica = await prisma.categoria.upsert({
    where: { nombre: "Informatica" },
    update: {},
    create: {
      nombre: "Informatica",
    },
  });

  // 2️⃣ Subcategorías (usando el índice único compuesto [nombre, categoriaId])
  const subAuriculares = await prisma.subcategoria.upsert({
    where: {
      nombre_categoriaId: {
        nombre: "Auriculares",
        categoriaId: categoriaElectronica.id,
      },
    },
    update: {
      // por si cambiás la categoría de esta subcategoría en el futuro
      categoriaId: categoriaElectronica.id,
    },
    create: {
      nombre: "Auriculares",
      categoriaId: categoriaElectronica.id,
    },
  });

  const subPerifericos = await prisma.subcategoria.upsert({
    where: {
      nombre_categoriaId: {
        nombre: "Perifericos",
        categoriaId: categoriaInformatica.id,
      },
    },
    update: {
      categoriaId: categoriaInformatica.id,
    },
    create: {
      nombre: "Perifericos",
      categoriaId: categoriaInformatica.id,
    },
  });

  // 3️⃣ Productos (upsert por slug, que es @unique)
  const productosData = [
    {
      nombre: "Auricular Bluetooth",
      slug: "auricular-bluetooth",
      descripcion: "Auricular inalámbrico de alta calidad",
      precio_cents: 1500000, // $15.000
      stock: 10,
      imagen_url: "https://via.placeholder.com/300",
      categoriaId: categoriaElectronica.id,
      subcategoriaId: subAuriculares.id,
    },
    {
      nombre: "Mouse Gamer",
      slug: "mouse-gamer",
      descripcion: "RGB 7200 DPI",
      precio_cents: 1200000, // $12.000
      stock: 15,
      imagen_url: "https://via.placeholder.com/300",
      categoriaId: categoriaInformatica.id,
      subcategoriaId: subPerifericos.id,
    },
    // 👉 acá podés seguir agregando productos usando siempre slug único
  ];

  for (const data of productosData) {
    await prisma.producto.upsert({
      where: { slug: data.slug },
      update: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio_cents: data.precio_cents,
        stock: data.stock,
        imagen_url: data.imagen_url,
        categoriaId: data.categoriaId,
        subcategoriaId: data.subcategoriaId,
      },
      create: data,
    });
  }

  console.log("✅ Seed ejecutado correctamente");
}

main()
  .catch((e) => {
    console.error("❌ Error al ejecutar seed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
