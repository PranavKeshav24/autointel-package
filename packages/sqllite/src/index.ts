import { helloCore } from "@auto-intel/core";

export function connectSqlite(): string {
  return `sqllite uses core: ${helloCore()}`;
}
