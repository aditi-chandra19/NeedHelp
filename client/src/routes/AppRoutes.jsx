import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage.jsx";
import RegisterPage from "../modules/auth/pages/RegisterPage.jsx";
import HomePage from "../modules/home/pages/HomePage.jsx";
import ComingSoonPage from "../modules/common/pages/ComingSoonPage.jsx";
import GuestRoute from "./GuestRoute.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { getStoredSession } from "../modules/auth/services/session.js";

export default function AppRoutes() {
  const defaultRoute = getStoredSession() ? "/home" : "/login";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRoute} replace />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />
        <Route
          path="/browse"
          element={
            <ComingSoonPage
              title="Browse Requests"
              description="The full browse experience is the next screen to build. The route is live, protected, and ready for the detailed UI from your Figma."
            />
          }
        />
        <Route
          path="/post"
          element={
            <ComingSoonPage
              title="Post a Request"
              description="Your posting flow will live here next. We kept the route ready so the Home page navigation already works cleanly."
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ComingSoonPage
              title="Profile"
              description="The profile experience is not designed yet in this app, so this protected placeholder keeps the navigation stable until we build it."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  );
}
