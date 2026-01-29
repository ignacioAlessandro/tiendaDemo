"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductsGridClient from "@/components/ProductsGridClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const res = await fetch(`${API_BASE_URL}/productos`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProductos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    }
    obtenerProductos();
  }, []);

  const categoriasUnicas = useMemo(() => {
    const cats = productos.map((p) => p.categoriaId).filter(Boolean);
    return [...new Set(cats)];
  }, [productos]);

  const productosCat1 = useMemo(() => {
    const cat = categoriasUnicas[0];
    if (!cat) return [];
    return productos.filter((p) => p.categoriaId === cat).slice(0, 4);
  }, [productos, categoriasUnicas]);

  const productosCat2 = useMemo(() => {
    const cat = categoriasUnicas[1];
    if (!cat) return [];
    return productos.filter((p) => p.categoriaId === cat).slice(0, 4);
  }, [productos, categoriasUnicas]);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-20 text-center">
      {/* Bloque 1: Oferta del día */}
      <section className="mb-16 w-full max-w-6xl">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-blue-600">
          ¡Oferta del día!
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          Fundas y cargadores con hasta{" "}
          <span className="font-semibold text-blue-600">40% OFF</span>.
        </p>
        <Link
          href="/productos"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700 transition-all"
        >
          Ver ofertas
        </Link>
      </section>

      {/* Bloque 2: Productos destacados - Categoría 1 */}
      <section className="mb-24 w-full max-w-6xl text-left">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Productos destacados
          {categoriasUnicas[0] ? ` – Categoría ${categoriasUnicas[0]}` : ""}
        </h2>

        {cargando ? (
          <p className="animate-pulse text-gray-500">Cargando productos...</p>
        ) : productosCat1.length === 0 ? (
          <p className="text-gray-500">
            No hay productos disponibles en esta categoría.
          </p>
        ) : (
          <ProductsGridClient productos={productosCat1} />
        )}
      </section>

      {/* Bloque 3: Productos destacados - Categoría 2 */}
      <section className="mb-24 w-full max-w-6xl text-left">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Más productos recomendados
          {categoriasUnicas[1] ? ` – Categoría ${categoriasUnicas[1]}` : ""}
        </h2>

        {cargando ? (
          <p className="animate-pulse text-gray-500">Cargando productos...</p>
        ) : productosCat2.length === 0 ? (
          <p className="text-gray-500">
            No hay productos disponibles en esta categoría.
          </p>
        ) : (
          <ProductsGridClient productos={productosCat2} />
        )}
      </section>

      {/* Bloque 4: Sobre nosotros */}
      <section className="mt-8 w-full bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-left">
          <h3 className="mb-4 text-2xl font-semibold">Sobre nosotros</h3>
          <p className="leading-relaxed text-gray-300">
            Somos una tienda especializada en productos electrónicos, fundas,
            cargadores y accesorios. Nuestro objetivo es ofrecer calidad, buen
            precio y atención personalizada, brindándote una experiencia de
            compra moderna, rápida y segura.
          </p>
        </div>
      </section>
    </div>
  );
}
