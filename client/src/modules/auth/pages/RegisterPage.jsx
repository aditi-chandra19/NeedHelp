import { useMemo, useState } from "react";
import {
  ArrowRight,
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
import { apiRequest } from "../../common/services/apiClient.js";

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
  const socialProviders = ["Google", "Facebook"];

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
      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: formData,
      });

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

      <div className="mt-8 rounded-[1.3rem] border border-[#dfe8f1] bg-[#f8fbfe] px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f7ea8]">
          Social Sign Up
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Google and Facebook buttons are being reserved for real OAuth integration, so
          they are shown but not clickable yet.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {socialProviders.map((provider) => (
            <button
              key={provider}
              type="button"
              disabled
              className="nh-button-secondary h-11 w-full cursor-not-allowed opacity-70"
              title={`${provider} OAuth coming soon`}
            >
              {provider} Soon
            </button>
          ))}
        </div>
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
