// components/context/CartContext.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/app/lib/apiClient";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    id: null,
    estado: "CART",
    items: [],
    total: 0, // en centavos
  });
  const [loading, setLoading] = useState(false);

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  const safeSetCart = (data) => {
    // Normalizamos por si el backend devuelve algo raro
    if (!data) {
      setCart({ id: null, estado: "CART", items: [], total: 0 });
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
      // Si el backend responde 401, simplemente dejamos carrito vacío
      console.error("Error al cargar carrito:", error?.response?.data || error);
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
    } catch (error) {
      console.error("Error al agregar item al carrito:", error?.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItemCantidad = async (itemId, cantidad) => {
    // Si mandamos 0, preferimos quitar el item
    if (cantidad <= 0) {
      return removeItem(itemId);
    }

    try {
      setLoading(true);
      const res = await apiClient.put(`/carrito/items/${itemId}`, {
        cantidad,
      });
      safeSetCart(res.data);
    } catch (error) {
      console.error("Error al actualizar cantidad:", error?.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      const res = await apiClient.delete(`/carrito/items/${itemId}`);
      safeSetCart(res.data);
    } catch (error) {
      console.error("Error al eliminar item del carrito:", error?.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const res = await apiClient.delete("/carrito");
      safeSetCart(res.data);
    } catch (error) {
      console.error("Error al vaciar carrito:", error?.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Al montar, intentamos cargar el carrito actual del backend
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
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return ctx;
}
