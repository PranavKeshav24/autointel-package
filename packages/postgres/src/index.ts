import { DataSet } from "@auto-intel/core";

export interface PostgresQueryOptions {}

export async function queryPostgres(
  _conn: unknown,
  _sql: string,
  _options?: PostgresQueryOptions
): Promise<DataSet> {
  throw new Error("Postgres tool not implemented: abstract stub");
}
