import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ClipboardList,
  CircleDollarSign,
  CirclePlus,
  Coins,
  Home,
  LoaderCircle,
  LogOut,
  MapPin,
  Menu,
  User,
  X,
  Zap,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { fetchNotifications, markNotificationsRead, toggleSos } from "../../common/services/appShellService.js";
import NeedHelpLogo from "../../common/components/NeedHelpLogo.jsx";
import NotificationPanel from "../../wallet/components/NotificationPanel.jsx";
import WalletQuickPanel from "../../wallet/components/WalletQuickPanel.jsx";
import { fetchWallet } from "../../wallet/services/walletService.js";

const navItems = [
  { label: "Home", path: "/home", icon: Home },
  { label: "Browse", path: "/browse", icon: MapPin },
  { label: "My Activity", path: "/my-requests", icon: ClipboardList },
  { label: "Post", path: "/post", icon: CirclePlus },
  { label: "Profile", path: "/profile", icon: User },
];

const mobileNavItems = [
  navItems[2],
  navItems[0],
  navItems[1],
  navItems[3],
  navItems[4],
];

function formatNumber(value = 0) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export default function HomeTopNav({ onLogout, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const walletPanelRef = useRef(null);
  const notificationPanelRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [displayUser, setDisplayUser] = useState(user);
  const [walletPreview, setWalletPreview] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showWalletPanel, setShowWalletPanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [isTogglingSos, setIsTogglingSos] = useState(false);
  const [flash, setFlash] = useState({ type: "", message: "" });

  useEffect(() => {
    setDisplayUser(user);
  }, [user]);

  useEffect(() => {
    setShowWalletPanel(false);
    setShowNotifications(false);
    setShowMobileMenu(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        walletPanelRef.current &&
        !walletPanelRef.current.contains(event.target)
      ) {
        setShowWalletPanel(false);
      }

      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!flash.message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setFlash({ type: "", message: "" });
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [flash.message]);

  const walletBalance = displayUser?.walletBalance ?? 1250;
  const karmaPoints = displayUser?.karmaPoints ?? 280;
  const notificationCount = displayUser?.notificationCount ?? 0;
  const sosActive = Boolean(displayUser?.sosActive);

  async function handleWalletToggle() {
    const nextValue = !showWalletPanel;
    setShowWalletPanel(nextValue);
    setShowNotifications(false);

    if (!nextValue) {
      return;
    }

    setIsWalletLoading(true);

    try {
      const payload = await fetchWallet();
      setWalletPreview(payload);
      setDisplayUser(payload.user);
    } catch (error) {
      setFlash({
        type: "error",
        message: error.message || "Unable to load your wallet right now.",
      });
    } finally {
      setIsWalletLoading(false);
    }
  }

  async function handleNotificationsToggle() {
    const nextValue = !showNotifications;
    setShowNotifications(nextValue);
    setShowWalletPanel(false);

    if (!nextValue) {
      return;
    }

    setIsNotificationsLoading(true);

    try {
      const payload = await fetchNotifications();
      setNotifications(payload.notifications);
      setDisplayUser(payload.user);

      if (payload.unreadCount > 0) {
        const readPayload = await markNotificationsRead();
        setNotifications(readPayload.notifications);
        setDisplayUser(readPayload.user);
      }
    } catch (error) {
      setFlash({
        type: "error",
        message: error.message || "Unable to load notifications right now.",
      });
    } finally {
      setIsNotificationsLoading(false);
    }
  }

  async function handleSosToggle() {
    setIsTogglingSos(true);

    try {
      const payload = await toggleSos(!sosActive);
      setDisplayUser(payload.user);
      setFlash({
        type: "success",
        message: payload.message,
      });
    } catch (error) {
      setFlash({
        type: "error",
        message: error.message || "Unable to update SOS right now.",
      });
    } finally {
      setIsTogglingSos(false);
    }
  }

  function handleOpenWallet(addMoney = false) {
    setShowWalletPanel(false);
    navigate(addMoney ? "/wallet?addMoney=1" : "/wallet");
  }

  return (
    <header className="sticky top-0 z-[95] bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/home" className="min-w-0">
          <NeedHelpLogo
            className="max-w-[13rem]"
            textClassName="text-[1.1rem] md:text-[1.7rem]"
            taglineClassName="text-[0.67rem]"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[#dbe4ee] bg-[#f8fbfe]/95 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:flex">
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
          <div className="relative md:hidden" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setShowMobileMenu((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe4ee] bg-white text-slate-700 shadow-[0_8px_18px_rgba(23,32,51,0.05)] transition hover:bg-[#f8fbfe]"
              aria-label="Open navigation menu"
            >
              {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>

            {showMobileMenu ? (
              <div className="absolute right-0 top-[calc(100%+0.85rem)] z-[120] w-[18rem] rounded-[1.5rem] border border-[#dbe4ee] bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
                <div className="space-y-1">
                  {mobileNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => {
                          setShowMobileMenu(false);
                          navigate(item.path);
                        }}
                        className={`flex w-full items-center gap-3 rounded-[1rem] px-4 py-3 text-left text-sm font-medium transition ${
                          isActive
                            ? "bg-[#233b5d] text-white"
                            : "text-slate-700 hover:bg-[#f8fafc]"
                        }`}
                      >
                        <Icon size={16} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleSosToggle}
            className={`hidden rounded-full px-4 py-2 text-sm font-semibold shadow-[0_8px_20px_rgba(23,32,51,0.05)] transition sm:inline-flex sm:items-center sm:gap-2 ${
              sosActive
                ? "border border-rose-500 bg-rose-500 text-white shadow-[0_10px_24px_rgba(244,63,94,0.24)] hover:bg-rose-600"
                : "border border-[#dbe4ee] bg-white text-slate-700 hover:bg-[#f8fbfe]"
            }`}
          >
            {isTogglingSos ? <LoaderCircle size={15} className="animate-spin" /> : <Zap size={15} />}
            {sosActive ? "SOS ON" : "SOS"}
          </button>

          <div className="relative hidden sm:block" ref={walletPanelRef}>
            <button
              type="button"
              onClick={handleWalletToggle}
              className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 shadow-[0_8px_18px_rgba(31,107,87,0.08)] transition hover:bg-emerald-50 sm:flex"
            >
              <CircleDollarSign size={16} />
              Rs {formatNumber(walletBalance)}
            </button>

            {showWalletPanel ? (
              isWalletLoading ? (
                <div className="absolute right-0 top-[calc(100%+0.85rem)] z-[110] w-[21rem] rounded-[1.65rem] border border-[#dbe4ee] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
                  <div className="inline-flex items-center gap-3 text-sm text-slate-500">
                    <LoaderCircle size={18} className="animate-spin" />
                    Loading wallet...
                  </div>
                </div>
              ) : (
                <WalletQuickPanel
                  wallet={walletPreview}
                  onAddMoney={() => handleOpenWallet(true)}
                  onOpenWallet={() => handleOpenWallet(false)}
                />
              )
            ) : null}
          </div>

          <div className="relative hidden sm:block" ref={notificationPanelRef}>
            <button
              type="button"
              onClick={handleNotificationsToggle}
              className="relative rounded-full border border-[#dbe4ee] bg-white p-2 shadow-[0_8px_18px_rgba(23,32,51,0.05)] transition hover:bg-[#f8fbfe]"
            >
              <Bell size={18} className="text-slate-600" />
              {notificationCount ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              ) : null}
            </button>

            {showNotifications ? (
              isNotificationsLoading ? (
                <div className="absolute right-0 top-[calc(100%+0.85rem)] z-[110] w-[22rem] rounded-[1.65rem] border border-[#dbe4ee] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
                  <div className="inline-flex items-center gap-3 text-sm text-slate-500">
                    <LoaderCircle size={18} className="animate-spin" />
                    Loading notifications...
                  </div>
                </div>
              ) : (
                <NotificationPanel notifications={notifications} />
              )
            ) : null}
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-700 shadow-[0_8px_18px_rgba(180,133,55,0.08)] sm:flex">
            <Coins size={16} />
            {formatNumber(karmaPoints)}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-[#dbe4ee] bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-[0_8px_18px_rgba(23,32,51,0.05)] transition hover:bg-[#f8fbfe]"
          >
            <LogOut size={15} />
            Log Out
          </button>
        </div>
      </div>

      {flash.message ? (
        <div
          className={`absolute right-4 top-[calc(100%+0.85rem)] z-[120] max-w-sm rounded-[1.25rem] border px-4 py-3 text-sm shadow-[0_18px_38px_rgba(15,23,42,0.12)] ${
            flash.type === "error"
              ? "border-[#ebc8bc] bg-[#fbefea] text-[#9a4d33]"
              : "border-emerald-200 bg-[#f2fbf7] text-emerald-700"
          }`}
        >
          {flash.message}
        </div>
      ) : null}
    </header>
  );
}
