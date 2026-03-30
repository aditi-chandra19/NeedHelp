import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage.jsx";
import RegisterPage from "../modules/auth/pages/RegisterPage.jsx";
import HomePage from "../modules/home/pages/HomePage.jsx";
import BrowsePage from "../modules/requests/pages/BrowsePage.jsx";
import PostRequestPage from "../modules/requests/pages/PostRequestPage.jsx";
import ProfilePage from "../modules/profile/pages/ProfilePage.jsx";
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
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/post" element={<PostRequestPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  );
}
