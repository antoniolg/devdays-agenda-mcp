// Comprobación rápida antes de la demo: arranca el servidor como lo haría VS Code (stdio),
// lista las tools y llama a buscar_charlas. No escribe en tu agenda personal.
//   npm run check
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import assert from "node:assert/strict";

const client = new Client({ name: "check", version: "1.0.0" });
await client.connect(new StdioClientTransport({ command: "node", args: ["src/server.ts"] }));

const { tools } = await client.listTools();
const nombres = tools.map((t) => t.name);
console.log("tools:", nombres.join(", "));
assert.ok(nombres.includes("buscar_charlas"));
assert.ok(nombres.includes("guardar_en_mi_agenda"));

const resultado = await client.callTool({ name: "buscar_charlas", arguments: { texto: "contexto" } });
const [primero] = resultado.content as { type: string; text: string }[];
const sesiones = JSON.parse(primero.text) as { id: string; titulo: string }[];
console.log("buscar_charlas «contexto»:", sesiones.map((s) => s.titulo));
assert.equal(sesiones[0]?.id, "1105-de-prompts-a-contexto");

const error = await client.callTool({ name: "guardar_en_mi_agenda", arguments: { id: "no-existe" } });
assert.equal(error.isError, true);

await client.close();
console.log("OK");
