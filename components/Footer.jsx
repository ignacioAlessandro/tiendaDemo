"use client";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-6 mt-12">
      <p>© {new Date().getFullYear()} TiendaDemo — Todos los derechos reservados.</p>
      <div className="mt-2 space-x-4 text-sm text-gray-400">
        <a href="/politicas" className="hover:text-white">Políticas</a>
        <a href="/privacidad" className="hover:text-white">Privacidad</a>
        <a href="/sobre-nosotros" className="hover:text-white">Sobre Nosotros</a>
      </div>
    </footer>
  );
}
