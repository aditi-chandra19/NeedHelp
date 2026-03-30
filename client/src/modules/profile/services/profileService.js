import { updateStoredSessionUser } from "../../auth/services/session.js";
import { apiRequest } from "../../common/services/apiClient.js";

export async function fetchProfile() {
  const payload = await apiRequest("/api/profile", {
    requiresAuth: true,
  });

  if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return payload;
}
