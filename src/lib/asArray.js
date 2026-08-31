/**
 * Normalize any API payload into a real array.
 * Handles: bare arrays, { data: [...] }, null/undefined, single objects.
 */
export function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  if (typeof value === "object" && Array.isArray(value.data)) return value.data;
  return [value];
}

export default asArray;
