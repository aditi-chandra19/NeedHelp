import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CircleAlert,
  CircleCheckBig,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { setStoredSession } from "../services/session.js";

const highlights = [
  "Connect with verified neighbors",
  "Earn karma points by helping",
  "Access emergency SOS features",
  "Build trusted community network",
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "50K+", label: "Tasks Done" },
  { value: "4.8*", label: "Avg Rating" },
];

export default function RegisterPage() {
  const MotionSection = motion.section;
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
        message: error.message || "Unable to create your account right now.",
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

      setStatus({
        type: "success",
        message: data.message,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || `Unable to start ${provider} signup right now.`,
      });
    } finally {
      setActiveProvider("");
    }
  }

  const statusStyles =
    status.type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(129,140,248,0.12),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-4 py-8 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <MotionSection
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="hidden lg:block"
          >
            <div className="max-w-xl">
              <h1 className="text-5xl font-bold tracking-tight text-slate-900">
                Join NeedHelp
              </h1>
              <p className="mt-4 text-xl text-slate-600">
                India&apos;s #1 hyperlocal mutual help platform
              </p>

              <div className="mt-10 space-y-5">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <CheckCircle2 size={15} />
                    </span>
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center shadow-lg shadow-slate-200/50"
                  >
                    <p className="text-3xl font-bold text-sky-700">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </MotionSection>

          <MotionSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8"
          >
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-indigo-800 shadow-lg shadow-sky-200">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Start helping your community today
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Field
                id="fullName"
                name="fullName"
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={<User className="h-5 w-5 text-slate-400" />}
                value={formData.fullName}
                onChange={handleInputChange}
              />

              <Field
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-5 w-5 text-slate-400" />}
                value={formData.email}
                onChange={handleInputChange}
              />

              <Field
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                icon={<Phone className="h-5 w-5 text-slate-400" />}
                value={formData.phone}
                onChange={handleInputChange}
              />

              <PasswordField
                id="password"
                name="password"
                label="Password"
                placeholder="........"
                icon={<Lock className="h-5 w-5 text-slate-400" />}
                value={formData.password}
                onChange={handleInputChange}
                visible={showPassword}
                onToggleVisibility={() => setShowPassword((current) => !current)}
              />

              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="........"
                icon={<Lock className="h-5 w-5 text-slate-400" />}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                visible={showConfirmPassword}
                onToggleVisibility={() =>
                  setShowConfirmPassword((current) => !current)
                }
              />

              <label className="flex items-start gap-3 pt-1 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I agree to the{" "}
                  <button type="button" className="font-medium text-sky-700">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="font-medium text-sky-700">
                    Privacy Policy
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
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

            {status.message ? (
              <div
                className={`mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${statusStyles}`}
              >
                {status.type === "error" ? (
                  <CircleAlert size={18} className="mt-0.5 shrink-0" />
                ) : (
                  <CircleCheckBig size={18} className="mt-0.5 shrink-0" />
                )}
                <p>{status.message}</p>
              </div>
            ) : null}

            <div className="my-8 flex items-center gap-3 text-xs text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              <span>Or sign up with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignup("google")}
                disabled={activeProvider !== ""}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="text-base text-rose-500">G</span>
                {activeProvider === "google" ? "Connecting..." : "Google"}
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignup("facebook")}
                disabled={activeProvider !== ""}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="text-base font-bold text-slate-900">f</span>
                {activeProvider === "facebook" ? "Connecting..." : "Facebook"}
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-sky-700">
                Sign In
              </Link>
            </p>

            <div className="mt-8 flex items-center gap-3 text-xs text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              <div className="flex items-center gap-2 text-slate-500">
                <Shield size={14} className="text-emerald-500" />
                <span>Your data is safe and encrypted</span>
              </div>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          </MotionSection>
        </div>
      </div>
    </div>
  );
}

function Field({ id, name, label, type, placeholder, icon, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-3">{icon}</span>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
    </div>
  );
}

function PasswordField({
  id,
  name,
  label,
  placeholder,
  icon,
  value,
  onChange,
  visible,
  onToggleVisibility,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-3">{icon}</span>
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-12 text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-3 text-slate-400"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
