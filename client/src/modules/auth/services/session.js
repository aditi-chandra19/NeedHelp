const SESSION_STORAGE_KEY = "needhelp.session";

export function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession);

    if (!parsedSession?.token || !parsedSession?.user) {
      clearStoredSession();
      return null;
    }

    return parsedSession;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function setStoredSession(session) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}
