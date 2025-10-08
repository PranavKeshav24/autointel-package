import {
  type DataSet,
  type AnalysisResult,
  type AIClientMessage,
  type OpenRouterConfig,
  type DataTool,
  type DataToolContext,
} from "./types";
import { suggestVisualizations, selectVisualizations } from "./visualize";
import { buildMarkdownReport } from "./report";
import { openRouterChat } from "./ai";

function schemaToText(dataset: DataSet): string {
  const lines: string[] = [];
  lines.push(`Rows: ${dataset.schema.rowCount}`);
  for (const f of dataset.schema.fields) {
    lines.push(
      `- ${f.name}: ${f.type}${
        f.example !== undefined ? ` (e.g., ${String(f.example)})` : ""
      }`
    );
  }
  return lines.join("\n");
}

export async function runAgent(
  dataset: DataSet,
  userQuery: string,
  aiConfig: OpenRouterConfig,
  tools: DataTool[] = [],
  options?: {
    includeCharts?: string[];
    excludeCharts?: string[];
    title?: string;
  }
): Promise<AnalysisResult> {
  const allCharts = suggestVisualizations(dataset);
  const charts = selectVisualizations(
    allCharts,
    options?.includeCharts,
    options?.excludeCharts
  );

  const systemPrompt = `You are AutoIntel, a data analysis agent. You are given a dataset schema and a user question. Provide a precise, data-grounded answer. If useful, refer to chart ideas but do not fabricate data. Prefer concise, actionable insights.`;

  const contextText = schemaToText(dataset);
  const messages: AIClientMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Question:\n${userQuery}\n\nDataset Summary:\n${contextText}`,
    },
  ];
  const ai = await openRouterChat(messages, aiConfig);
  const answer = (ai as any)?.choices?.[0]?.content || (ai as any)?.choices?.[0]?.message?.content || "";

  let toolResult: AnalysisResult | undefined;
  for (const tool of tools) {
    if (tool.supports(dataset)) {
      const ctx: DataToolContext = {
        dataset,
        userQuery,
        selection: {
          includeCharts: options?.includeCharts,
          excludeCharts: options?.excludeCharts,
        },
      };
      try {
        toolResult = await tool.run(ctx);
        break;
      } catch {
        // fall back to LLM-only result
      }
    }
  }

  const mergedAnswer = toolResult?.answer
    ? `${answer}\n\nTool insight:\n${toolResult.answer}`
    : answer;
  const selectedVisualizations = toolResult?.selectedVisualizations?.length
    ? toolResult.selectedVisualizations
    : charts;
  const report = buildMarkdownReport(
    options?.title ?? "AutoIntel Report",
    dataset,
    selectedVisualizations,
    mergedAnswer
  );

  return {
    answer: mergedAnswer,
    selectedVisualizations,
    suggestedFollowUps: toolResult?.suggestedFollowUps,
    report,
  };
}


