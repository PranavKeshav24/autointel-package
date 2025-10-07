import { DataSet } from "../core/types";

export function loadText(_text: string): DataSet {
  return {
    schema: { fields: [], rowCount: 0 },
    rows: [],
    source: { kind: "text", name: "stub" },
  };
}


