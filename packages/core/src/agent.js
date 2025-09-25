"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgent = runAgent;
const visualize_1 = require("./visualize");
const report_1 = require("./report");
const ai_1 = require("./ai");
function schemaToText(dataset) {
    const lines = [];
    lines.push(`Source: ${dataset.source.kind}${dataset.source.name ? ` (${dataset.source.name})` : ""}`);
    lines.push(`Rows: ${dataset.schema.rowCount}`);
    lines.push("Fields:");
    dataset.schema.fields.forEach((f) => {
        lines.push(`- ${f.name}: ${f.type}${f.example !== undefined ? ` (e.g., ${String(f.example)})` : ""}`);
    });
    return lines.join("\n");
}
async function runAgent(dataset, userQuery, aiConfig, tools = [], options) {
    const allCharts = (0, visualize_1.suggestVisualizations)(dataset);
    const charts = (0, visualize_1.selectVisualizations)(allCharts, options?.includeCharts, options?.excludeCharts);
    const systemPrompt = `You are AutoIntel, a data analysis agent. You are given a dataset schema and a user question. Provide a precise, data-grounded answer. If useful, refer to chart ideas but do not fabricate data. Prefer concise, actionable insights.`;
    const contextText = schemaToText(dataset);
    const messages = [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: `Question:\n${userQuery}\n\nDataset Summary:\n${contextText}`,
        },
    ];
    const ai = await (0, ai_1.openRouterChat)(messages, aiConfig);
    const answer = ai.choices?.[0]?.content ?? "";
    // Tool routing (simple pass: pick first supporting tool)
    let toolResult;
    for (const tool of tools) {
        if (tool.supports(dataset)) {
            const ctx = {
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
            }
            catch {
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
    const report = (0, report_1.buildMarkdownReport)(options?.title ?? "AutoIntel Report", dataset, selectedVisualizations, mergedAnswer);
    return {
        answer: mergedAnswer,
        selectedVisualizations,
        suggestedFollowUps: toolResult?.suggestedFollowUps,
        report,
    };
}
//# sourceMappingURL=agent.js.map