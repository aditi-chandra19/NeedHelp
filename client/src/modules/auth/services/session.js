const SESSION_STORAGE_KEY = "needhelp.session";
const LAST_USED_EMAIL_KEY = "needhelp.lastUsedEmail";

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

  const email = session?.user?.email?.trim();

  if (email) {
    window.localStorage.setItem(LAST_USED_EMAIL_KEY, email);
  }
}

export function updateStoredSessionUser(user) {
  const currentSession = getStoredSession();

  if (!currentSession) {
    return;
  }

  setStoredSession({
    ...currentSession,
    user,
  });
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getLastUsedEmail() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(LAST_USED_EMAIL_KEY) || "";
}
