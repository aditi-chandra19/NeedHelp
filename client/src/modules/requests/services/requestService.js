import { apiRequest } from "../../common/services/apiClient.js";
import { updateStoredSessionUser } from "../../auth/services/session.js";
import { decorateCategory, decorateRequest } from "../data/requestCatalog.js";

function buildQueryString(filters = {}) {
  const params = new URLSearchParams();

  if (filters.query) {
    params.set("query", filters.query);
  }

  if (filters.category && filters.category !== "all") {
    params.set("category", filters.category);
  }

  if (filters.urgency && filters.urgency !== "all") {
    params.set("urgency", filters.urgency);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export async function fetchRequests(filters = {}) {
  const payload = await apiRequest(`/api/requests${buildQueryString(filters)}`, {
    requiresAuth: true,
  });

  return {
    ...payload,
    requests: payload.requests.map((request) => decorateRequest(request)),
    categories: payload.categories.map((category) => decorateCategory(category)),
  };
}

export async function requestHelp(requestId) {
  const payload = await apiRequest(`/api/requests/${requestId}/help`, {
    method: "POST",
    requiresAuth: true,
  });

  if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return {
    ...payload,
    request: decorateRequest(payload.request),
  };
}

export async function requestChat(requestId) {
  const payload = await apiRequest(`/api/requests/${requestId}/chat`, {
    method: "POST",
    requiresAuth: true,
  });

  if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return {
    ...payload,
    request: decorateRequest(payload.request),
  };
}

export async function fetchRequestForm() {
  const payload = await apiRequest("/api/request-form", {
    requiresAuth: true,
  });

  return {
    ...payload,
    categories: payload.categories.map((category) => decorateCategory(category)),
  };
}

export async function createRequest(requestData) {
  const payload = await apiRequest("/api/requests", {
    method: "POST",
    body: requestData,
    requiresAuth: true,
  });

  if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return {
    ...payload,
    request: decorateRequest(payload.request),
  };
}

export async function generateRequestSuggestion(requestData) {
  return apiRequest("/api/request-suggestions", {
    method: "POST",
    body: requestData,
    requiresAuth: true,
  });
}
