import { useEffect, useState } from 'react';
export default function Checkout(){
  const [carrito,setCarrito]=useState([]);
  const [email,setEmail]=useState('');
  const [loading,setLoading]=useState(false);
  const [mpUrl,setMpUrl]=useState(null);
  useEffect(()=>{ const saved=localStorage.getItem('carrito'); if(saved) setCarrito(JSON.parse(saved)); },[]);
  async function handleCheckout(){
    if (carrito.length===0) return alert('Carrito vacío');
    setLoading(true);
    const items = carrito.map(i=>({ productoId: i.id, cantidad: i.cantidad, precio_cents: i.precio_cents }));
    const resp = await fetch('/api/ordenes',{ method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ items, emailInvitado: email }) });
    const data = await resp.json();
    if (!data.ok) { alert('Error creando orden'); setLoading(false); return; }
    const orden = data.orden;
    const mp = await fetch('/api/mercadopago/create_preference',{ method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ ordenId: orden.id }) });
    const mpData = await mp.json();
    setMpUrl(mpData.sandbox_init_point || mpData.init_point);
    setLoading(false);
    if (mpData.sandbox_init_point || mpData.init_point) window.open(mpData.sandbox_init_point || mpData.init_point, '_blank');
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <div className="mb-2">Ingrese su email (recibirá confirmación):</div>
      <input value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 w-full mb-4" />
      <div className="mb-4">Items en carrito: {carrito.reduce((s,i)=>s+i.cantidad,0)}</div>
      <button onClick={handleCheckout} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading? 'Procesando...' : 'Pagar con MercadoPago'}</button>
      {mpUrl && <div className="mt-4">Si no se abrió el checkout automáticamente, <a href={mpUrl} target="_blank" rel="noreferrer" className="text-blue-600">haz click aquí</a></div>}
    </div>
  );
}
