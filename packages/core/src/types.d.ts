export type Primitive = string | number | boolean | null | Date;
export type RecordData = Record<string, Primitive>;
export interface InferredFieldSchema {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "null" | "mixed";
    example?: Primitive;
}
export interface DataSchema {
    fields: InferredFieldSchema[];
    rowCount: number;
}
export interface DataSet {
    schema: DataSchema;
    rows: RecordData[];
    source: {
        kind: "csv" | "excel" | "sheets" | "pdf" | "postgres" | "sqlite" | "text" | "mongodb" | "unknown";
        name?: string;
        meta?: Record<string, unknown>;
    };
}
export interface VisualizationSpec {
    id: string;
    title: string;
    description?: string;
    vegaLiteSpec: Record<string, unknown>;
}
export interface AnalysisResult {
    answer: string;
    selectedVisualizations: VisualizationSpec[];
    suggestedFollowUps?: string[];
    report?: string;
}
export interface DataToolContext {
    dataset: DataSet;
    userQuery: string;
    selection?: {
        includeCharts?: string[];
        excludeCharts?: string[];
    };
}
export interface DataTool {
    name: string;
    supports: (dataset: DataSet) => boolean;
    run: (context: DataToolContext) => Promise<AnalysisResult>;
}
export interface AIClientMessage {
    role: "system" | "user" | "assistant";
    content: string;
}
export interface AIClientResponseChoice {
    role: "assistant";
    content: string;
}
export interface AIClientResponse {
    choices: AIClientResponseChoice[];
}
export interface OpenRouterConfig {
    apiKey: string;
    referer?: string;
    title?: string;
    model?: string;
}
export interface AgentPlanStep {
    tool: string;
    reason: string;
}
export interface AgentPlan {
    steps: AgentPlanStep[];
}
