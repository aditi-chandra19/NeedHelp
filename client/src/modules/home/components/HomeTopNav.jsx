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

function formatNumber(value = 0) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export default function HomeTopNav({ onLogout, user }) {
  const walletBalance = user?.walletBalance ?? 1250;
  const karmaPoints = user?.karmaPoints ?? 280;
  const notificationCount = user?.notificationCount ?? 3;

  return (
    <header className="sticky top-0 z-30 bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/home" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-slate-200 bg-[#233b5d] text-white shadow-[0_12px_28px_rgba(35,59,93,0.16)]">
            <HeartHandshake size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xl font-bold tracking-tight text-slate-900">NeedHelp</p>
            <p className="truncate text-xs text-slate-500">Neighbors helping neighbors</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[#e5dbcb] bg-[#f8f3ea]/85 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#233b5d] text-white shadow-[0_10px_24px_rgba(35,59,93,0.16)]"
                      : "text-slate-700 hover:bg-white/80"
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
          <button className="hidden rounded-full border border-[#e0d6c8] bg-[#fffaf2] px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_8px_20px_rgba(23,32,51,0.05)] transition hover:bg-white sm:inline-flex sm:items-center sm:gap-2">
            <Zap size={15} />
            SOS
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-[0_8px_18px_rgba(31,107,87,0.08)] sm:flex">
            <CircleDollarSign size={16} />
            Rs {formatNumber(walletBalance)}
          </div>

          <div className="relative hidden rounded-full border border-[#e0d6c8] bg-[#fffaf2] p-2 shadow-[0_8px_18px_rgba(23,32,51,0.05)] sm:block">
            <Bell size={18} className="text-slate-600" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-amber-300 bg-amber-50/85 px-3 py-2 text-sm font-semibold text-amber-700 shadow-[0_8px_18px_rgba(180,133,55,0.08)] sm:flex">
            <Coins size={16} />
            {formatNumber(karmaPoints)}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-[#e0d6c8] bg-[#fffaf2] px-3 py-2 text-sm font-medium text-slate-700 shadow-[0_8px_18px_rgba(23,32,51,0.05)] transition hover:bg-white"
          >
            <LogOut size={15} />
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
