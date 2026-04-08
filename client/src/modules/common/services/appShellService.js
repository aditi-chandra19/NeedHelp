import { updateStoredSessionUser } from "../../auth/services/session.js";
import { apiRequest } from "./apiClient.js";

export async function fetchNotifications() {
  const payload = await apiRequest("/api/notifications", {
    requiresAuth: true,
  });

  if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return payload;
}

export async function markNotificationsRead() {
  const payload = await apiRequest("/api/notifications/mark-read", {
    method: "POST",
    requiresAuth: true,
  });

  if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return payload;
}

export async function toggleSos(active) {
  const payload = await apiRequest("/api/sos/toggle", {
    method: "POST",
    body: { active },
    requiresAuth: true,
  });

  if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return payload;
}
