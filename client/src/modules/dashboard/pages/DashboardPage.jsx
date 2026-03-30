import {
  Bell,
  ClipboardCheck,
  HeartHandshake,
  LogOut,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  clearStoredSession,
  getStoredSession,
} from "../../auth/services/session.js";

const quickStats = [
  {
    label: "Requests Helped",
    value: "18",
    icon: HeartHandshake,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-100",
  },
  {
    label: "Tasks Completed",
    value: "42",
    icon: ClipboardCheck,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-100",
  },
  {
    label: "Trust Score",
    value: "4.8",
    icon: Star,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-100",
  },
];

const activityItems = [
  "Your account is connected to the NeedHelp auth flow.",
  "Protected routing is active for the dashboard.",
  "Session data is persisted in localStorage for now.",
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const session = getStoredSession();
  const user = session?.user;

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(192,132,252,0.16),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-500">
              NeedHelp Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Welcome, {user?.name ?? "Neighbor"}
            </h1>
            <p className="mt-2 text-slate-600">
              Your auth flow is working and this route is now protected.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] bg-white/90 p-6 shadow-xl shadow-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                <UserRound size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Account Snapshot
                </h2>
                <p className="text-sm text-slate-500">
                  Current session details from your auth flow
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard label="Full Name" value={user?.name ?? "Not available"} />
              <InfoCard label="Email Address" value={user?.email ?? "Not available"} />
              <InfoCard label="Phone Number" value={user?.phone ?? "Not available"} />
              <InfoCard label="Session Token" value={session?.token ?? "Not available"} />
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
              Auth is now persisted locally and users who are not logged in are
              redirected back to the login page automatically.
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] bg-white/90 p-6 shadow-xl shadow-slate-200/70">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
                  <Bell size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Quick Activity
                  </h2>
                  <p className="text-sm text-slate-500">
                    Useful checks for the current frontend milestone
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {activityItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {quickStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[1.75rem] bg-white/90 p-5 shadow-xl shadow-slate-200/70"
                  >
                    <div className={`inline-flex rounded-2xl p-3 ${item.iconBg}`}>
                      <Icon size={20} className={item.iconColor} />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-slate-900">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 break-all text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}
