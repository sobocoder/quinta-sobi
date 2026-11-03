// Función de Netlify que devuelve la foto de fondo, solo a quien tiene la clave de la familia.
//   GET /api/foto  (con el header "x-clave")
// La foto está guardada dentro del proyecto (netlify/datos/foto.mjs) y no en public/,
// así no la puede abrir cualquiera que tenga el link de la página.

import { FOTO_BASE64 } from "../datos/foto.mjs";
import { verificarClave } from "../lib/clave.mjs";

let bytes = null;

function tipoDeImagen(b) {
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45) return "image/webp";
  return "image/jpeg";
}

export default async (req) => {
  const rechazo = verificarClave(req);
  if (rechazo) return rechazo;
  if (!bytes) bytes = Buffer.from(FOTO_BASE64, "base64");
  return new Response(bytes, {
    status: 200,
    headers: { "content-type": tipoDeImagen(bytes), "cache-control": "private, max-age=604800" },
  });
};

export const config = { path: "/api/foto" };
