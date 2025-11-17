// components/ProductsGridClient.jsx
"use client";
import ProductCard from "./ProductCard";

export default function ProductsGridClient({ initialProducts = [] }) {
  if (!initialProducts || initialProducts.length === 0) {
    return <div className="text-center py-12 text-gray-600">No hay productos para mostrar.</div>;
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {initialProducts.map(p => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  );
}
