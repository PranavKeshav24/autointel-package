import { DataSet } from "../core/types";

export function queryMongoDB(_conn: unknown, _collection: string): Promise<DataSet> {
  return Promise.resolve({
    schema: { fields: [], rowCount: 0 },
    rows: [],
    source: { kind: "mongodb", name: "stub" },
  });
}


