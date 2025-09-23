import Papa from "papaparse";
import { DataSet, RecordData } from "../../core/src/types";
import { normalizeRows, inferSchema } from "../../core/src/preprocess";

function toRows(csvText: string): RecordData[] {
  const parsed = Papa.parse(csvText, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
  });
  if (parsed.errors?.length) {
    const first = parsed.errors[0];
    throw new Error(`CSV parse error at row ${first.row}: ${first.message}`);
  }
  return parsed.data as unknown[] as RecordData[];
}

export function loadCsvFromString(csvText: string, name?: string): DataSet {
  const rawRows = toRows(csvText);
  const rows = normalizeRows(rawRows);
  const schema = inferSchema(rows);
  return { schema, rows, source: { kind: "csv", name } };
}

export async function loadCsvFromBlob(
  blob: Blob,
  name?: string
): Promise<DataSet> {
  const text = await blob.text();
  return loadCsvFromString(text, name);
}
