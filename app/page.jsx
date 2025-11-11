"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const res = await fetch("/api/productos", { cache: "no-store" });
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProductos(data.productos || data); // Toma el array directo o desde una propiedad
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    }
    obtenerProductos();
  }, []);

// ✅ Detectar automáticamente las categorías distintas
const categoriasUnicas = [...new Set(productos.map((p) => p.categoriaId))];

const productosCat1 = productos
  .filter((p) => p.categoriaId === categoriasUnicas[0])
  .slice(0, 4);
const productosCat2 = productos
  .filter((p) => p.categoriaId === categoriasUnicas[1])
  .slice(0, 4);


  // Imagen por defecto online
  const imagenDefault = "https://via.placeholder.com/300x300?text=Sin+imagen";

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Bloque 1: Oferta del día */}
      <section className="w-full max-w-6xl mb-16">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-600 tracking-tight">
          ¡Oferta del día!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Fundas y cargadores con hasta{" "}
          <span className="font-semibold text-blue-600">40% OFF</span>.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-all">
          Ver ofertas
        </button>
      </section>

      {/* Bloque 2: Productos destacados - Electrónica */}
      <section className="w-full max-w-6xl mb-24">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">
          Productos destacados - Categoría {categoriasUnicas[0] || "N/A"}
        </h2>
        {cargando ? (
          <p className="text-gray-500 animate-pulse">Cargando productos...</p>
        ) : productosCat1.length === 0 ? (
          <p className="text-gray-500">
            No hay productos de electrónica disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {productosCat1.map((p) => (
              <div
                key={p.id}
                className="bg-white shadow-md rounded-xl overflow-hidden p-4 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <img
                  src={p.imagen || imagenDefault}
                  alt={p.nombre}
                  className="h-40 w-full object-contain mb-3"
                />
                <h3 className="font-medium text-gray-800">{p.nombre}</h3>
                <p className="text-blue-600 font-semibold">${p.precio}</p>
                <button className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700 transition">
                  Ver más
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bloque 3: Productos destacados - Otra categoría */}
      <section className="w-full max-w-6xl mb-24">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">
          Productos destacados - Categoría {categoriasUnicas[1] || "N/A"}
       </h2>
        {cargando ? (
          <p className="text-gray-500 animate-pulse">Cargando productos...</p>
        ) : productosCat2.length === 0 ? (
          <p className="text-gray-500">
            No hay productos de telefonía disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {productosCat2.map((p) => (
              <div
                key={p.id}
                className="bg-white shadow-md rounded-xl overflow-hidden p-4 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <img
                  src={p.imagen || imagenDefault}
                  alt={p.nombre}
                  className="h-40 w-full object-contain mb-3"
                />
                <h3 className="font-medium text-gray-800">{p.nombre}</h3>
                <p className="text-blue-600 font-semibold">${p.precio}</p>
                <button className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700 transition">
                  Ver más
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bloque 4: Sobre nosotros */}
      <section className="bg-gray-900 text-white w-full py-16 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-semibold mb-4">Sobre nosotros</h3>
          <p className="text-gray-300 leading-relaxed">
            Somos una tienda especializada en productos electrónicos, fundas,
            cargadores y accesorios. Nuestro objetivo es ofrecer calidad,
            precio y atención personalizada, brindándote una experiencia
            de compra moderna, rápida y segura.
          </p>
        </div>
      </section>
    </div>
  );
}
