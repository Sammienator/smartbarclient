// Defends against the "X.map is not a function" class of crash: if an API
// call returns something other than an array (a CORS failure resolving to
// an HTML error page, a backend error object, a misconfigured API URL
// returning a 404 page, etc.), list state should fall back to an empty
// array instead of whatever unexpected shape came back.
export function asArray(data) {
  return Array.isArray(data) ? data : [];
}
