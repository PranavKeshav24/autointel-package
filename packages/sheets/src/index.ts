import { DataSet } from "../../core/src/types";
import { loadCsvFromString } from "@autointel/csv";

// Expects a public Google Sheets CSV export URL or constructs one from id + gid
export async function loadGoogleSheetCsvByUrl(
  url: string,
  name?: string
): Promise<DataSet> {
  const resp = await fetch(url, { cache: "no-store" });
  if (!resp.ok)
    throw new Error(`Failed to fetch Google Sheet CSV: ${resp.status}`);
  const text = await resp.text();
  const ds = loadCsvFromString(text, name ?? url);
  return { ...ds, source: { ...ds.source, kind: "sheets", name: name ?? url } };
}

export function csvExportUrlFromIds(
  sheetId: string,
  gid: string | number
): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&id=${sheetId}&gid=${gid}`;
}
