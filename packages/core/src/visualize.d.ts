import { DataSet, VisualizationSpec } from "./types";
export declare function suggestVisualizations(dataset: DataSet): VisualizationSpec[];
export declare function selectVisualizations(all: VisualizationSpec[], include?: string[], exclude?: string[]): VisualizationSpec[];
