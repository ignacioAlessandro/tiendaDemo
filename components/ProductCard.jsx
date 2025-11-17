"use client";

import Link from "next/link";

export default function ProductCard({ producto, onAddToCart, isLogged }) {
  // precio: acepta precio_cents o precio simple
  const precio = producto.precio_cents ? (producto.precio_cents / 100).toFixed(2) : producto.precio ?? "0.00";

  return (
    <article className="border rounded-lg p-4 bg-white hover:shadow-lg transition">
      <Link href={`/productos/${producto.id}`} className="block">
        <div className="w-full h-44 flex items-center justify-center mb-3 bg-gray-50 rounded">
          <img
            src={producto.imagen_url || "/images/placeholder.png"}
            alt={producto.nombre || "producto"}
            className="max-h-40 object-contain"
          />
        </div>
      </Link>

      <div>
        <h3 className="text-lg font-semibold">
          <Link href={`/productos/${producto.id}`}>{producto.nombre}</Link>
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{producto.descripcion || ""}</p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold">${precio}</span>
            <div className="text-xs text-gray-500">Stock: {producto.stock ?? "—"}</div>
          </div>

          <div>
            <button
              onClick={() => onAddToCart && onAddToCart(producto)}
              disabled={!isLogged}
              className={`px-3 py-1 rounded text-sm font-medium shadow-sm ${
                isLogged ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-600 cursor-not-allowed"
              }`}
              title={!isLogged ? "Debes iniciar sesión para agregar al carrito" : "Agregar al carrito"}
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
