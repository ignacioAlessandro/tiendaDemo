import { useEffect, useState } from 'react';
export default function Carrito(){
  const [carrito,setCarrito]=useState([]);
  useEffect(()=>{ const saved=localStorage.getItem('carrito'); if(saved) setCarrito(JSON.parse(saved)); },[]);
  function updateQty(id, delta){ setCarrito(prev=>prev.map(i=>i.id===id?{...i,cantidad:Math.max(1,i.cantidad+delta)}:i)); }
  function removeItem(id){ setCarrito(prev=>prev.filter(i=>i.id!==id)); }
  useEffect(()=>localStorage.setItem('carrito',JSON.stringify(carrito)),[carrito]);
  const total = carrito.reduce((s,i)=>s+i.precio_cents*i.cantidad,0);
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Carrito</h2>
      {carrito.length===0? <p>Carrito vacío</p> : (
        <div>
          {carrito.map(i=> (
            <div key={i.id} className="flex items-center justify-between border p-3 mb-2">
              <div>
                <div className="font-bold">{i.nombre}</div>
                <div className="text-sm text-gray-600">${(i.precio_cents/100).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>updateQty(i.id,-1)} className="px-2">-</button>
                <div>{i.cantidad}</div>
                <button onClick={()=>updateQty(i.id,1)} className="px-2">+</button>
                <button onClick={()=>removeItem(i.id)} className="ml-4 text-red-600">Eliminar</button>
              </div>
            </div>
          ))}
          <div className="mt-4 font-bold">Total: ${(total/100).toFixed(2)}</div>
          <a href="/checkout" className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded">Ir a pagar</a>
        </div>
      )}
    </div>
  );
}
