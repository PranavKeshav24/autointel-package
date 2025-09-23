import { helloCore } from "@auto-intel/core";

export function connectSheets(): string {
  return `sheets uses core: ${helloCore()}`;
}
