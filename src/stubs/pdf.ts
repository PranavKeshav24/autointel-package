import { DataSet } from "../core/types";

export function loadPdf(_input: unknown): DataSet {
  return {
    schema: { fields: [], rowCount: 0 },
    rows: [],
    source: { kind: "pdf", name: "stub" },
  };
}


