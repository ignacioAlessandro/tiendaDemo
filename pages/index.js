import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
export default function Home() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  useEffect(() => { fetch('/api/productos').then(r=>r.json()).then(setProductos); const saved = localStorage.getItem('carrito'); if (saved) setCarrito(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem('carrito', JSON.stringify(carrito)); }, [carrito]);
  function handleAdd(producto){ setCarrito(prev=>{ const found = prev.find(p=>p.id===producto.id); if (found) return prev.map(p=>p.id===producto.id?{...p,cantidad:p.cantidad+1}:p); return [...prev,{...producto,cantidad:1}]; }); }
  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tienda Demo</h1>
        <div><strong>Carrito:</strong> {carrito.reduce((s,i)=>s+i.cantidad,0)} items</div>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productos.map(p=>(<ProductCard key={p.id} producto={p} onAdd={handleAdd}/>))}
      </section>
    </div>
  );
}
