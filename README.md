# Tienda-demo (ZIP entregado)
Proyecto demo listo para ejecutar en local. Sigue las instrucciones en el archivo README dentro del ZIP y en la conversación para configurar variables de entorno (MercadoPago sandbox y Gmail app password si querés probar emails).

## Resumen rápido para ejecutar
1. Extrae el ZIP en tu escritorio (por ejemplo `C:\Users\<tu>\Desktop\tienda-demo`).
2. Abre VS Code en esa carpeta (`code .` desde PowerShell) o abre una terminal en esa carpeta.
3. Copia `.env.example` a `.env` y rellena las variables (lee la conversación para pasos detallados).
4. Ejecuta `npm install`.
5. (Opcional) Ejecuta `npx prisma generate` y `npx prisma migrate dev --name init` para crear la base de datos SQLite.
6. Ejecuta `npm run dev` y abre http://localhost:3000
