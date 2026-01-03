// app/carrito/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "@/components/context/CartContext";
import apiClient from "../lib/apiClient";

export default function CarritoPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    cart,
    loading: cartLoading,
    isEmpty,
    updateItemCantidad,
    removeItem,
    clearCart,
    fetchCart,
  } = useCart();

  // Proteger ruta: si no está logueado, mandar a /login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p>Cargando...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    // Mientras redirige
    return null;
  }

  const totalPesos = (cart.total ?? 0) / 100;

  const handleDecrease = async (item) => {
    const nuevaCantidad = (item.cantidad || 0) - 1;
    if (nuevaCantidad <= 0) {
      await removeItem(item.id);
    } else {
      await updateItemCantidad(item.id, nuevaCantidad);
    }
  };

  const handleIncrease = async (item) => {
    await updateItemCantidad(item.id, (item.cantidad || 0) + 1);
  };

  const handleConfirmarPedido = async () => {
    try {
      const res = await apiClient.post("/pedidos/checkout");
      if (res.status === 201) {
        // El backend ya convirtió el carrito en pedido (PAID/PENDING)
        await fetchCart(); // recargamos carrito → quedará vacío
        router.push("/mi-cuenta"); // más adelante podés mandar a /mi-cuenta/pedidos
      }
    } catch (error) {
      console.error("Error al confirmar pedido:", error?.response?.data || error);
      // Podés agregar un estado de error visible si querés
    }
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="mb-6 text-2xl font-semibold">Carrito</h1>

      {cartLoading ? (
        <p>Cargando carrito...</p>
      ) : isEmpty ? (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Lista de items */}
          <section className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                    {item.imagen ? (
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Sin imagen</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">{item.nombre}</h2>
                    <p className="text-xs text-gray-500">
                      Precio: ${(item.precioUnitario / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Subtotal: ${(item.subtotal / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrease(item)}
                    className="h-8 w-8 rounded border text-lg leading-none"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => handleIncrease(item)}
                    className="h-8 w-8 rounded border text-lg leading-none"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-3 text-xs text-red-600 hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Resumen */}
          <aside className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Resumen</h2>

            <div className="flex justify-between text-sm">
              <span>Total productos</span>
              <span>
                {cart.items.reduce(
                  (acc, item) => acc + (item.cantidad || 0),
                  0
                )}{" "}
                unid.
              </span>
            </div>

            <div className="flex justify-between text-base font-semibold">
              <span>Total a pagar</span>
              <span>${totalPesos.toFixed(2)}</span>
            </div>

            <button
              onClick={handleConfirmarPedido}
              className="mt-4 w-full rounded bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Confirmar compra
            </button>

            <button
              onClick={clearCart}
              className="w-full rounded border border-gray-300 py-2 text-xs text-gray-600 hover:bg-gray-50"
            >
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
