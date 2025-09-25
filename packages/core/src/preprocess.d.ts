import { DataSchema, RecordData } from "./types";
export declare function normalizeRows(rows: RecordData[]): RecordData[];
export declare function inferSchema(rows: RecordData[]): DataSchema;
