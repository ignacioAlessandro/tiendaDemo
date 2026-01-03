// components/ProductCard.jsx
"use client";

import Link from "next/link";

export default function ProductCard({ producto }) {
  if (!producto) return null;

  const imagen =
    producto.imagenPrincipal ||
    producto.imagen_url ||
    "/images/placeholder.png";

  const precio =
    producto.precio_cents != null
      ? (producto.precio_cents / 100).toFixed(2)
      : producto.precio != null
      ? Number(producto.precio).toFixed(2)
      : "0.00";

  const descripcionCorta = (producto.descripcion || "").slice(0, 80);

  return (
    <article className="flex flex-col rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      <Link href={`/productos/${producto.id}`} className="block">
        <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-50 mb-3">
          <img
            src={imagen}
            alt={producto.nombre || "Producto"}
            className="max-h-36 w-full object-contain"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col">
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
          <Link href={`/productos/${producto.id}`}>{producto.nombre}</Link>
        </h3>

        {descripcionCorta && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {descripcionCorta}
            {producto.descripcion &&
              producto.descripcion.length > 80 &&
              "..."}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-blue-600">${precio}</span>

          <Link
            href={`/productos/${producto.id}`}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Ver más
          </Link>
        </div>
      </div>
    </article>
  );
}
