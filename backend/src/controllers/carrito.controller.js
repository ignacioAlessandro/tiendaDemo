import prisma from "../config/prisma.js";

async function findOrCreateCarrito(usuarioId) {
  let carrito = await prisma.orden.findFirst({
    where: { usuarioId, estado: "CART" },
  });

  if (!carrito) {
    carrito = await prisma.orden.create({
      data: {
        usuarioId,
        estado: "CART",
        total: 0,
      },
    });
  }

  return carrito;
}

function mapCarritoResponse(carrito) {
  if (!carrito) {
    return {
      id: null,
      estado: "CART",
      items: [],
      total: 0,
    };
  }

  return {
    id: carrito.id,
    estado: carrito.estado,
    items: (carrito.items || []).map((item) => ({
      id: item.id,
      productoId: item.productoId,
      nombre: item.producto?.nombre,
      precioUnitario: item.precioUnitario, // centavos
      cantidad: item.cantidad,
      subtotal: item.precioUnitario * item.cantidad,
      imagen: item.producto?.imagenPrincipal || item.producto?.imagen_url || null,
    })),
    total: carrito.total, // centavos
  };
}

/* =========================
   GET /api/carrito
========================= */
export const getCarritoActual = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id || req.userId;

    if (!usuarioId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const carrito = await prisma.orden.findFirst({
      where: { usuarioId, estado: "CART" },
      include: {
        items: { include: { producto: true } },
      },
    });

    return res.json(mapCarritoResponse(carrito));
  } catch (err) {
    next(err);
  }
};

/* =========================
   POST /api/carrito/items
========================= */
export const addItemToCarrito = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id || req.userId;
    const { productoId, cantidad = 1 } = req.body;

    if (!usuarioId) return res.status(401).json({ message: "Usuario no autenticado" });
    if (!productoId || Number(cantidad) <= 0) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

    const carrito = await findOrCreateCarrito(usuarioId);

    const updatedCarrito = await prisma.$transaction(async (tx) => {
      const existingItem = await tx.ordenItem.findFirst({
        where: { ordenId: carrito.id, productoId },
      });

      if (existingItem) {
        await tx.ordenItem.update({
          where: { id: existingItem.id },
          data: { cantidad: existingItem.cantidad + Number(cantidad) },
        });
      } else {
        await tx.ordenItem.create({
          data: {
            ordenId: carrito.id,
            productoId,
            cantidad: Number(cantidad),
            precioUnitario: producto.precio_cents, // centavos
          },
        });
      }

      const items = await tx.ordenItem.findMany({ where: { ordenId: carrito.id } });

      const total = items.reduce(
        (acc, item) => acc + item.precioUnitario * item.cantidad,
        0
      );

      return tx.orden.update({
        where: { id: carrito.id },
        data: { total },
        include: { items: { include: { producto: true } } },
      });
    });

    return res.status(201).json(mapCarritoResponse(updatedCarrito));
  } catch (err) {
    next(err);
  }
};

/* =========================
   PUT /api/carrito/items/:itemId
========================= */
export const updateItemCantidad = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id || req.userId;
    const { itemId } = req.params;
    const { cantidad } = req.body;

    if (!usuarioId) return res.status(401).json({ message: "Usuario no autenticado" });
    if (!Number(cantidad) || Number(cantidad) <= 0) {
      return res.status(400).json({ message: "Cantidad inválida" });
    }

    const item = await prisma.ordenItem.findUnique({
      where: { id: itemId },
      include: { orden: true, producto: true },
    });

    if (!item || item.orden.usuarioId !== usuarioId) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    const updatedCarrito = await prisma.$transaction(async (tx) => {
      await tx.ordenItem.update({
        where: { id: item.id },
        data: { cantidad: Number(cantidad) },
      });

      const items = await tx.ordenItem.findMany({ where: { ordenId: item.ordenId } });

      const total = items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);

      return tx.orden.update({
        where: { id: item.ordenId },
        data: { total },
        include: { items: { include: { producto: true } } },
      });
    });

    return res.json(mapCarritoResponse(updatedCarrito));
  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE /api/carrito/items/:itemId
========================= */
export const removeItemFromCarrito = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id || req.userId;
    const { itemId } = req.params;

    if (!usuarioId) return res.status(401).json({ error: "Usuario no autenticado" });

    const item = await prisma.ordenItem.findUnique({
      where: { id: itemId },
      include: { orden: true },
    });

    if (!item || item.orden.usuarioId !== usuarioId) {
      return res.status(404).json({ error: "Item no encontrado" });
    }

    const updatedCarrito = await prisma.$transaction(async (tx) => {
      await tx.ordenItem.delete({ where: { id: item.id } });

      const items = await tx.ordenItem.findMany({ where: { ordenId: item.ordenId } });

      const total = items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);

      return tx.orden.update({
        where: { id: item.ordenId },
        data: { total },
        include: { items: { include: { producto: true } } },
      });
    });

    return res.json(mapCarritoResponse(updatedCarrito));
  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE /api/carrito
========================= */
export const clearCarrito = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id || req.userId;

    if (!usuarioId) return res.status(401).json({ error: "Usuario no autenticado" });

    const carrito = await prisma.orden.findFirst({
      where: { usuarioId, estado: "CART" },
    });

    if (!carrito) {
      return res.json(mapCarritoResponse(null));
    }

    await prisma.$transaction(async (tx) => {
      await tx.ordenItem.deleteMany({ where: { ordenId: carrito.id } });
      await tx.orden.update({ where: { id: carrito.id }, data: { total: 0 } });
    });

    const updated = await prisma.orden.findUnique({
      where: { id: carrito.id },
      include: { items: { include: { producto: true } } },
    });

    return res.json(mapCarritoResponse(updated));
  } catch (err) {
    next(err);
  }
};
