"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRows = normalizeRows;
exports.inferSchema = inferSchema;
function inferValueType(value) {
    if (value === null)
        return "null";
    if (value instanceof Date && !isNaN(value.valueOf()))
        return "date";
    if (typeof value === "number")
        return "number";
    if (typeof value === "boolean")
        return "boolean";
    if (typeof value === "string") {
        const s = value;
        const num = Number(s);
        if (s.trim() !== "" && Number.isFinite(num))
            return "number";
        const d = new Date(s);
        if (!isNaN(d.valueOf()))
            return "date";
        return "string";
    }
    return "mixed";
}
function normalizeRows(rows) {
    return rows.map((row) => {
        const normalized = {};
        for (const key of Object.keys(row)) {
            const val = row[key];
            if (typeof val === "string") {
                const s = val;
                const trimmed = s.trim();
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
            }
            else if (val instanceof Date) {
                normalized[key] = val;
            }
            else if (typeof val === "number" ||
                typeof val === "boolean" ||
                val === null) {
                normalized[key] = val;
            }
            else {
                // leave as-is but coerce to string or null
                const coerced = val?.toString?.();
                normalized[key] = coerced ?? null;
            }
        }
        return normalized;
    });
}
function inferSchema(rows) {
    const fieldNames = new Set();
    rows.forEach((r) => Object.keys(r).forEach((k) => fieldNames.add(k)));
    const fields = [];
    for (const name of fieldNames) {
        const examples = [];
        const types = new Set();
        for (const row of rows) {
            const v = row[name] ?? null;
            const t = inferValueType(v);
            types.add(t);
            if (examples.length < 3 && v !== undefined)
                examples.push(v);
        }
        let type = "mixed";
        if (types.size === 1)
            type = [...types][0];
        else if (types.size === 2 && types.has("null")) {
            type = [...types].find((t) => t !== "null");
        }
        fields.push({ name, type, example: examples[0] });
    }
    return { fields, rowCount: rows.length };
}
//# sourceMappingURL=preprocess.js.map