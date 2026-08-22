// Serializes a JSON-LD object for `dangerouslySetInnerHTML`. Escaping `<` is what keeps a
// stray "</script>" inside any string value from closing the tag early.
export function jsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}
