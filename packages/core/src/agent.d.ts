import { AnalysisResult, DataSet, DataTool, OpenRouterConfig } from "./types";
export declare function runAgent(dataset: DataSet, userQuery: string, aiConfig: OpenRouterConfig, tools?: DataTool[], options?: {
    includeCharts?: string[];
    excludeCharts?: string[];
    title?: string;
}): Promise<AnalysisResult>;
