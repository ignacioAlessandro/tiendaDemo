// backend/src/controllers/productos.controller.js
import prisma from "../config/prisma.js";

// GET /api/productos
export const getAllProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();
    return res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({ error: "Error al obtener productos" });
  }
};

// GET /api/productos/:id
export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await prisma.producto.findUnique({
      where: { id }, // id es String (UUID)
      include: {
        categoria: true,
        subcategoria: true,
      },
    });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return res.status(500).json({ error: "Error al obtener producto" });
  }
};

// GET /api/productos/recomendados?subcategoriaId=...&excludeId=...&limit=3
export const getProductosRecomendados = async (req, res) => {
  try {
    const { subcategoriaId, excludeId, limit = 3 } = req.query;

    if (!subcategoriaId) {
      return res.status(400).json({ error: "subcategoriaId es obligatorio" });
    }

    const productos = await prisma.producto.findMany({
      where: {
        subcategoriaId,
        ...(excludeId ? { NOT: { id: String(excludeId) } } : {}),
      },
      orderBy: {
        creadoAt: "desc",
      },
      take: Number(limit),
    });

    return res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos recomendados:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener productos recomendados" });
  }
};
