export * as Core from "@auto-intel/core";
export * as CSV from "@auto-intel/csv";
export * as Excel from "@auto-intel/excel";
export * as Sheets from "@auto-intel/sheets";
export * as PDF from "@auto-intel/pdf";
export * as Postgres from "@auto-intel/postgres";
export * as SQLite from "@auto-intel/sqllite";
export * as Text from "@auto-intel/text";
export * as MongoDB from "@auto-intel/mongodb";

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
