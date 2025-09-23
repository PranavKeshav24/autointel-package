export * as Core from "@auto-intel/core";
export * as CSV from "./connectors/csv";
export * as Excel from "./connectors/excel";
export * as Sheets from "./connectors/sheets";
export * as PDF from "@auto-intel/pdf";
export * as Postgres from "@auto-intel/postgres";
export * as SQLite from "@auto-intel/sqllite";
export * as Text from "@auto-intel/text";
export * as MongoDB from "@auto-intel/mongodb";
export * as Reporting from "./reporting";

export function createAIConfigFromEnv() {
  const apiKey = process.env.OPENROUTER_API_KEY ?? "";
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is required");
  return {
    apiKey,
    referer: process.env.OPENROUTER_REFERER,
    title: process.env.OPENROUTER_TITLE,
    model: process.env.OPENROUTER_MODEL,
  };
}

export type {
  DataSet,
  VisualizationSpec,
  AnalysisResult,
  OpenRouterConfig,
} from "../packages/core/src/types";
