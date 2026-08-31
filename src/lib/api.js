import axios from "axios";

/**
 * Shared Axios instance for the SmartBar client.
 *
 * REACT_APP_API_URL should point at the backend origin, e.g.
 *   http://localhost:5000
 * Paths used throughout the app already include the resource segment
 * (/menu, /orders, /admin/..., etc.), so the base URL is the origin only.
 */
const baseURL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

// Let callers use api.get / api.post / api.delete exactly as written.
// Axios already returns { data, status, headers, ... } so existing
// `res.data` and `err.response?.data?.error` patterns keep working.
// Multipart uploads pass a third argument with Content-Type override.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize network errors so UI messages stay readable
    if (!error.response) {
      error.message =
        error.message || "Network error — is the backend running?";
    }
    return Promise.reject(error);
  }
);

export default api;
