"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/;
const nombreRegex = /^[A-Za-zÀ-ÿ\s]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

export default function LoginPage() {
  const router = useRouter();
  const { login, register, loading: authLoading, isAuthenticated } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // campos login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // campos registro
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/mi-cuenta");
    }
  }, [authLoading, isAuthenticated, router]);

  const validarRegistro = () => {
    if (!nombreRegex.test(nombre.trim())) {
      return "El nombre solo puede contener letras.";
    }
    if (!nombreRegex.test(apellido.trim())) {
      return "El apellido solo puede contener letras.";
    }
    if (!emailRegex.test(regEmail.trim())) {
      return "El email no tiene un formato válido (ej: as34fDAEl@gmail.com).";
    }
    if (!passwordRegex.test(regPassword)) {
      return "La contraseña debe tener al menos 6 caracteres e incluir letras y números (se sugiere usar mayúsculas).";
    }
    if (!aceptaTerminos) {
      return "Debes aceptar los términos y condiciones para continuar.";
    }
    return null;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      router.push("/mi-cuenta");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error al iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validarRegistro();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: regEmail.trim(),
        password: regPassword,
        telefono: telefono.trim() || null,
      });
      router.push("/mi-cuenta");
    } catch (err) {
      console.error(err);
      setError("Error al crear la cuenta. Verificá tus datos.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
        {/* Columna izquierda: Mi cuenta / Beneficios */}
        <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          {isRegisterMode ? (
            <>
              <h1 className="text-2xl font-semibold">Crea tu cuenta</h1>
              <p className="text-sm text-gray-600">
                Registrate para:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Acceder al carrito y finalizar tus compras.</li>
                <li>Gestionar tus pedidos.</li>
                <li>Recibir seguimientos actualizados.</li>
                <li>Obtener soporte personalizado.</li>
                <li>Acceder a ofertas y promociones.</li>
              </ul>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold">Mi cuenta</h1>
              <p className="text-sm text-gray-600">
                Iniciá sesión para disfrutar de todas las funciones de la
                tienda: carrito, historial de pedidos, seguimiento y más.
              </p>
            </>
          )}

          <button
            className="mt-4 text-xs text-indigo-700 underline"
            onClick={() => {
              setError("");
              setIsRegisterMode((prev) => !prev);
            }}
          >
            {isRegisterMode
              ? "¿Ya tenés cuenta? Iniciar sesión"
              : "¿No tenés cuenta? Crear una nueva"}
          </button>
        </section>

        {/* Columna derecha: formulario */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {isRegisterMode ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Apellido</label>
                <input
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  placeholder="as34fDAEl@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  WhatsApp
                </label>
                <input
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+54 9 **** ** **62"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Ingresá tu número con prefijo internacional y de área. 
                  Ejemplo: +54 9 **** ** **62
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mínimo 6 caracteres, debe contener letras y números. 
                  Se recomienda usar mayúsculas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="terminos"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                />
                <label
                  htmlFor="terminos"
                  className="text-xs text-gray-600"
                >
                  Confirmo que acepto los términos y condiciones de la
                  tienda.
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting || authLoading}
                className="mt-2 w-full rounded bg-black py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {submitting || authLoading
                  ? "Creando cuenta..."
                  : "Crear cuenta"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting || authLoading}
                className="mt-2 w-full rounded bg-black py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {submitting || authLoading
                  ? "Ingresando..."
                  : "Ingresar"}
              </button>

              <p className="mt-3 text-xs text-gray-600">
                ¿No tenés una cuenta?{" "}
                <button
                  type="button"
                  className="text-indigo-700 underline"
                  onClick={() => {
                    setError("");
                    setIsRegisterMode(true);
                  }}
                >
                  Crear una nueva
                </button>
              </p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
