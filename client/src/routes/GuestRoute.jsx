import { Navigate, Outlet } from "react-router-dom";
import { getStoredSession } from "../modules/auth/services/session.js";

export default function GuestRoute() {
  const session = getStoredSession();

  if (session) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
