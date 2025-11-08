import { createContext, useContext, useEffect, useState } from 'react';
const CartContext = createContext();
export function CartProvider({ children }){
  const [cart, setCart] = useState([]);
  useEffect(()=>{ const saved = localStorage.getItem('carrito'); if (saved) setCart(JSON.parse(saved)); },[]);
  useEffect(()=>localStorage.setItem('carrito', JSON.stringify(cart)),[cart]);
  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
