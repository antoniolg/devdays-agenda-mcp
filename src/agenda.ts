// Los datos del servidor: la agenda del evento y la agenda personal de quien lo usa.
// Aquí son dos ficheros JSON; en tu proyecto serían tu base de datos o tu API.
import { readFile, writeFile } from "node:fs/promises";

export type Sesion = {
  id: string;
  inicio: string;
  fin: string;
  sala: string;
  tipo: "charla" | "taller" | "otro";
  titulo: string;
  ponentes: string[];
};

const AGENDA = new URL("../data/agenda.json", import.meta.url);
const MI_AGENDA = new URL("../data/mi-agenda.json", import.meta.url);

const leerAgenda = async (): Promise<Sesion[]> => JSON.parse(await readFile(AGENDA, "utf8"));

// Sin tildes ni mayúsculas, para que «tecnica» encuentre «Técnica».
const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Las sesiones cuyo título, ponentes, sala o tipo contienen el texto. Sin texto, todas. */
export async function buscarCharlas(texto?: string): Promise<Sesion[]> {
  const agenda = await leerAgenda();
  if (!texto?.trim()) return agenda;
  const buscado = normalizar(texto.trim());
  return agenda.filter((s) => normalizar([s.titulo, ...s.ponentes, s.sala, s.tipo].join(" ")).includes(buscado));
}

/** Añade la sesión a data/mi-agenda.json y devuelve la agenda personal completa. */
export async function guardarEnMiAgenda(id: string): Promise<Sesion[]> {
  const agenda = await leerAgenda();
  const sesion = agenda.find((s) => s.id === id);
  if (!sesion) throw new Error(`No hay ninguna sesión con id «${id}». Usa buscar_charlas para ver los ids.`);

  let ids: string[] = [];
  try {
    ids = JSON.parse(await readFile(MI_AGENDA, "utf8"));
  } catch {
    // Todavía no hay agenda personal.
  }
  if (!ids.includes(id)) ids.push(id);
  await writeFile(MI_AGENDA, JSON.stringify(ids, null, 2) + "\n");

  return agenda.filter((s) => ids.includes(s.id));
}
