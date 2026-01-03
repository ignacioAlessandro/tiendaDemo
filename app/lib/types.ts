// app/lib/types.ts

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Producto = {
  id: string;
  nombre: string;
  descripcion?: string;
  precioCentavos: number;
  imagenUrl?: string;
  stock: number;
  categoria?: {
    id: string;
    nombre: string;
  };
  subcategoria?: {
    id: string;
    nombre: string;
  };
};

export type CarritoItem = {
  id: string;
  producto: Producto;
  cantidad: number;
  precioUnitarioCentavos: number;
  subtotalCentavos: number;
};

export type Carrito = {
  id: string; // id de Orden con estado CART
  items: CarritoItem[];
  totalCentavos: number;
};

export type Pedido = {
  id: string;
  estado: "CART" | "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  totalCentavos: number;
  createdAt: string;
  updatedAt: string;
  items?: CarritoItem[]; // si el backend incluye items
};
