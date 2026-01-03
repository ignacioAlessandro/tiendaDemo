// backend/src/controllers/pedidos.controller.js
import prisma from "../config/prisma.js"; // corrige este import si hacía falta

export const checkoutPedido = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id || req.userId;

    const carrito = await prisma.orden.findFirst({
      where: { usuarioId, estado: "CART" },
      include: {
        items: {
          include: { producto: true },
        },
      },
    });

    if (!carrito || carrito.items.length === 0) {
      return res
        .status(400)
        .json({ message: "No tienes productos en el carrito" });
    }

    let pedidoFinal;

    await prisma.$transaction(async (tx) => {
      // ⚠️ Ya NO bloqueamos por stock insuficiente.
      // Si stock baja de 0, se permitirá igualmente.

      for (const item of carrito.items) {
        await tx.producto.update({
          where: { id: item.productoId },
          data: {
            stock: item.producto.stock - item.cantidad,
          },
        });
      }

      const total = carrito.items.reduce(
        (acc, item) => acc + item.precioUnitario * item.cantidad,
        0
      );

      pedidoFinal = await tx.orden.update({
        where: { id: carrito.id },
        data: {
          estado: "PAID", // o PENDING si luego integrás pasarela
          total,
        },
        include: {
          items: {
            include: {
              producto: true,
            },
          },
        },
      });
    });

    return res.status(201).json(pedidoFinal);
  } catch (err) {
    next(err);
  }
};


export const getMisPedidos = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id || req.userId;

    const pedidos = await prisma.orden.findMany({
      where: {
        usuarioId,
        NOT: { estado: "CART" },
      },
      orderBy: {
        creadoEn: "desc",
      },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
    });

    return res.json(
      pedidos.map((p) => ({
        id: p.id,
        estado: p.estado,
        total: p.total,
        creadoEn: p.creadoEn,
        items: p.items.map((i) => ({
          nombre: i.producto.nombre,
          cantidad: i.cantidad,
          precioUnitario: i.precioUnitario,
        })),
      }))
    );
  } catch (err) {
    next(err);
  }
};

export const getPedidoById = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id || req.userId;
    const { id } = req.params;

    const pedido = await prisma.orden.findFirst({
      where: {
        id,
        usuarioId,
        NOT: { estado: "CART" },
      },
      include: {
        items: {
          include: { producto: true },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    return res.json(pedido);
  } catch (err) {
    next(err);
  }
};
