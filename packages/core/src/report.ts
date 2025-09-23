import { DataSet, VisualizationSpec } from "./types";

export function buildMarkdownReport(
  title: string,
  dataset: DataSet,
  charts: VisualizationSpec[],
  answer?: string
): string {
  const lines: string[] = [];
  lines.push(`# ${title}`);
  if (answer) {
    lines.push("");
    lines.push(answer);
  }
  lines.push("");
  lines.push(`Rows: ${dataset.schema.rowCount}`);
  lines.push("## Schema");
  for (const f of dataset.schema.fields) {
    lines.push(
      `- ${f.name}: ${f.type}${
        f.example !== undefined ? ` (e.g., ${String(f.example)})` : ""
      }`
    );
  }
  if (charts.length) {
    lines.push("\n## Visualizations");
    charts.forEach((c) => {
      lines.push(`\n### ${c.title}`);
      lines.push("````json");
      lines.push(JSON.stringify(c.vegaLiteSpec, null, 2));
      lines.push("````");
    });
  }
  return lines.join("\n");
}
