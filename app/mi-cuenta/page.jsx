// app/mi-cuenta/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function MiCuentaPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p>Cargando tu cuenta...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-4">Mi cuenta</h1>
      <div className="rounded-xl border bg-white p-6 shadow space-y-2 max-w-md">
        <p>
          <span className="font-medium">Nombre:</span> {user?.nombre}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user?.email}
        </p>
        {user?.documento && (
          <p>
            <span className="font-medium">Documento:</span> {user.documento}
          </p>
        )}
        {user?.telefono && (
          <p>
            <span className="font-medium">Teléfono:</span> {user.telefono}
          </p>
        )}
        <button
          onClick={logout}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
