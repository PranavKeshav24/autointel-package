"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestVisualizations = suggestVisualizations;
exports.selectVisualizations = selectVisualizations;
let idCounter = 0;
function nextId(prefix) {
    idCounter += 1;
    return `${prefix}_${idCounter}`;
}
function suggestVisualizations(dataset) {
    const fields = dataset.schema.fields;
    const numeric = fields.filter((f) => f.type === "number");
    const categorical = fields.filter((f) => f.type === "string" || f.type === "boolean");
    const time = fields.filter((f) => f.type === "date");
    const specs = [];
    if (numeric.length >= 1) {
        const y = numeric[0].name;
        const x = time[0]?.name ?? categorical[0]?.name ?? y;
        const mark = time.length ? "line" : "bar";
        specs.push({
            id: nextId("metric_over_x"),
            title: `${y} over ${x}`,
            description: `Plot of ${y} by ${x}`,
            vegaLiteSpec: {
                $schema: "https://vega.github.io/schema/vega-lite/v5.json",
                data: { values: dataset.rows },
                mark,
                encoding: {
                    x: { field: x, type: time.length ? "temporal" : "nominal" },
                    y: { field: y, type: "quantitative" },
                },
            },
        });
    }
    if (categorical.length >= 1 && numeric.length >= 1) {
        specs.push({
            id: nextId("grouped_bar"),
            title: `${numeric[0].name} by ${categorical[0].name}`,
            vegaLiteSpec: {
                $schema: "https://vega.github.io/schema/vega-lite/v5.json",
                data: { values: dataset.rows },
                mark: "bar",
                encoding: {
                    x: { field: categorical[0].name, type: "nominal" },
                    y: {
                        field: numeric[0].name,
                        type: "quantitative",
                        aggregate: "mean",
                    },
                },
            },
        });
    }
    return specs;
}
function selectVisualizations(all, include, exclude) {
    let list = all;
    if (include && include.length)
        list = list.filter((v) => include.includes(v.id));
    if (exclude && exclude.length)
        list = list.filter((v) => !exclude.includes(v.id));
    return list;
}
//# sourceMappingURL=visualize.js.map