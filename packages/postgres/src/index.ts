import { helloCore } from "@auto-intel/core";

export function connectPostgres(): string {
  return `postgres uses core: ${helloCore()}`;
}
