import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
   <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<div>Register Page</div>} />
    </Routes>
  );
}