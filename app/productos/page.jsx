"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";

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
        const res = await fetch("/api/productos");
        const data = await res.json();
        // Asegurar formato (array)
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
    let arr = productos.slice();

    if (categoria) {
      arr = arr.filter((p) => String(p.categoriaId) === String(categoria));
    }

    if (orden === "precio_asc") arr.sort((a, b) => (a.precio_cents ?? a.precio ?? 0) - (b.precio_cents ?? b.precio ?? 0));
    else if (orden === "precio_desc") arr.sort((a, b) => (b.precio_cents ?? b.precio ?? 0) - (a.precio_cents ?? a.precio ?? 0));
    else if (orden === "nombre_asc") arr.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
    else if (orden === "nombre_desc") arr.sort((a, b) => (b.nombre || "").localeCompare(a.nombre || ""));
    else if (orden === "mas_vendido") {
      // nuestro criterio: menos stock -> más vendido (según tu idea)
      arr.sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
    }

    return arr;
  }, [productos, categoria, orden]);

  // placeholder: comprobar si user está logeado (si tienes auth, conéctalo a tu estado)
  const isLogged = false; // cambia esto según tu Auth (p.ej. from context)

  const handleAddToCart = (producto) => {
    if (!isLogged) {
      // redirigir a login o mostrar modal
      router.push("/mi-cuenta"); // o "/login" según tu diseño
      return;
    }
    // Aquí integrar la función para añadir al carrito (CartContext)
    console.log("Agregar al carrito:", producto.id);
  };

  return (
    <main className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <p className="text-gray-600 mt-1">Filtra y ordena para encontrar lo que buscas</p>
      </header>

      <section className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="font-medium">Categoría</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="px-3 py-1 border rounded">
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={String(c)} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="font-medium">Orden</label>
          <select value={orden} onChange={(e) => setOrden(e.target.value)} className="px-3 py-1 border rounded">
            <option value="mas_vendido">Más vendidos</option>
            <option value="precio_desc">Precio ↓</option>
            <option value="precio_asc">Precio ↑</option>
            <option value="nombre_asc">A → Z</option>
            <option value="nombre_desc">Z → A</option>
          </select>
        </div>
      </section>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <p>No se encontraron productos.</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productosFiltrados.map((p) => (
            <ProductCard key={String(p.id)} producto={p} onAddToCart={handleAddToCart} isLogged={isLogged} />
          ))}
        </section>
      )}
    </main>
  );
}
