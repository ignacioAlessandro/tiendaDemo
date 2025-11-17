// app/api/productos/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;
  const prod = await prisma.producto.findUnique({ where: { id: Number(id) }});
  if (!prod) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(prod);
}
