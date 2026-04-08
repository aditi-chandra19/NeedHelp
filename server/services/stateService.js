import {
  connectToDatabase,
  loadPersistedState,
  persistState,
} from "../db.js";
import {
  ensureSecurityState,
  getPersistableState,
  hydrateState,
} from "../api.js";

export async function initializeApplicationState() {
  await connectToDatabase();

  const persistedState = await loadPersistedState();

  if (persistedState) {
    hydrateState(persistedState);
  } else {
    await persistState(getPersistableState());
  }

  await ensureSecurityState();
}
