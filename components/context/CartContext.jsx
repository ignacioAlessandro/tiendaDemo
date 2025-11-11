// context/CartContext.jsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, cantidad: i.cantidad + qty } : i);
      return [...prev, { ...product, cantidad: qty }];
    });
  }

  function updateQty(productId, qty) {
    setCart(prev => prev.map(i => i.id === productId ? { ...i, cantidad: qty } : i));
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(i => i.id !== productId));
  }

  function clearCart() { setCart([]); }

  const totalItems = cart.reduce((s, it) => s + (it.cantidad || 0), 0);
  const totalPrice = cart.reduce((s, it) => s + ((it.precio_cents ? it.precio_cents/100 : (it.precio || 0)) * (it.cantidad||1)), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
