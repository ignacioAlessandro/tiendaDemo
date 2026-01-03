// app/productos/[id]/page.jsx
import Link from "next/link";
import AddToCartClient from "@/components/AddToCartClient";
import ProductsGridClient from "@/components/ProductsGridClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

async function fetchProducto(id) {
  const res = await fetch(`${API_BASE_URL}/productos/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

async function fetchRecomendados(subcategoriaId, excludeId) {
  if (!subcategoriaId) return [];

  const url = new URL(`${API_BASE_URL}/productos/recomendados`);
  url.searchParams.set("subcategoriaId", subcategoriaId);
  if (excludeId) url.searchParams.set("excludeId", excludeId);
  url.searchParams.set("limit", "3");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductoPage({ params }) {
  const { id } = params;

  const producto = await fetchProducto(id);

  if (!producto) {
    return (
      <main className="container mx-auto py-12">
        <h1 className="mb-4 text-2xl font-bold">Producto no encontrado</h1>
        <Link href="/productos" className="text-sm text-indigo-600">
          ← Volver a productos
        </Link>
      </main>
    );
  }

  const precio =
    producto.precio_cents != null
      ? (producto.precio_cents / 100).toFixed(2)
      : "0.00";

  const imagenes = (
    producto.imagenes && Array.isArray(producto.imagenes)
      ? producto.imagenes
      : [producto.imagenPrincipal, producto.imagen_url]
  ).filter(Boolean);

  const categoriaNombre = producto.categoria?.nombre || "Sin categoría";
  const subcategoriaNombre =
    producto.subcategoria?.nombre || "Sin subcategoría";

  const recomendados = await fetchRecomendados(
    producto.subcategoriaId,
    producto.id
  );

  return (
    <main className="container mx-auto py-12 px-4 space-y-12">
      {/* Migas y volver */}
      <div className="mb-4 text-sm text-gray-500">
        <Link href="/productos" className="text-indigo-600 hover:underline">
          Productos
        </Link>{" "}
        / <span className="text-gray-700">{producto.nombre}</span>
      </div>

      {/* Bloque principal: imagen + info */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_1fr]">
        {/* Columna izquierda: "carrusel" simple */}
        <div className="space-y-4">
          <div className="flex items-center justify-center rounded-xl bg-white p-6 shadow">
            <img
              src={
                imagenes[0] ||
                "/images/placeholder.png"
              }
              alt={producto.nombre}
              className="max-h-96 w-full object-contain"
            />
          </div>

          {imagenes.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {imagenes.map((src, idx) => (
                <div
                  key={idx}
                  className="flex h-20 w-20 items-center justify-center rounded-lg border bg-white shadow-sm"
                >
                  <img
                    src={src}
                    alt={`${producto.nombre} ${idx + 1}`}
                    className="max-h-16 max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha: datos del producto */}
        <div className="space-y-4 rounded-xl bg-white p-6 shadow">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {producto.nombre}
            </h1>
            <p className="text-sm text-gray-500">
              {categoriaNombre} · {subcategoriaNombre}
            </p>
          </div>

          <p className="text-3xl font-semibold text-blue-600">
            ${precio}
          </p>

          {/* Bloque de acciones */}
          <AddToCartClient producto={producto} />

          {/* Descripción extendida */}
          {producto.descripcion && (
            <div className="pt-4 border-t border-gray-100">
              <h2 className="mb-2 text-sm font-semibold text-gray-800">
                Descripción del producto
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {producto.descripcion}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recomendados */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Productos recomendados
        </h2>
        <p className="text-sm text-gray-600">
          Basado en la misma subcategoría: {subcategoriaNombre}.
        </p>

        {recomendados.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay más productos recomendados en esta subcategoría por ahora.
          </p>
        ) : (
          <ProductsGridClient productos={recomendados} />
        )}
      </section>
    </main>
  );
}
