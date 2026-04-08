import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  LoaderCircle,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../components/AuthPageShell.jsx";
import AuthPasswordField from "../components/AuthPasswordField.jsx";
import AuthStatusBanner from "../components/AuthStatusBanner.jsx";
import AuthTextField from "../components/AuthTextField.jsx";
import { setStoredSession } from "../services/session.js";

const highlights = [
  "Verified onboarding with stronger neighborhood trust checks",
  "One account for requests, chats, payments, and karma history",
  "Faster access to urgent help, response tracking, and SOS readiness",
  "A profile that feels accountable from day one",
];

const stats = [
  { value: "10k+", label: "Trusted members" },
  { value: "22", label: "Avg tasks per block" },
  { value: "98%", label: "Verified matches" },
];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value) {
  return /^[+\d][\d\s-]{9,}$/.test(value.trim());
}

function isStrongPassword(value) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProvider, setActiveProvider] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const isFormIncomplete = useMemo(
    () =>
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      !formData.agreeToTerms,
    [formData]
  );

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isFormIncomplete) {
      setStatus({
        type: "error",
        message: "Please fill all fields and accept the terms to continue.",
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

    if (!isValidEmail(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setStatus({
        type: "error",
        message: "Please enter a valid phone number.",
      });
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setStatus({
        type: "error",
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create account.");
      }

      setStoredSession({
        token: data.token,
        user: data.user,
      });
      setFormData((current) => ({
        ...current,
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      }));
      navigate("/home", { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ===
          "Too many authentication attempts. Please wait a few minutes and try again."
            ? "Too many sign-up attempts. Please wait a few minutes, then try again."
            : error.message || "Unable to create your account right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocialSignup(provider) {
    setActiveProvider(provider);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/auth/social-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Unable to start ${provider} signup.`);
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
            : error.message || `Unable to start ${provider} signup right now.`,
      });
    } finally {
      setActiveProvider("");
    }
  }

  return (
    <AuthPageShell
      eyebrow="Built on trust and accountability"
      heading="Join the neighbors people count on."
      description="Create your account to request help, respond nearby, and build a verified profile that feels trustworthy from the start."
      highlights={highlights}
      stats={stats}
      cardEyebrow="Create your account"
      cardTitle="Start with trust"
      cardDescription="Set up your profile once, then request help or step in for others across your community."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthTextField
          id="fullName"
          name="fullName"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<User className="h-5 w-5" />}
          value={formData.fullName}
          onChange={handleInputChange}
        />

        <AuthTextField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-5 w-5" />}
          value={formData.email}
          onChange={handleInputChange}
        />

        <AuthTextField
          id="phone"
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          icon={<Phone className="h-5 w-5" />}
          value={formData.phone}
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

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#35557e] focus:ring-[#5f80af]"
          />
          <span className="leading-6">
            I agree to the{" "}
            <button type="button" className="font-medium text-[#35557e]">
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" className="font-medium text-[#35557e]">
              Privacy Policy
            </button>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="nh-button-primary flex h-12 w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Create Account <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <AuthStatusBanner type={status.type} message={status.message} />

      <div className="my-8 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        <span>Or sign up with</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialSignup("google")}
          disabled={activeProvider !== ""}
          className="nh-button-secondary flex h-11 w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="text-base text-rose-500">G</span>
          {activeProvider === "google" ? "Connecting..." : "Google"}
        </button>
        <button
          type="button"
          onClick={() => handleSocialSignup("facebook")}
          disabled={activeProvider !== ""}
          className="nh-button-secondary flex h-11 w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="text-base font-bold text-slate-900">f</span>
          {activeProvider === "facebook" ? "Connecting..." : "Facebook"}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#35557e]">
          Sign In
        </Link>
      </p>

      <div className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-slate-500">
        <Shield size={15} className="text-emerald-600" />
        Your data is safe and encrypted
      </div>
    </AuthPageShell>
  );
}
