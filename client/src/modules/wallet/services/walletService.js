import { updateStoredSessionUser } from "../../auth/services/session.js";
import { apiRequest } from "../../common/services/apiClient.js";

export async function fetchWallet() {
  const payload = await apiRequest("/api/wallet", {
    requiresAuth: true,
  });

  if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return payload;
}

export async function addMoneyToWallet(paymentData) {
  const payload = await apiRequest("/api/wallet/add-money", {
    method: "POST",
    body: paymentData,
    requiresAuth: true,
  });

  if (payload.user) {
    updateStoredSessionUser(payload.user);
  }

  return payload;
}
