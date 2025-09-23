import * as XLSX from "xlsx";
import { DataSet, RecordData } from "../../packages/core/src/types";
import { normalizeRows, inferSchema } from "../../packages/core/src/preprocess";

export async function loadExcelFromBlob(
  blob: Blob,
  options?: { sheet?: string | number; name?: string }
): Promise<DataSet> {
  const buffer = await blob.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheetName =
    typeof options?.sheet === "number"
      ? wb.SheetNames[options.sheet]
      : options?.sheet ?? wb.SheetNames[0];
  if (!sheetName) throw new Error("No sheet found in workbook");
  const ws = wb.Sheets[sheetName];
  const array = XLSX.utils.sheet_to_json<RecordData>(ws, { defval: null });
  const rows = normalizeRows(array);
  const schema = inferSchema(rows);
  return {
    schema,
    rows,
    source: { kind: "excel", name: options?.name ?? sheetName },
  };
}
