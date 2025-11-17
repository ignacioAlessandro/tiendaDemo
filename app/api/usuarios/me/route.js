// app/api/usuarios/me/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth"; // si tienes implementado, sino ajusta

export async function GET() {
  try {
    // Si tenés getCurrentUser (NextAuth / custom), úsalo
    if (typeof getCurrentUser === "function") {
      const user = await getCurrentUser();
      if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
      return NextResponse.json({ user }, { status: 200 });
    }
    // Si no hay auth implementado aún, devolvemos 401 (forzá login)
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
}
