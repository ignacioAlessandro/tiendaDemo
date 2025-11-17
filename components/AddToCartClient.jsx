// components/AddToCartClient.jsx
"use client";
import { useState } from "react";
import { useCart } from "./context/CartContext"; // ajustá si tu context está en otra ruta

export default function AddToCartClient({ producto }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  async function checkAuthAndAdd() {
    setLoading(true);
    try {
      const res = await fetch("/api/usuarios/me");
      if (res.status === 200) {
        addToCart(producto, 1);
        alert("Producto añadido al carrito");
      } else {
        if (confirm("Debes iniciar sesión para añadir al carrito. Ir a Mi Cuenta?")) {
          window.location.href = "/mi-cuenta";
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error comprobando sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={checkAuthAndAdd} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60">
      {loading ? "..." : "Agregar al carrito"}
    </button>
  );
}
