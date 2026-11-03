// Cambia la foto de fondo de la página.
// Uso (desde la carpeta del proyecto):  node herramientas/cambiar-foto.mjs ruta/a/la-foto.jpg
// Después hay que volver a publicar. Sirve JPG, PNG o WebP; mejor si pesa menos de 1 MB.

import { readFileSync, writeFileSync } from "node:fs";

const ruta = process.argv[2];
if (!ruta) {
  console.error("Uso: node herramientas/cambiar-foto.mjs ruta/a/la-foto.jpg");
  process.exit(1);
}
const datos = readFileSync(ruta);
if (datos.length > 4 * 1024 * 1024) {
  console.error("La foto pesa más de 4 MB. Achicala un poco y probá de nuevo.");
  process.exit(1);
}
const destino = new URL("../netlify/datos/foto.mjs", import.meta.url);
writeFileSync(
  destino,
  "// Foto de fondo, en base64. Se genera con: node herramientas/cambiar-foto.mjs ruta/a/la-foto.jpg\n" +
    `export const FOTO_BASE64 =\n  "${datos.toString("base64")}";\n`
);
console.log("Listo, foto cambiada. Volvé a publicar para verla.");
