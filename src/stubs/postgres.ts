import { DataSet } from "../core/types";

export function queryPostgres(_conn: unknown, _sql: string): Promise<DataSet> {
  return Promise.resolve({
    schema: { fields: [], rowCount: 0 },
    rows: [],
    source: { kind: "postgres", name: "stub" },
  });
}


