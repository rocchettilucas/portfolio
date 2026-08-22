// Same 1200x630 card as the OG image. `runtime` has to be declared here rather than
// re-exported — Next parses it statically and rejects a re-export.
export const runtime = "nodejs";
export { default, alt, size, contentType } from "./opengraph-image";
