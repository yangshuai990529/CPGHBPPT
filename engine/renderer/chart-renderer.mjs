import { renderComponent } from "../components/index.mjs";
export function renderEditableChart(ctx, frame, data, kind = "bar") { return renderComponent(ctx, "Chart", { frame, kind, ...data }); }
