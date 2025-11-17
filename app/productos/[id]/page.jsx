// app/productos/[id]/page.jsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import AddToCartClient from "@/components/AddToCartClient";

export default async function ProductoPage({ params }) {
  const id = Number(params.id);
  const producto = await prisma.producto.findUnique({ where: { id } });

  if (!producto) {
    return <main className="container mx-auto py-12">Producto no encontrado.</main>;
  }

  const precio = producto.precio_cents ? (producto.precio_cents / 100).toFixed(2) : producto.precio;

  return (
    <main className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <img src={producto.imagen || "/images/placeholder.png"} alt={producto.nombre || "producto"} className="w-full h-96 object-contain" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>
          <p className="text-gray-600 mt-2">{producto.descripcion}</p>

          <div className="mt-6">
            <h4 className="font-semibold">Especificaciones</h4>
            <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
              <li>Stock: {producto.stock ?? "—"}</li>
              <li>Categoría: {producto.categoria ?? "—"}</li>
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-2xl font-bold">${precio}</span>
            <AddToCartClient producto={producto} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/productos" className="text-sm text-indigo-600">← Volver a productos</Link>
      </div>
    </main>
  );
}

