// components/Providers.jsx
"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/components/context/CartContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
