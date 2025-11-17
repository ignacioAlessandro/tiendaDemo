// components/CartDropdown.jsx
"use client";
import { useState } from "react";
import { useCart } from "./context/CartContext";
import Link from "next/link";

export default function CartDropdown() {
  const { cart, removeFromCart, totalPrice, totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="px-3 py-1">🛒 {totalItems || 0}</button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded p-3 z-50">
          {cart.length === 0 ? (
            <div className="text-center text-gray-600 py-8">Tu carrito está vacío</div>
          ) : (
            <>
              <ul className="space-y-3 max-h-60 overflow-auto">
                {cart.map(item => (
                  <li key={item.id} className="flex items-center gap-3">
                    <img src={item.imagen || "/images/placeholder.png"} alt={item.nombre} className="w-12 h-12 object-cover" />
                    <div className="flex-1">
                      <div className="font-medium">{item.nombre}</div>
                      <div className="text-sm text-gray-600">x{item.cantidad} - ${(item.precio_cents ? (item.precio_cents/100*item.cantidad).toFixed(2) : ((item.precio||0)*item.cantidad).toFixed(2))}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-600 text-sm">Eliminar</button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between">
                <strong>Total: ${totalPrice.toFixed(2)}</strong>
                <Link href="/carrito" className="bg-indigo-600 text-white px-3 py-1 rounded">Pagar</Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
