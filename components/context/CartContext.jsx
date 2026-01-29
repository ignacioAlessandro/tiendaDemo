"use client";

import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/app/lib/apiClient";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    id: null,
    estado: "CART",
    items: [],
    total: 0, // centavos
  });

  const [loading, setLoading] = useState(false);

  const isEmpty = !cart?.items || cart.items.length === 0;

  const emptyCart = () => ({
    id: null,
    estado: "CART",
    items: [],
    total: 0,
  });

  const safeSetCart = (data) => {
    if (!data) {
      setCart(emptyCart());
      return;
    }
    setCart({
      id: data.id ?? null,
      estado: data.estado ?? "CART",
      items: Array.isArray(data.items) ? data.items : [],
      total: typeof data.total === "number" ? data.total : 0,
    });
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/carrito");
      safeSetCart(res.data);
    } catch (error) {
      // 401: no logueado → dejamos vacío
      safeSetCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productoId, cantidad = 1) => {
    try {
      setLoading(true);
      const res = await apiClient.post("/carrito/items", {
        productoId,
        cantidad,
      });
      safeSetCart(res.data);
    } finally {
      setLoading(false);
    }
  };

  const updateItemCantidad = async (itemId, cantidad) => {
    if (cantidad <= 0) return removeItem(itemId);

    try {
      setLoading(true);
      const res = await apiClient.put(`/carrito/items/${itemId}`, { cantidad });
      safeSetCart(res.data);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      const res = await apiClient.delete(`/carrito/items/${itemId}`);
      // tu backend suele devolver el carrito actualizado; si devuelve null, vaciamos
      safeSetCart(res?.data || null);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      // puede devolver 204 (sin body). En ambos casos forzamos estado vacío local.
      await apiClient.delete("/carrito");
      safeSetCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    cart,
    loading,
    isEmpty,
    fetchCart,
    addItem,
    updateItemCantidad,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
