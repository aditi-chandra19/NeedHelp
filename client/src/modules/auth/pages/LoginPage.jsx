import { useMemo, useState } from "react";
import { ArrowRight, LoaderCircle, Lock, Mail, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../components/AuthPageShell.jsx";
import AuthPasswordField from "../components/AuthPasswordField.jsx";
import AuthStatusBanner from "../components/AuthStatusBanner.jsx";
import AuthTextField from "../components/AuthTextField.jsx";
import { setStoredSession } from "../services/session.js";

const loginHighlights = [
  "Verified member profiles and neighborhood trust checks",
  "Faster access to nearby requests, chats, and active help threads",
  "Secure task history, payments, and karma-based reputation in one place",
];

const loginStats = [
  { value: "214", label: "Live requests nearby" },
  { value: "3.8m", label: "Avg first response" },
  { value: "98%", label: "Successful matches" },
];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProvider, setActiveProvider] = useState("");

  const isFormIncomplete = useMemo(
    () => !formData.email.trim() || !formData.password.trim(),
    [formData.email, formData.password]
  );

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function fillDemoCredentials() {
    setFormData({
      email: "demo@example.com",
      password: "password123",
    });
    setStatus({ type: "", message: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isFormIncomplete) {
      setStatus({
        type: "error",
        message: "Enter both email and password before signing in.",
      });
      return;
    }

    if (!isValidEmail(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address before signing in.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      setStoredSession({
        token: data.token,
        user: data.user,
      });
      setFormData((current) => ({
        ...current,
        password: "",
      }));
      navigate("/home", { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ===
          "Too many authentication attempts. Please wait a few minutes and try again."
            ? "Too many sign-in attempts. Wait a few minutes, then try again."
            : error.message || "The server could not be reached. Try again shortly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocialLogin(provider) {
    setActiveProvider(provider);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/auth/social-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Unable to start ${provider} login.`);
      }

      if (data.token && data.user) {
        setStoredSession({
          token: data.token,
          user: data.user,
        });
        navigate("/home", { replace: true });
        return;
      }

      setStatus({
        type: "success",
        message: data.message,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ===
          "Too many authentication attempts. Please wait a few minutes and try again."
            ? "Too many authentication attempts for now. Please wait a few minutes."
            : error.message || `Unable to start ${provider} sign-in right now.`,
      });
    } finally {
      setActiveProvider("");
    }
  }

  return (
    <AuthPageShell
      eyebrow="Community-first local help"
      heading="Continue where your community left off."
      description="Sign in to see active requests, trusted neighbors nearby, and the work you have already done to build trust."
      highlights={loginHighlights}
      stats={loginStats}
      cardEyebrow="Secure sign in"
      cardTitle="Welcome back"
      cardDescription="Get back to requests, conversations, and community help in a few seconds."
    >
      <div className="mb-6 rounded-[1.5rem] border border-[#dfe8f1] bg-[#f7fafe] px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#233b5d]">Demo Account</p>
            <p className="mt-1 text-xs leading-5 text-[#496484]">
              Use `demo@example.com` and `password123` for a quick login.
            </p>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="nh-button-secondary rounded-xl px-3 py-2 text-xs font-semibold"
          >
            Use Demo
          </button>
        </div>
      </div>

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
          label="Password"
          placeholder="........"
          icon={<Lock className="h-5 w-5" />}
          value={formData.password}
          onChange={handleInputChange}
          visible={showPassword}
          onToggleVisibility={() => setShowPassword((current) => !current)}
          trailingAction={
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-[#35557e] transition hover:text-[#233b5d]"
            >
              Forgot?
            </button>
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
              Signing In...
            </>
          ) : (
            <>
              Sign In <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <AuthStatusBanner type={status.type} message={status.message} />

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        <span>Or continue with</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          disabled={activeProvider !== ""}
          className="nh-button-secondary h-11 w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {activeProvider === "google" ? "Connecting..." : "Google"}
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          disabled={activeProvider !== ""}
          className="nh-button-secondary h-11 w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {activeProvider === "facebook" ? "Connecting..." : "Facebook"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold text-[#35557e]">
          Create Account
        </Link>
      </p>

      <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-slate-500">
        <Shield size={16} className="text-emerald-600" />
        Secure &amp; encrypted login
      </div>
    </AuthPageShell>
  );
}
