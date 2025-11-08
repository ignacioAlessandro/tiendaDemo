export default function ProductCard({ producto, onAdd }){
  return (
    <div className="border rounded p-4 shadow-sm">
      <img src={producto.imagen_url || '/images/placeholder.png'} alt={producto.nombre} className="w-full h-40 object-cover mb-3"/>
      <h3 className="text-lg font-semibold">{producto.nombre}</h3>
      <p className="text-sm text-gray-600">{producto.descripcion}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold">${(producto.precio_cents/100).toFixed(2)}</span>
        <button onClick={()=>onAdd(producto)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Añadir</button>
      </div>
    </div>
  );
}
