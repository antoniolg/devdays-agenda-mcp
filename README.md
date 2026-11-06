# La agenda de Dev Days, como servidor MCP

[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=flat&logo=youtube&logoColor=white)](https://www.youtube.com/@devexpert_io)
[![X](https://img.shields.io/badge/X-000000?style=flat&logo=x&logoColor=white)](https://x.com/antonioleivag)
[![devexpert.io](https://img.shields.io/badge/devexpert.io-8957E5?style=flat&logo=googlechrome&logoColor=white)](https://devexpert.io)

El código de la charla **«Lo que Copilot no sabe hacer (todavía): MCP explicado con demos»** (GitHub Dev Days Students Madrid, 6 de noviembre de 2026). Las slides están en [`slides.pdf`](slides.pdf).

Es un servidor MCP pequeño que le da a GitHub Copilot algo que no sabe: la agenda del evento. Tiene dos tools:

| Tool | Qué hace | ¿Escribe? |
|---|---|---|
| `buscar_charlas` | Busca charlas y talleres por tema, ponente o sala | No |
| `guardar_en_mi_agenda` | Guarda una sesión en tu agenda personal (`data/mi-agenda.json`) | Sí: VS Code te pide permiso antes |

Los datos están en `data/agenda.json`. En tu proyecto serían tu base de datos o tu API: el servidor es lo que decide qué puede ver y qué puede cambiar el agente.

## Probarlo

Necesitas Node.js 22.18 o posterior (ejecuta TypeScript sin compilar) y VS Code con GitHub Copilot. Con Copilot Free basta.

```bash
npm install
npm run check   # arranca el servidor como lo hará VS Code y llama a una tool
```

Abre la carpeta en VS Code. El fichero `.mcp.json` declara dos servidores. Es el formato que lee el motor de agentes de Copilot desde VS Code 1.143; si vienes de `.vscode/mcp.json`, VS Code te ofrece migrarlo:

- `agenda-devdays`: este, que VS Code arranca con `node src/server.ts`.
- `context7`: documentación actualizada de librerías, para que Copilot no programe con la API que aprendió en su entrenamiento.

Abre el chat de Copilot en modo agente y prueba:

1. ¿Qué charla viene después de la de MCP?
2. Guárdamela en mi agenda.
3. Añade al servidor una tool `charla_actual` que diga qué charla hay a una hora. Mira en Context7 cómo se hace con el SDK actual.
4. ¿Qué charla hay a las 12:50?

Después del paso 3, reinicia el servidor para que Copilot vea la tool nueva: **MCP: List Servers** → `agenda-devdays` → **Restart Server**.

La rama `final` tiene la tool `charla_actual` ya escrita, por si quieres comparar con lo que haga Copilot.

## El SDK

Usa la v2 del SDK de TypeScript (`@modelcontextprotocol/server`), estable desde julio de 2026. Si buscas ejemplos por internet, muchos son de la v1 (`@modelcontextprotocol/sdk` y `server.tool()`), que ya no existe en la v2. Justo por eso viene bien Context7.
