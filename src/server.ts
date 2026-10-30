// Servidor MCP con la agenda de GitHub Dev Days Students Madrid (6 de noviembre de 2026).
// VS Code lo arranca con `node src/server.ts` y habla con él por stdio: mira .vscode/mcp.json.
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { buscarCharlas, guardarEnMiAgenda } from "./agenda.ts";

const json = (datos: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(datos, null, 2) }] });

function crearServidor() {
  const server = new McpServer({ name: "agenda-devdays", version: "1.0.0" });

  server.registerTool(
    "buscar_charlas",
    {
      description:
        "Busca charlas y talleres en la agenda de GitHub Dev Days Students " +
        "Madrid (6 de noviembre de 2026). Úsala para preguntas sobre horarios, " +
        "temas, salas o ponentes. Devuelve id, horas, sala, título y ponentes " +
        "de cada sesión; sin texto, la agenda completa.",
      inputSchema: z.object({
        texto: z.string().optional().describe("Qué buscar: «contexto», «Raúl», «taller»…"),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ texto }) => json(await buscarCharlas(texto)),
  );

  server.registerTool(
    "guardar_en_mi_agenda",
    {
      description:
        "Guarda una sesión en la agenda personal del usuario. " +
        "Úsala solo cuando pida guardar una charla o apuntarse. " +
        "Necesita el id que devuelve buscar_charlas.",
      inputSchema: z.object({
        id: z.string().describe("El id que devuelve buscar_charlas"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ id }) => json(await guardarEnMiAgenda(id)),
  );

  return server;
}

serveStdio(crearServidor);
