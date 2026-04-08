import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearStoredSession, getStoredSession } from "../../auth/services/session.js";
import AppPageFrame from "../../common/components/AppPageFrame.jsx";
import { getCategoryVisual } from "../../requests/data/requestCatalog.js";
import { fetchProfile } from "../../profile/services/profileService.js";
import { completeRequest, deleteRequest } from "../../requests/services/requestService.js";

const activityTabs = [
  { id: "posted", label: "My Requests" },
  { id: "helping", label: "I'm Helping" },
];

const statusClasses = {
  active: "bg-emerald-100 text-emerald-700",
  accepted: "bg-violet-100 text-violet-700",
  completed: "bg-sky-100 text-sky-700",
  cancelled: "bg-rose-100 text-rose-700",
};

function formatCurrency(amount) {
  if (!amount) {
    return null;
  }

  return `Rs ${new Intl.NumberFormat("en-IN").format(amount)}`;
}

export default function MyActivityPage() {
  const navigate = useNavigate();
  const session = getStoredSession();
  const user = session?.user;
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState("posted");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadActivity() {
      try {
        const payload = await fetchProfile();

        if (!isActive) {
          return;
        }

        setProfileData(payload);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus({
          type: "error",
          message: error.message || "Unable to load your activity right now.",
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadActivity();

    return () => {
      isActive = false;
    };
  }, []);

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  async function handleMarkComplete(requestId) {
    try {
      const payload = await completeRequest(requestId);
      setProfileData(payload.profile);
      setStatus({ type: "success", message: payload.message });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to mark the request complete.",
      });
    }
  }

  async function handleDelete(requestId) {
    try {
      const payload = await deleteRequest(requestId);
      setProfileData(payload.profile);
      setStatus({ type: "success", message: payload.message });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to delete the request.",
      });
    }
  }

  const postedRequests = profileData?.tabs?.myRequests || [];
  const helpingOffers = profileData?.tabs?.helpingHistory || [];

  if (isLoading) {
    return (
      <AppPageFrame onLogout={handleLogout} user={user}>
        <main className="px-4 py-16 md:px-6">
          <div className="nh-panel mx-auto flex max-w-6xl items-center justify-center p-12">
            <div className="inline-flex items-center gap-3 text-slate-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading your activity...
            </div>
          </div>
        </main>
      </AppPageFrame>
    );
  }

  const currentItems = activeTab === "posted" ? postedRequests : helpingOffers;

  return (
    <AppPageFrame onLogout={handleLogout} user={profileData?.user || user}>
      <main className="px-4 pb-16 pt-10 md:px-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {status.message ? (
            <div className={status.type === "error" ? "nh-status-error" : "nh-status-success"}>
              {status.message}
            </div>
          ) : null}

          <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5f7ea8]">
                Activity center
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[#233b5d] sm:text-5xl">
                My Activity
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-500">
                Manage your requests, track help offers, and keep an eye on everything
                currently moving in the community.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/post")}
              className="nh-button-primary"
            >
              <Plus size={16} />
              New Request
            </button>
          </section>

          <section className="nh-panel p-3 md:max-w-xl">
            <div className="grid grid-cols-2 rounded-[1.35rem] bg-[#eef3f8] p-1">
              {activityTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-[0_10px_24px_rgba(23,32,51,0.08)]"
                      : "text-slate-500"
                  }`}
                >
                  {tab.label} ({tab.id === "posted" ? postedRequests.length : helpingOffers.length})
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            {currentItems.length ? (
              currentItems.map((item) => {
                const visual = item.categorySlug
                  ? getCategoryVisual(item.categorySlug)
                  : { icon: ClipboardList };
                const Icon = visual.icon;
                const statusClass = statusClasses[item.status] || "bg-slate-100 text-slate-700";
                const paymentLabel = formatCurrency(item.payment);

                return (
                  <article key={item.id} className="nh-panel overflow-hidden">
                    <div className="h-1.5 bg-[#5f80af]" />
                    <div className="p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-[#eef3f8] text-[#35557e] shadow-[0_10px_24px_rgba(53,85,126,0.08)]">
                              <Icon size={24} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${statusClass}`}>
                                  {item.status === "accepted"
                                    ? "In Progress"
                                    : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                                <span className="rounded-full border border-[#dbe4ee] bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
                                  {item.category || "Community Help"}
                                </span>
                              </div>

                              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                                {item.title}
                              </h2>
                              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500">
                            {item.location ? (
                              <span className="inline-flex items-center gap-2">
                                <MapPin size={15} />
                                {item.location}
                              </span>
                            ) : null}

                            {activeTab === "posted" ? (
                              <span className="inline-flex items-center gap-2">
                                <Users size={15} />
                                {item.responseCount || 0} responses
                              </span>
                            ) : null}

                            <span className="inline-flex items-center gap-2">
                              <Clock3 size={15} />
                              {item.acceptedDate || item.completedAt || item.postedAt}
                            </span>
                          </div>

                          {activeTab === "helping" && item.requesterName ? (
                            <div className="mt-5 rounded-[1.25rem] border border-[#e2eaf2] bg-[#f8fbfe] px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#233b5d] text-sm font-semibold text-white">
                                  {item.requesterAvatar || item.requesterName?.[0] || "N"}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    Requested by {item.requesterName}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-500">{item.location}</p>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {item.status === "completed" ? (
                            <div className="mt-5 rounded-[1.25rem] border border-emerald-200 bg-emerald-50/70 px-4 py-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                                    <CheckCircle2 size={18} />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-emerald-900">
                                      {activeTab === "posted"
                                        ? "Completed activity"
                                        : "Task completed"}
                                    </p>
                                    <p className="mt-1 text-sm text-emerald-700">
                                      {item.completedAt || item.acceptedDate || "Recently completed"}
                                    </p>
                                  </div>
                                </div>
                                {item.karmaEarned ? (
                                  <div className="text-right">
                                    <p className="text-2xl font-black text-amber-600">
                                      +{item.karmaEarned}
                                    </p>
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                      Karma
                                    </p>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ) : null}

                          <div className="mt-5 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/requests/${item.requestId || item.id}`)
                              }
                              className="nh-button-secondary px-4 py-2"
                            >
                              <Eye size={15} />
                              View Details
                            </button>

                            {activeTab === "helping" && item.status === "accepted" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    item.id?.startsWith("conv-")
                                      ? `/messages?conversation=${item.id}`
                                      : "/messages"
                                  )
                                }
                                className="nh-button-secondary px-4 py-2"
                              >
                                <MessageCircle size={15} />
                                Contact Requester
                              </button>
                            ) : null}

                            {activeTab === "posted" && item.status === "active" ? (
                              <button
                                type="button"
                                onClick={() => handleMarkComplete(item.id)}
                                className="inline-flex items-center gap-2 rounded-[1rem] border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                              >
                                <CheckCircle2 size={15} />
                                Mark Complete
                              </button>
                            ) : null}

                            {activeTab === "posted" && item.status === "active" ? (
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="inline-flex items-center gap-2 rounded-[1rem] border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                              >
                                <Trash2 size={15} />
                                Delete
                              </button>
                            ) : null}
                          </div>
                        </div>

                        <div className="lg:pl-6">
                          {paymentLabel ? (
                            <div className="text-right">
                              <p className="text-4xl font-black text-emerald-600">
                                {paymentLabel}
                              </p>
                              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                {activeTab === "posted" ? "Budget" : "Reward"}
                              </p>
                            </div>
                          ) : item.karmaEarned ? (
                            <div className="text-right">
                              <p className="text-4xl font-black text-amber-600">
                                +{item.karmaEarned}
                              </p>
                              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Karma
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="nh-panel p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef3f8] text-[#35557e]">
                  <ClipboardList size={28} />
                </div>
                <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
                  {activeTab === "posted" ? "No requests yet" : "No help offers yet"}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-500">
                  {activeTab === "posted"
                    ? "Post your first request and track it here."
                    : "Respond to nearby requests and your helping activity will appear here."}
                </p>
                <button
                  type="button"
                  onClick={() => navigate(activeTab === "posted" ? "/post" : "/browse")}
                  className="nh-button-primary mt-6"
                >
                  {activeTab === "posted" ? "Create Request" : "Browse Requests"}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </AppPageFrame>
  );
}
