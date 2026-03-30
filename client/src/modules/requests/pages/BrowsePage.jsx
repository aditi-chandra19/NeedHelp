import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CircleAlert,
  CircleCheckBig,
  ListFilter,
  LoaderCircle,
  MapPinned,
  Search,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AppPageFrame from "../../common/components/AppPageFrame.jsx";
import {
  clearStoredSession,
  getStoredSession,
} from "../../auth/services/session.js";
import BrowseMapView from "../components/BrowseMapView.jsx";
import RequestCard from "../components/RequestCard.jsx";
import { fetchRequests, requestChat, requestHelp } from "../services/requestService.js";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function BrowsePage() {
  const MotionDiv = motion.div;
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [toast, setToast] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [activeAction, setActiveAction] = useState("");
  const session = getStoredSession();
  const user = session?.user;

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const urgency = searchParams.get("urgency") || "all";
  const view = searchParams.get("view") || "list";

  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    if (!location.state?.flashMessage) {
      return;
    }

    setToast({
      type: location.state.flashType || "success",
      message: location.state.flashMessage,
    });

    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: {},
    });
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    if (!toast.message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast({ type: "", message: "" });
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [toast.message]);

  useEffect(() => {
    let isActive = true;

    async function loadRequests() {
      setIsLoading(true);

      try {
        const payload = await fetchRequests({
          query,
          category,
          urgency,
        });

        if (!isActive) {
          return;
        }

        setRequests(payload.requests);
        setCategories(payload.categories);
        setSummary(payload.summary);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus({
          type: "error",
          message: error.message || "Unable to load nearby requests right now.",
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      isActive = false;
    };
  }, [query, category, urgency]);

  const filteredCategories = useMemo(
    () => categories.filter((item) => item.count > 0),
    [categories]
  );

  function updateSearchParams(nextParams) {
    const params = new URLSearchParams(searchParams);

    Object.entries(nextParams).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    setSearchParams(params);
  }

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    updateSearchParams({ q: searchValue.trim() });
  }

  async function handleRequestAction(requestId, actionType) {
    setActiveAction(`${requestId}:${actionType}`);
    setStatus({ type: "", message: "" });

    try {
      const payload =
        actionType === "help"
          ? await requestHelp(requestId)
          : await requestChat(requestId);

      setRequests((current) =>
        current.map((request) =>
          request.id === requestId ? payload.request : request
        )
      );
      setStatus({
        type: "success",
        message: payload.message,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to complete this action right now.",
      });
    } finally {
      setActiveAction("");
    }
  }

  return (
    <AppPageFrame onLogout={handleLogout} user={user}>
      {toast.message ? (
        <div className="fixed right-5 top-24 z-40 max-w-sm rounded-2xl border border-emerald-200 bg-[#fffdf9] px-4 py-3 text-sm text-slate-700 shadow-[0_20px_45px_rgba(15,23,42,0.16)]">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-700">
              <CircleCheckBig size={14} />
            </span>
            <div>
              <p className="font-semibold text-slate-900">Request posted</p>
              <p className="mt-1 text-slate-500">{toast.message}</p>
            </div>
          </div>
        </div>
      ) : null}

      <main className="px-4 pb-16 pt-10 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b7656]">
              Explore community requests
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Browse Help Requests
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-500">
              Find nearby people who need help, filter by urgency, and respond
              quickly with the same trusted flow used across NeedHelp.
            </p>
          </div>

          <div className="nh-panel mt-8 p-4">
            <form
              onSubmit={handleSearchSubmit}
              className="grid gap-3 xl:grid-cols-[1.35fr_0.58fr_0.48fr_auto]"
            >
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search requests..."
                  className="nh-input pl-12"
                />
              </div>

              <select
                value={category}
                onChange={(event) => updateSearchParams({ category: event.target.value })}
                className="nh-input"
              >
                <option value="all">All Categories</option>
                {filteredCategories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>

              <select
                value={urgency}
                onChange={(event) => updateSearchParams({ urgency: event.target.value })}
                className="nh-input"
              >
                <option value="all">All Urgency</option>
                <option value="Emergency">Emergency</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateSearchParams({ view: "list" })}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                    view === "list"
                      ? "border-[#233b5d] bg-[#233b5d] text-white"
                      : "border-[#ddd4c7] bg-white text-slate-600 hover:bg-[#fffdf8]"
                  }`}
                >
                  <ListFilter size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => updateSearchParams({ view: "map" })}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                    view === "map"
                      ? "border-[#233b5d] bg-[#233b5d] text-white"
                      : "border-[#ddd4c7] bg-white text-slate-600 hover:bg-[#fffdf8]"
                  }`}
                >
                  <MapPinned size={18} />
                </button>
              </div>
            </form>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {isLoading
                ? "Loading nearby requests..."
                : `Found ${requests.length} request${requests.length === 1 ? "" : "s"} nearby`}
            </p>
            {summary ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e1ee] bg-[#eef3f8] px-4 py-2 text-sm text-[#35557e]">
                <span className="font-semibold">{summary.averageResponse}</span>
                average response across active neighborhoods
              </div>
            ) : null}
          </div>

          {status.message ? (
            <div
              className={`mt-5 flex items-start gap-3 ${
                status.type === "error"
                  ? "nh-status-error"
                  : "nh-status-success"
              }`}
            >
              {status.type === "error" ? (
                <CircleAlert size={18} className="mt-0.5 shrink-0" />
              ) : (
                <CircleCheckBig size={18} className="mt-0.5 shrink-0" />
              )}
              <p>{status.message}</p>
            </div>
          ) : null}

          {isLoading ? (
            <div className="nh-panel mt-10 flex min-h-[16rem] items-center justify-center">
              <div className="inline-flex items-center gap-3 text-slate-500">
                <LoaderCircle size={20} className="animate-spin" />
                Loading requests...
              </div>
            </div>
          ) : view === "map" ? (
            <div className="mt-8">
              <BrowseMapView requests={requests} />
            </div>
          ) : (
            <MotionDiv
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="mt-8 grid gap-6 xl:grid-cols-2"
            >
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onHelp={(requestId) => handleRequestAction(requestId, "help")}
                  onChat={(requestId) => handleRequestAction(requestId, "chat")}
                  activeAction={activeAction}
                  variants={fadeUpItem}
                />
              ))}
            </MotionDiv>
          )}

          {!isLoading && !requests.length ? (
            <div className="nh-panel mt-10 p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900">No requests found</h2>
              <p className="mt-3 text-slate-500">
                Try a broader search or switch to a different urgency level.
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </AppPageFrame>
  );
}
