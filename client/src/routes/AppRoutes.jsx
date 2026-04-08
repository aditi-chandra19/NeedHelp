import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage.jsx";
import RegisterPage from "../modules/auth/pages/RegisterPage.jsx";
import ForgotPasswordPage from "../modules/auth/pages/ForgotPasswordPage.jsx";
import MyActivityPage from "../modules/activity/pages/MyActivityPage.jsx";
import HomePage from "../modules/home/pages/HomePage.jsx";
import BrowsePage from "../modules/requests/pages/BrowsePage.jsx";
import PostRequestPage from "../modules/requests/pages/PostRequestPage.jsx";
import RequestDetailPage from "../modules/requests/pages/RequestDetailPage.jsx";
import ProfilePage from "../modules/profile/pages/ProfilePage.jsx";
import MessagesPage from "../modules/messages/pages/MessagesPage.jsx";
import WalletPage from "../modules/wallet/pages/WalletPage.jsx";
import GuestRoute from "./GuestRoute.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function AppRoutes() {
  const defaultRoute = "/login";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRoute} replace />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/my-requests" element={<MyActivityPage />} />
        <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        <Route path="/post" element={<PostRequestPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users/:userId" element={<ProfilePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/wallet" element={<WalletPage />} />
      </Route>

      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  );
}
