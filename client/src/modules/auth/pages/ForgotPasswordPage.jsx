import { useMemo, useState } from "react";
import { ArrowRight, LoaderCircle, Lock, Mail, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../components/AuthPageShell.jsx";
import AuthPasswordField from "../components/AuthPasswordField.jsx";
import AuthStatusBanner from "../components/AuthStatusBanner.jsx";
import AuthTextField from "../components/AuthTextField.jsx";
import { apiRequest } from "../../common/services/apiClient.js";

const highlights = [
  "Reset access quickly without leaving the secure auth flow",
  "Use the same password rules as account creation for stronger protection",
  "Return to your community account immediately after updating credentials",
];

const stats = [
  { value: "24/7", label: "Account access support" },
  { value: "12h", label: "Standard session window" },
  { value: "100%", label: "Encrypted credential flow" },
];

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isIncomplete = useMemo(
    () =>
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim(),
    [formData]
  );

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isIncomplete) {
      setStatus({
        type: "error",
        message: "Fill all fields before resetting your password.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: "error",
        message: "Password and confirm password must match.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const data = await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: formData,
      });

      setStatus({ type: "success", message: data.message });
      window.setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to reset password right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageShell
      eyebrow="Secure account recovery"
      heading="Reset your access without losing momentum."
      description="Update your password and get back to the requests, conversations, and trust history attached to your account."
      highlights={highlights}
      stats={stats}
      cardEyebrow="Password recovery"
      cardTitle="Set a new password"
      cardDescription="Enter the account email and choose a stronger password to continue."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthTextField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          icon={<Mail className="h-5 w-5" />}
          value={formData.email}
          onChange={handleInputChange}
        />

        <AuthPasswordField
          id="password"
          name="password"
          label="New Password"
          placeholder="........"
          icon={<Lock className="h-5 w-5" />}
          value={formData.password}
          onChange={handleInputChange}
          visible={showPassword}
          onToggleVisibility={() => setShowPassword((current) => !current)}
        />

        <AuthPasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="........"
          icon={<Lock className="h-5 w-5" />}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          visible={showConfirmPassword}
          onToggleVisibility={() =>
            setShowConfirmPassword((current) => !current)
          }
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="nh-button-primary flex h-12 w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Updating Password...
            </>
          ) : (
            <>
              Reset Password <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <AuthStatusBanner type={status.type} message={status.message} />

      <p className="mt-6 text-center text-sm text-slate-600">
        Remembered it?{" "}
        <Link to="/login" className="font-semibold text-[#35557e]">
          Back to Login
        </Link>
      </p>

      <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-slate-500">
        <Shield size={16} className="text-emerald-600" />
        Recovery stays inside your encrypted auth flow
      </div>
    </AuthPageShell>
  );
}
