// import { DataSet } from "@auto-intel/core";

export interface SqliteQueryOptions {}

export async function querySqlite(
  _db: unknown,
  _sql: string,
  _options?: SqliteQueryOptions
): Promise<any> {
  throw new Error("SQLite tool not implemented: abstract stub");
}
