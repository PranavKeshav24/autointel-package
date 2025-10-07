import {
  DataSchema,
  InferredFieldSchema,
  Primitive,
  RecordData,
} from "./types";

function inferValueType(value: Primitive): InferredFieldSchema["type"] {
  if (value === null) return "null";
  if (value instanceof Date && !isNaN(value.valueOf())) return "date";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "string") {
    const s = value as string;
    const num = Number(s);
    if (s.trim() !== "" && Number.isFinite(num)) return "number";
    const d = new Date(s);
    if (!isNaN(d.valueOf())) return "date";
    return "string";
  }
  return "mixed";
}

export function normalizeRows(rows: RecordData[]): RecordData[] {
  return rows.map((row) => {
    const normalized: RecordData = {};
    for (const key of Object.keys(row)) {
      const val = row[key] as Primitive | undefined;
      if (typeof val === "string") {
        const s: string = val;
        const trimmed: string = s.trim();
        if (trimmed === "") {
          normalized[key] = null;
          continue;
        }
        const num = Number(trimmed);
        if (Number.isFinite(num)) {
          normalized[key] = num;
          continue;
        }
        const d = new Date(trimmed);
        if (!isNaN(d.valueOf())) {
          normalized[key] = d;
          continue;
        }
        normalized[key] = trimmed;
      } else if (val instanceof Date) {
        normalized[key] = val;
      } else if (
        typeof val === "number" ||
        typeof val === "boolean" ||
        val === null
      ) {
        normalized[key] = val as Primitive;
      } else {
        const coerced = (val as any)?.toString?.();
        normalized[key] = (coerced as Primitive) ?? null;
      }
    }
    return normalized;
  });
}

export function inferSchema(rows: RecordData[]): DataSchema {
  const fieldNames = new Set<string>();
  rows.forEach((r) => Object.keys(r).forEach((k) => fieldNames.add(k)));
  const fields: InferredFieldSchema[] = [];
  for (const name of fieldNames) {
    const examples: Primitive[] = [];
    const types = new Set<InferredFieldSchema["type"]>();
    for (const row of rows) {
      const v = row[name] ?? null;
      const t = inferValueType(v as Primitive);
      types.add(t);
      if (examples.length < 3 && v !== undefined) examples.push(v as Primitive);
    }
    let type: InferredFieldSchema["type"] = "mixed";
    if (types.size === 1) type = [...types][0];
    else if (types.size === 2 && types.has("null")) {
      type = [...types].find(
        (t) => t !== "null"
      ) as InferredFieldSchema["type"];
    }
    fields.push({ name, type, example: examples[0] });
  }
  return { fields, rowCount: rows.length };
}


