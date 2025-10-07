// import { DataSet } from "@auto-intel/core";

export interface PdfToolConfig {}

export async function loadPdf(
  _pathOrBuffer: unknown,
  _config?: PdfToolConfig
): Promise<any> {
  throw new Error("PDF tool not implemented: abstract stub");
}
