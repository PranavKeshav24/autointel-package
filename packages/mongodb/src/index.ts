import { DataSet } from "@auto-intel/core";

export interface MongoQueryOptions {}

export async function queryMongo(
  _conn: unknown,
  _collection: string,
  _query: unknown,
  _options?: MongoQueryOptions
): Promise<DataSet> {
  throw new Error("MongoDB tool not implemented: abstract stub");
}
