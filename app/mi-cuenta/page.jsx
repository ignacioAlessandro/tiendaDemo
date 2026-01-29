"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import apiClient from "../lib/apiClient";

function formatMoney(cents) {
  const value = Number(cents || 0) / 100;
  return value.toFixed(2);
}

function formatDate(dateLike) {
  try {
    const d = new Date(dateLike);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("es-AR");
  } catch {
    return "-";
  }
}

export default function MiCuentaPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      (async () => {
        try {
          setLoadingPedidos(true);
          const res = await apiClient.get("/pedidos");
          setPedidos(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error("Error cargando pedidos:", err?.response?.data || err);
          setPedidos([]);
        } finally {
          setLoadingPedidos(false);
        }
      })();
    }
  }, [loading, isAuthenticated]);

  const pedidosOrdenados = useMemo(() => {
    // backend devuelve creadoEn; si no existe, cae a 0
    return [...pedidos].sort((a, b) => {
      const da = new Date(a.creadoEn || 0).getTime();
      const db = new Date(b.creadoEn || 0).getTime();
      return db - da;
    });
  }, [pedidos]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p>Cargando tu cuenta...</p>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <main className="container mx-auto py-10 px-4 space-y-8">
      {/* Bienvenida */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">
          Bienvenido{user?.nombre ? `, ${user.nombre}` : ""}.
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Desde aquí podés ver tus pedidos, revisar tus datos y gestionar tu sesión.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium">{user?.email || "-"}</p>
          </div>
          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-xs text-gray-500">WhatsApp</p>
            <p className="text-sm font-medium">{user?.telefono || "-"}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => alert("Pendiente: edición de datos de facturación por defecto.")}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Editar datos de facturación
          </button>

          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </section>

      {/* Pedidos */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Mis pedidos</h2>
            <p className="text-sm text-gray-600">
              Historial de compras confirmadas (excluye el carrito).
            </p>
          </div>
        </div>

        {loadingPedidos ? (
          <p className="text-sm text-gray-600">Cargando pedidos...</p>
        ) : pedidosOrdenados.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-sm text-gray-600">
            Todavía no tenés pedidos confirmados.
          </div>
        ) : (
          <div className="space-y-3">
            {pedidosOrdenados.map((p) => {
              const itemsCount = Array.isArray(p.items)
                ? p.items.reduce((acc, i) => acc + (i.cantidad || 0), 0)
                : 0;

              const isOpen = openId === p.id;

              return (
                <div key={p.id} className="rounded-2xl border bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : p.id)}
                    className="w-full p-5 text-left"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">
                          Pedido #{String(p.id).slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Fecha: {formatDate(p.creadoEn)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Estado</p>
                          <p className="text-sm font-semibold">{p.estado}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="text-sm font-semibold">
                            ${formatMoney(p.total)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Items</p>
                          <p className="text-sm font-semibold">{itemsCount}</p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-indigo-700">
                      {isOpen ? "Ocultar detalle ▲" : "Ver detalle ▼"}
                    </p>
                  </button>

                  {isOpen && (
                    <div className="border-t p-5 space-y-4">
                      {/* Detalle productos */}
                      <div>
                        <h3 className="text-sm font-semibold">Productos</h3>
                        <div className="mt-2 space-y-2">
                          {(p.items || []).map((i, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-3"
                            >
                              <div>
                                <p className="text-sm font-medium">{i.nombre || "Producto"}</p>
                                <p className="text-xs text-gray-600">
                                  Cantidad: {i.cantidad || 0}
                                </p>
                              </div>
                              <p className="text-sm font-semibold">
                                ${formatMoney(i.precioUnitario)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Facturación (placeholder controlado) */}
                      <div className="rounded-xl border bg-white p-4">
                        <h3 className="text-sm font-semibold">Datos de facturación</h3>
                        <p className="mt-1 text-xs text-gray-600">
                          Pendiente: persistir facturación por defecto y mostrarla aquí.
                        </p>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <div className="rounded-lg border bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">Nombre facturado</p>
                            <p className="text-sm font-medium">
                              {user?.nombre ? `${user.nombre} ${user?.apellido || ""}` : "-"}
                            </p>
                          </div>
                          <div className="rounded-lg border bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">Dirección</p>
                            <p className="text-sm font-medium">Pendiente</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
