import { DataSet } from "../core/types";

export function querySQLite(_db: unknown, _sql: string): Promise<DataSet> {
  return Promise.resolve({
    schema: { fields: [], rowCount: 0 },
    rows: [],
    source: { kind: "sqlite", name: "stub" },
  });
}


