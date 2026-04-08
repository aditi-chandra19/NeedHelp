import { updateStoredSessionUser } from "../../auth/services/session.js";
import { apiRequest } from "../../common/services/apiClient.js";

export async function fetchProfile(userId = "") {
  const payload = await apiRequest(userId ? `/api/profiles/${userId}` : "/api/profile", {
    requiresAuth: true,
  });

  if (payload.viewer) {
    updateStoredSessionUser(payload.viewer);
  } else if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return payload;
}

export async function updateProfile(profileData) {
  const payload = await apiRequest("/api/profile", {
    method: "PUT",
    body: profileData,
    requiresAuth: true,
  });

  if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return payload;
}
