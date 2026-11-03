// Función de Netlify que devuelve la foto de fondo de la página.
//   GET /api/foto
// La foto está guardada en netlify/datos/foto.mjs (se cambia con herramientas/cambiar-foto.mjs).

import { FOTO_BASE64 } from "../datos/foto.mjs";

let bytes = null;

function tipoDeImagen(b) {
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45) return "image/webp";
  return "image/jpeg";
}

export default async (req) => {
  if (!bytes) bytes = Buffer.from(FOTO_BASE64, "base64");
  return new Response(bytes, {
    status: 200,
    headers: { "content-type": tipoDeImagen(bytes), "cache-control": "public, max-age=86400" },
  });
};

export const config = { path: "/api/foto" };
