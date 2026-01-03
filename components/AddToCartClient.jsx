// components/AddToCartClient.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import apiClient from "@/app/lib/apiClient";

export default function AddToCartClient({ producto }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleAdd = async () => {
    setMensaje("");

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!producto?.id) return;

    try {
      setLoading(true);
      await apiClient.post("/carrito/items", {
        productoId: producto.id,
        cantidad: Number(cantidad) || 1,
      });
      setMensaje("Producto agregado al carrito.");
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      setMensaje("Ocurrió un error al agregar al carrito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3 rounded-xl border bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Cantidad
        </label>
        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-20 rounded border px-2 py-1 text-sm"
        />
      </div>

      <button
        onClick={handleAdd}
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Agregando..." : "Agregar al carrito"}
      </button>

      {mensaje && (
        <p className="text-xs text-gray-700">
          {mensaje}
        </p>
      )}
    </div>
  );
}
