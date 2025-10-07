export * from "@autointel/core";
export * as Core from "@autointel/core";
export * as CSV from "./connectors/csv";
export * as Excel from "./connectors/excel";
export * as Sheets from "./connectors/sheets";
export * as PDF from "@autointel/pdf";
export * as Postgres from "@autointel/postgres";
export * as SQLite from "@autointel/sqllite";
export * as Text from "@autointel/text";
export * as MongoDB from "@autointel/mongodb";
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
