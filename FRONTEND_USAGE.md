# AutoIntel Frontend Integration Guide

## Install

Install the published `autointel-package` from npm (or your registry).

Install peer/host dependencies in your app (renderer and parsers):

```bash
npm i autointel-package papaparse xlsx vega-embed
```

## Configure OpenRouter

Set your API key in the environment used to build/serve your app:

- Vite/Next: define `OPENROUTER_API_KEY` in server-side env. Do not expose keys to the browser unless you proxy requests.
- If you must run in-browser, ensure proper domain restrictions in OpenRouter and understand the security trade-offs.

Recommended env variables (defaults to GPT-OSS model if not set):

```bash
OPENROUTER_API_KEY=your_key_here
OPENROUTER_REFERER=http://localhost:3000
OPENROUTER_TITLE=AutoIntel Dev
OPENROUTER_MODEL=openai/gpt-oss-120b:free
```

## Basic Flow

1. Get a dataset from a file or URL
2. Run the agent to generate insights and charts
3. Render Vega-Lite specs in your UI

### CSV (browser File input)

```ts
import { CSV, Core } from "autointel-package";

async function handleCsv(file: File) {
  const dataset = await CSV.loadCsvFromBlob(file, file.name);
  const aiConfig = {
    apiKey: import.meta.env.OPENROUTER_API_KEY,
    model: "openai/gpt-oss-120b:free",
  };
  const result = await Core.runAgent(dataset, "Summarize key trends", aiConfig);
  // result.selectedVisualizations contains Vega-Lite specs
}
```

### Excel (XLSX/XLS, browser File input)

```ts
import { Excel, Core } from "autointel-package";

async function handleExcel(file: File) {
  const dataset = await Excel.loadExcelFromBlob(file, { name: file.name });
  const aiConfig = {
    apiKey: import.meta.env.OPENROUTER_API_KEY,
    model: "openai/gpt-oss-120b:free",
  };
  const result = await Core.runAgent(
    dataset,
    "Find anomalies by month",
    aiConfig
  );
}
```

### Google Sheets (public CSV export)

```ts
import { Sheets, Core } from "autointel-package";

async function handleSheet(sheetId: string, gid: string) {
  const url = Sheets.csvExportUrlFromIds(sheetId, gid);
  const dataset = await Sheets.loadGoogleSheetCsvByUrl(url);
  const aiConfig = {
    apiKey: import.meta.env.OPENROUTER_API_KEY,
    model: "openai/gpt-oss-120b:free",
  };
  const result = await Core.runAgent(
    dataset,
    "What categories grew the most?",
    aiConfig
  );
}
```

## Rendering Visualizations (Vega-Lite)

Use a Vega-Lite React component or vanilla embed. Each `VisualizationSpec` has a `vegaLiteSpec` ready to render.

```ts
import { VisualizationSpec } from "autointel-package";
import embed from "vega-embed";

function render(spec: VisualizationSpec, el: HTMLElement) {
  embed(el, spec.vegaLiteSpec);
}
```

## Selecting charts

Pass include/exclude ids to `runAgent` to control which charts are returned.

```ts
const result = await Core.runAgent(dataset, question, aiConfig, [], {
  includeCharts: ["metric_over_x_1"],
});
```

## Report

`result.report` contains Markdown summarizing the answer, schema, and chart specs.

## Types

Useful types are re-exported from the root: `DataSet`, `VisualizationSpec`, `AnalysisResult`.
> Note: PDF, Postgres, SQLite, Text, MongoDB are currently stubbed and return empty datasets. APIs are present for future compatibility.

## Optional: Proxy calls via Next.js API Route (recommended)

```ts
// pages/api/ai.ts
export default async function handler(req, res) {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.OPENROUTER_REFERER,
      "X-Title": process.env.OPENROUTER_TITLE,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });
  const data = await resp.json();
  res.status(resp.status).json(data);
}
```
