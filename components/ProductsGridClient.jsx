// components/ProductsGridClient.jsx
"use client";

import ProductCard from "./ProductCard";

export default function ProductsGridClient({ productos = [] }) {
  if (!productos || productos.length === 0) {
    return (
      <div className="py-12 text-center text-gray-600">
        No hay productos para mostrar.
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {productos.map((p) => (
        <ProductCard key={String(p.id)} producto={p} />
      ))}
    </div>
  );
}
