import { helloCore } from "@auto-intel/core";

export function connectMongo(): string {
  return `mongodb uses core: ${helloCore()}`;
}
