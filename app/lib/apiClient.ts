// app/context/AuthContext.jsx
"use client";

import React, { createContext, useContext } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: () => {},
  register: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const value = {
    user: null,
    isAuthenticated: false,
    loading: false,
    login: () => {},
    register: () => {},
    logout: () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
