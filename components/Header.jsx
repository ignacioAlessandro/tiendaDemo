"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          TiendaDemo
        </Link>

        {/* Navegación principal */}
        <nav className="hidden md:flex space-x-8">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:text-blue-600"
            >
              Productos ▾
            </button>
            {menuOpen && (
              <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-40">
                <Link
                  href="/productos"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Todos
                </Link>
                <Link
                  href="/productos?categoria=electronica"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Electrónica
                </Link>
                <Link
                  href="/productos?categoria=telefonia"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Telefonía
                </Link>
                <Link
                  href="/productos?categoria=accesorios"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Accesorios
                </Link>
              </div>
            )}
          </div>

          <Link href="#" className="hover:text-blue-600">
            Próximamente
          </Link>
          <Link href="/mi-cuenta" className="hover:text-blue-600">
            Mi cuenta
          </Link>
          <Link href="/carrito" className="hover:text-blue-600">
            🛒 Carrito
          </Link>
        </nav>
      </div>
    </header>
  );
}
