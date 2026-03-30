import { Navigate, Outlet } from "react-router-dom";
import { getStoredSession } from "../modules/auth/services/session.js";

export default function ProtectedRoute() {
  const session = getStoredSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
