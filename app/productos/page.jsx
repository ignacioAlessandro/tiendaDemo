"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProductsGridClient from "@/components/ProductsGridClient";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // filtros locales
  const [categoria, setCategoria] = useState("");
  const [orden, setOrden] = useState("mas_vendido");

  const router = useRouter();

  useEffect(() => {
    const fetchProductos = async () => {
      setCargando(true);
      try {
        const res = await fetch("http://localhost:3001/api/productos", {
          cache: "no-store",
        });
        const data = await res.json();
        setProductos(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error al cargar productos:", e);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };

    fetchProductos();
  }, []);

  // categorías únicas extraídas del array
  const categorias = useMemo(() => {
    const setCats = new Set();
    productos.forEach((p) => {
      if (p.categoriaId) setCats.add(p.categoriaId);
    });
    return Array.from(setCats);
  }, [productos]);

  // aplicar filtros y orden en cliente
  const productosFiltrados = useMemo(() => {
    let arr = [...productos];

    if (categoria) {
      arr = arr.filter(
        (p) => String(p.categoriaId) === String(categoria)
      );
    }

    if (orden === "precio_asc")
      arr.sort(
        (a, b) =>
          (a.precio_cents ?? a.precio ?? 0) -
          (b.precio_cents ?? b.precio ?? 0)
      );
    else if (orden === "precio_desc")
      arr.sort(
        (a, b) =>
          (b.precio_cents ?? b.precio ?? 0) -
          (a.precio_cents ?? a.precio ?? 0)
      );
    else if (orden === "nombre_asc")
      arr.sort((a, b) =>
        (a.nombre || "").localeCompare(b.nombre || "")
      );
    else if (orden === "nombre_desc")
      arr.sort((a, b) =>
        (b.nombre || "").localeCompare(a.nombre || "")
      );
    else if (orden === "mas_vendido") {
      // criterio simple: menor stock = más vendido
      arr.sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
    }

    return arr;
  }, [productos, categoria, orden]);

  return (
    <main className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Todos los productos</h1>
        <p className="mt-1 text-gray-600">
          Filtra y ordena para encontrar exactamente lo que buscás.
        </p>
      </header>

      {/* Controles de filtro / orden */}
      <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="rounded border px-3 py-1 text-sm"
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={String(c)} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Orden</label>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="rounded border px-3 py-1 text-sm"
          >
            <option value="mas_vendido">Más vendidos</option>
            <option value="precio_desc">Precio ↓</option>
            <option value="precio_asc">Precio ↑</option>
            <option value="nombre_asc">A → Z</option>
            <option value="nombre_desc">Z → A</option>
          </select>
        </div>
      </section>

      {/* Grid de productos */}
      {cargando ? (
        <p>Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <p>No se encontraron productos.</p>
      ) : (
        <ProductsGridClient productos={productosFiltrados} />
      )}
    </main>
  );
}
