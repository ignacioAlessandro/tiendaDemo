import prisma from '../../lib/prisma';
export default async function handler(req,res){
  if (req.method==='GET'){
    const prods = await prisma.producto.findMany();
    if (prods.length>0) return res.json(prods);
    const mock = [
      { id:'p1', nombre:'Semilla A', slug:'semilla-a', descripcion:'Semilla de alta calidad', precio_cents:15000, stock:12, imagen_url:'/images/seed-a.png' },
      { id:'p2', nombre:'Semilla B', slug:'semilla-b', descripcion:'Resistente', precio_cents:12000, stock:6, imagen_url:'/images/seed-b.png' },
      { id:'p3', nombre:'Semilla C', slug:'semilla-c', descripcion:'Interior', precio_cents:18000, stock:20, imagen_url:'/images/seed-c.png' }
    ];
    return res.json(mock);
  }
  res.status(405).end();
}
