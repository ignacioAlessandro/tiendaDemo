"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  // Separar estados: uno para dropdown desktop, otro para menú mobile
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const productsRef = useRef(null);

  // Cerrar dropdown al click fuera (desktop)
  useEffect(() => {
    function handleClickOutside(e) {
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar menú mobile al cambiar a desktop (por si se redimensiona)
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          TiendaDemo
        </Link>

        {/* Botón Mobile */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
        >
          ☰
        </button>

        {/* Navegación principal (Desktop) */}
        <nav className="hidden items-center space-x-8 md:flex">
          {/* Dropdown productos */}
          <div className="relative" ref={productsRef}>
            <button
              type="button"
              onClick={() => setProductsOpen((prev) => !prev)}
              className="hover:text-blue-600"
              aria-expanded={productsOpen}
            >
              Productos ▾
            </button>

            {productsOpen && (
              <div className="absolute mt-2 w-40 rounded-lg border bg-white shadow-lg">
                <Link
                  href="/productos"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setProductsOpen(false)}
                >
                  Todos
                </Link>
                <Link
                  href="/productos?categoria=electronica"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setProductsOpen(false)}
                >
                  Electrónica
                </Link>
                <Link
                  href="/productos?categoria=telefonia"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setProductsOpen(false)}
                >
                  Telefonía
                </Link>
                <Link
                  href="/productos?categoria=accesorios"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setProductsOpen(false)}
                >
                  Accesorios
                </Link>
              </div>
            )}
          </div>

          <Link href="#" className="hover:text-blue-600">
            Próximamente
          </Link>

          <Link href="/carrito" className="hover:text-blue-600">
            🛒 Carrito
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/mi-cuenta" className="hover:text-blue-600">
                Mi cuenta {user?.nombre ? `(${user.nombre})` : ""}
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-blue-600"
              >
                Salir
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-blue-600">
              Ingresar
            </Link>
          )}
        </nav>
      </div>

      {/* Menú Mobile desplegable */}
            {mobileOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            <Link
              href="/productos"
              className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={closeMobile}
            >
              Productos (Todos)
            </Link>
            <Link
              href="/productos?categoria=electronica"
              className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={closeMobile}
            >
              Electrónica
            </Link>
            <Link
              href="/productos?categoria=telefonia"
              className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={closeMobile}
            >
              Telefonía
            </Link>
            <Link
              href="/productos?categoria=accesorios"
              className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={closeMobile}
            >
              Accesorios
            </Link>

            <Link
              href="/carrito"
              className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={closeMobile}
            >
              🛒 Carrito
            </Link>

            <div className="my-2 h-px bg-gray-200" />

            {isAuthenticated ? (
              <>
                <Link
                  href="/mi-cuenta"
                  className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={closeMobile}
                >
                  Mi cuenta {user?.nombre ? `(${user.nombre})` : ""}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMobile();
                  }}
                  className="rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                onClick={closeMobile}
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

