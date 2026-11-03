// Función de Netlify que guarda y lee las reservas de la quinta en Netlify Blobs.
//
//   GET    /api/reservas           -> { reservas: [...] }
//   PUT    /api/reservas?id=XXXX   -> crea o reemplaza la reserva XXXX (cuerpo JSON)
//   DELETE /api/reservas?id=XXXX   -> borra la reserva XXXX
//
// Cada pedido tiene que traer el header "x-clave" con la clave de la familia
// (variable de entorno CLAVE_QUINTA). Cada reserva es una entrada separada en el
// store "reservas", así dos personas reservando al mismo tiempo no se pisan.

import { getStore } from "@netlify/blobs";
import { responder, verificarClave } from "../lib/clave.mjs";

const FAMILIA = ["juli", "nacho", "gus", "lore", "patri", "nico", "caro", "belu"];
const RE_ID = /^[A-Za-z0-9_-]{6,64}$/;
const RE_DIA = /^\d{4}-\d{2}-\d{2}$/;
const RE_HORA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function problemaCon(d) {
  if (!d || typeof d !== "object" || Array.isArray(d)) return "La reserva tiene que ser un objeto JSON.";
  if (!FAMILIA.includes(d.quien)) return "Falta quién reserva.";
  if (typeof d.diaCompleto !== "boolean") return "Falta indicar si es día completo.";
  const re = d.diaCompleto ? RE_DIA : RE_HORA;
  if (typeof d.inicio !== "string" || typeof d.fin !== "string" || !re.test(d.inicio) || !re.test(d.fin)) return "Las fechas no son válidas.";
  if (d.fin < d.inicio || (!d.diaCompleto && d.fin === d.inicio)) return "La reserva termina antes de empezar.";
  if (d.motivo !== undefined && (typeof d.motivo !== "string" || d.motivo.length > 140)) return "El motivo no es válido (máximo 140 caracteres).";
  return "";
}

export default async (req) => {
  const rechazo = verificarClave(req);
  if (rechazo) return rechazo;

  try {
    const store = getStore({ name: "reservas", consistency: "strong" });

    if (req.method === "GET") {
      const { blobs } = await store.list();
      const reservas = await Promise.all(
        blobs.map(async ({ key }) => {
          const d = await store.get(key, { type: "json" });
          return d && typeof d === "object" ? { ...d, id: key } : null;
        })
      );
      return responder(200, { reservas: reservas.filter(Boolean) });
    }

    const id = new URL(req.url).searchParams.get("id") || "";
    if (!RE_ID.test(id)) return responder(400, { error: "id", mensaje: "Falta un id válido." });

    if (req.method === "PUT") {
      let d;
      try {
        d = await req.json();
      } catch {
        return responder(400, { error: "json", mensaje: "El cuerpo no es JSON válido." });
      }
      const problema = problemaCon(d);
      if (problema) return responder(400, { error: "datos", mensaje: problema });
      const reserva = {
        quien: d.quien,
        diaCompleto: d.diaCompleto,
        inicio: d.inicio,
        fin: d.fin,
        motivo: (d.motivo || "").trim(),
        creado: typeof d.creado === "string" ? d.creado.slice(0, 40) : new Date().toISOString(),
      };
      if (typeof d.editado === "string") reserva.editado = d.editado.slice(0, 40);
      await store.setJSON(id, reserva);
      return responder(200, { ok: true, id });
    }

    if (req.method === "DELETE") {
      await store.delete(id);
      return responder(200, { ok: true });
    }

    return responder(405, { error: "metodo", mensaje: "Método no permitido." });
  } catch (e) {
    console.error(e);
    return responder(500, { error: "interno", mensaje: "Error del servidor al acceder a las reservas." });
  }
};

export const config = { path: "/api/reservas" };
