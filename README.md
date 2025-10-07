# AutoIntel Package

AI-powered data analysis and reporting across multiple data sources (CSV, Excel, Google Sheets, and more).

## Structure

- `src/core`: types, preprocessing, visualization, agent, OpenRouter client
- `src/connectors`: frontend-ready connectors (CSV/Excel/Sheets)
- `src/reporting`: reporting helpers
- `src/stubs`: temporary stubs (pdf, postgres, sqlite, text, mongodb)

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
npm install
npm run build
```

## Development

- Dev script runs `src/index.ts` with nodemon. Adjust as needed.

## Testing

```bash
npm test
```

## Environment (OpenRouter)

Set `OPENROUTER_API_KEY` to enable agent calls to OpenRouter.

Windows PowerShell:

```powershell
$env:OPENROUTER_API_KEY="your_api_key_here"
```

Persist for future sessions:

```powershell
setx OPENROUTER_API_KEY "your_api_key_here"
```

Optional:

- `OPENROUTER_REFERER`
- `OPENROUTER_TITLE`
- `OPENROUTER_MODEL`

## Frontend Usage

- Install `autointel-package` plus `papaparse`, `xlsx`, and a Vega-Lite renderer (e.g., `vega-embed`).
- See `FRONTEND_USAGE.md` for examples.

## API Surface

- Connectors: `CSV`, `Excel`, `Sheets`
- Core: `Core.runAgent`, preprocessing, visualization
- Reporting: `Reporting.buildMarkdownReport`, `Reporting.suggestVisualizations`

## Release

- Ensure `npm run build` passes
- Publish from root as a single package: `npm publish`
