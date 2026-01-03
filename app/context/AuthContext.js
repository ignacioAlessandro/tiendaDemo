// app/context/AuthContext.js
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient, { setAccessToken } from "../lib/apiClient";

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "tienda_access_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // carga inicial (restaurar sesión)

  // Restaurar sesión si hay token en localStorage
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;

    if (!token) {
      setAccessToken(null);
      setLoading(false);
      return;
    }

    setAccessToken(token);

    // Pedimos /auth/me al backend
    apiClient
      .get("/auth/me")
      .then((res) => {
        // según cómo respondas en el backend: { user: {...} } o directamente el user
        setUser(res.data.user || res.data);
      })
      .catch((err) => {
        console.error("Error al restaurar sesión:", err);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAuthSuccess = (token, userObj) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
    setAccessToken(token);
    setUser(userObj);
  };

  const login = async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    const { token, user } = res.data;
    handleAuthSuccess(token, user);
    return user;
  };
    const register = async ({ nombre, apellido, email, password, telefono }) => {
    const res = await apiClient.post("/auth/register", {
      nombre,
      apellido,
      email,
      password,
      telefono,
    });
    const { token, user } = res.data;
    handleAuthSuccess(token, user);
    return user;
  };


  const logout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
    setAccessToken(null);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
};
