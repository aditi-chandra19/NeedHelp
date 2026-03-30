import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  LoaderCircle,
  CircleAlert,
  CircleCheckBig,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { setStoredSession } from "../services/session.js";

export default function LoginPage() {
  const MotionCard = motion.div;
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
          error.message || "The server could not be reached. Try again shortly.",
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

      setStatus({
        type: "success",
        message: data.message,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message || `Unable to start ${provider} sign-in right now.`,
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(129,140,248,0.12),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] flex items-center justify-center p-4">
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-indigo-800 shadow-lg shadow-sky-200">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to continue helping your community
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-sky-900">Demo Account</p>
              <p className="mt-1 text-xs text-sky-700">
                Use `demo@example.com` and `password123` for a quick login.
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-sky-700 shadow-sm ring-1 ring-sky-200 transition hover:bg-sky-100"
            >
              Use Demo
            </button>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email Address
            </label>

            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="text-slate-700" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  setStatus({
                    type: "success",
                    message:
                      "Password reset is not wired yet, but the button is now active.",
                  })
                }
                className="cursor-pointer text-sky-700"
              >
                Forgot?
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="........"
                value={formData.password}
                onChange={handleInputChange}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
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

        {status.message ? (
          <div
            className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${statusStyles}`}
          >
            {status.type === "error" ? (
              <CircleAlert size={18} className="mt-0.5 shrink-0" />
            ) : (
              <CircleCheckBig size={18} className="mt-0.5 shrink-0" />
            )}
            <p>{status.message}</p>
          </div>
        ) : null}

        <div className="my-6 text-center text-sm text-slate-400">Or continue with</div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={activeProvider !== ""}
            className="h-11 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {activeProvider === "google" ? "Connecting..." : "Google"}
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("facebook")}
            disabled={activeProvider !== ""}
            className="h-11 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {activeProvider === "facebook" ? "Connecting..." : "Facebook"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-sky-700">
            Create Account
          </Link>
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-slate-500">
          <Shield size={16} className="text-emerald-600" />
          Secure &amp; encrypted login
        </div>
      </MotionCard>
    </div>
  );
}
