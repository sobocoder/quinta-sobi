// Ayudas compartidas por las funciones: respuestas JSON y control de la clave de la familia.
// La clave se configura en Netlify como variable de entorno CLAVE_QUINTA.

export const responder = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

function claveConfigurada() {
  try {
    const v = globalThis.Netlify?.env?.get("CLAVE_QUINTA");
    if (v) return v;
  } catch {
    /* sin objeto Netlify: usamos process.env */
  }
  return process.env.CLAVE_QUINTA || "";
}

// Compara sin cortar en la primera diferencia, para no dar pistas por el tiempo de respuesta.
function iguales(a, b) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

// Devuelve una respuesta de error si la clave falta o no coincide; si está todo bien, null.
export function verificarClave(req) {
  const clave = claveConfigurada();
  if (!clave) {
    return responder(500, { error: "sin-clave", mensaje: "Falta configurar la variable CLAVE_QUINTA en Netlify." });
  }
  // La página manda la clave con encodeURIComponent para poder usar tildes o ñ.
  let enviada = "";
  try {
    enviada = decodeURIComponent(req.headers.get("x-clave") || "");
  } catch {
    enviada = "";
  }
  if (!iguales(enviada, clave)) return responder(401, { error: "clave", mensaje: "Clave incorrecta." });
  return null;
}
