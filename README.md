# AutoIntel Monorepo

AI-powered data analysis and reporting across multiple data sources (CSV, Excel, Google Sheets, and more).

## Packages

- `@auto-intel/core`: types, preprocessing, visualization, agent, OpenRouter client
- `src/connectors`: frontend-ready connectors (CSV/Excel/Sheets)
- Others (pdf, postgres, sqlite, text, mongodb): abstract stubs

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
# install dependencies (workspace-aware)
npm install

# build all packages
npm run build
```

## Development

- Build a single package:

```bash
npm run build --workspace @auto-intel/core
```

- Watch-mode (example using ts-node-dev or nodemon - add as needed):

```bash
# not configured by default; install if desired
```

## Testing

```bash
npm test
```

## Environment (OpenRouter)

Set `OPENROUTER_API_KEY` in your environment for the agent to call OpenRouter.

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

## Using Locally in a Frontend App

- Publish or link this package into your frontend.
- Ensure peer deps in your app: `papaparse`, `xlsx`, and a Vega-Lite renderer (e.g., `vega-embed`).
- See `FRONTEND_USAGE.md` for detailed integration examples (CSV/Excel/Sheets and Vega-Lite rendering).

## Frontend API Surface

- Connectors: `src/connectors/{csv,excel,sheets}.ts`
  - CSV: `loadCsvFromBlob(file)`, `loadCsvFromString(text)`
  - Excel: `loadExcelFromBlob(file, { sheet?, name? })`
  - Sheets: `csvExportUrlFromIds(sheetId, gid)`, `loadGoogleSheetCsvByUrl(url)`
- Core agent: `Core.runAgent(dataset, userQuery, aiConfig, tools?, { includeCharts?, excludeCharts?, title? })`
- Visualizations: `Core.suggestVisualizations(dataset)` → Vega-Lite specs
- Reporting: `src/reporting` → `buildMarkdownReport`

## Release

- Ensure `npm run build` passes
- Publish from the monorepo root or per-package as needed
