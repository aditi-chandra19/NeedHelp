import {
  Bell,
  CircleDollarSign,
  CirclePlus,
  Coins,
  HeartHandshake,
  Home,
  LogOut,
  MapPin,
  User,
  Zap,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/home", icon: Home },
  { label: "Browse", path: "/browse", icon: MapPin },
  { label: "Post", path: "/post", icon: CirclePlus },
  { label: "Profile", path: "/profile", icon: User },
];

export default function HomeTopNav({ onLogout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/92 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/home" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-indigo-800 text-white shadow-lg shadow-sky-200">
            <HeartHandshake size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xl font-bold text-slate-900">
              NeedHelp
            </p>
            <p className="truncate text-xs text-slate-500">
              Neighbors helping neighbors
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 shadow-sm md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                      : "text-slate-700 hover:bg-white"
                  }`
                }
              >
                <Icon size={15} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:inline-flex sm:items-center sm:gap-2">
            <Zap size={15} />
            SOS
          </button>

          <div className="hidden items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm sm:flex">
            <CircleDollarSign size={16} />
            Rs 1,250
          </div>

          <div className="relative hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:block">
            <Bell size={18} className="text-slate-600" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
              3
            </span>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 shadow-sm sm:flex">
            <Coins size={16} />
            280
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <LogOut size={15} />
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
