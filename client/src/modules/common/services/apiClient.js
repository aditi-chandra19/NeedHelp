import {
  clearStoredSession,
  getStoredSession,
} from "../../auth/services/session.js";

function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!configuredBaseUrl) {
    return "";
  }

  return configuredBaseUrl.endsWith("/")
    ? configuredBaseUrl.slice(0, -1)
    : configuredBaseUrl;
}

export async function apiRequest(
  path,
  { method = "GET", body, headers = {}, requiresAuth = false } = {}
) {
  const requestHeaders = {
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (requiresAuth) {
    const session = getStoredSession();

    if (session?.token) {
      requestHeaders.Authorization = `Bearer ${session.token}`;
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload = {};

  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    if (response.status === 401 && requiresAuth) {
      clearStoredSession();

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    throw new Error(payload.message || "Something went wrong. Please try again.");
  }

  return payload;
}
