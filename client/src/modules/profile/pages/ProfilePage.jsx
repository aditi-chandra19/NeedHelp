import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  PencilLine,
  Phone,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { clearStoredSession, getStoredSession } from "../../auth/services/session.js";
import AppPageFrame from "../../common/components/AppPageFrame.jsx";
import { getCategoryVisual } from "../../requests/data/requestCatalog.js";
import { fetchProfile, updateProfile } from "../services/profileService.js";

const statCardClasses = {
  sky: "bg-[#233b5d] text-white",
  emerald: "bg-[#256853] text-white",
  indigo: "bg-[#415f8c] text-white",
  amber: "bg-[#886636] text-white",
};

const tabs = [
  { id: "requests", label: "My Requests" },
  { id: "helping", label: "Helping Others" },
  { id: "reviews", label: "Reviews" },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const session = getStoredSession();
  const user = session?.user;
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState("requests");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      try {
        const payload = await fetchProfile(userId || "");

        if (!isActive) {
          return;
        }

        setProfileData(payload);
        setEditForm({
          name: payload.user?.name || "",
          phone: payload.user?.phone || "",
          address: payload.user?.address || "",
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus({
          type: "error",
          message: error.message || "Unable to load your profile right now.",
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [userId]);

  const resolvedUser = profileData?.user || user;
  const shellUser = profileData?.isOwnProfile ? resolvedUser : user;
  const badgeList = profileData?.badges || [];
  const stats = profileData?.stats || [];
  const karma = profileData?.karma;
  const tabData = profileData?.tabs || {};
  const isOwnProfile = Boolean(profileData?.isOwnProfile);

  const progressWidth = useMemo(() => {
    if (!karma?.nextLevelPoints) {
      return 0;
    }

    return Math.min((karma.currentPoints / karma.nextLevelPoints) * 100, 100);
  }, [karma]);

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  function handleEditField(event) {
    const { name, value } = event.target;
    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSaveProfile() {
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = await updateProfile(editForm);
      setProfileData(payload.profile);
      setEditForm({
        name: payload.profile.user?.name || "",
        phone: payload.profile.user?.phone || "",
        address: payload.profile.user?.address || "",
      });
      setIsEditing(false);
      setStatus({ type: "success", message: payload.message });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to update profile right now.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <AppPageFrame onLogout={handleLogout} user={resolvedUser}>
        <main className="px-4 py-16 md:px-6">
          <div className="nh-panel mx-auto flex max-w-5xl items-center justify-center p-12">
            <div className="inline-flex items-center gap-3 text-slate-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading profile...
            </div>
          </div>
        </main>
      </AppPageFrame>
    );
  }

  return (
    <AppPageFrame onLogout={handleLogout} user={shellUser}>
      <main className="px-4 pb-16 pt-10 md:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {status.message ? (
            <div
              className={`${
                status.type === "error"
                  ? "nh-status-error"
                  : "nh-status-success"
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <section className="nh-panel p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#233b5d] text-2xl font-semibold text-white shadow-[0_14px_28px_rgba(35,59,93,0.16)]">
                    {resolvedUser?.name?.[0] || "Y"}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <CheckCircle2 size={14} />
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5f7ea8]">
                    Trusted profile
                  </p>
                  <h1 className="mt-2 text-2xl font-bold text-slate-900">
                    {isOwnProfile ? "You" : resolvedUser?.name || "Community Member"}
                  </h1>
                  {isEditing ? (
                    <div className="mt-3 grid gap-3">
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditField}
                        className="nh-input"
                        placeholder="Full name"
                      />
                      <input
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditField}
                        className="nh-input"
                        placeholder="Phone number"
                      />
                      <input
                        name="address"
                        value={editForm.address}
                        onChange={handleEditField}
                        className="nh-input"
                        placeholder="Area or address"
                      />
                    </div>
                  ) : (
                    <div className="mt-2 space-y-1 text-sm text-slate-500">
                      <p className="inline-flex items-center gap-2">
                        <Phone size={14} />
                        {resolvedUser?.phone || "Not added yet"}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <MapPin size={14} />
                        {resolvedUser?.address || "Your area"}
                      </p>
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {badgeList.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1 rounded-full border border-[#dfe8f1] bg-[#f8fbfe] px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        <BadgeCheck size={12} className="text-emerald-600" />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {isOwnProfile ? (
                isEditing ? (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          name: resolvedUser?.name || "",
                          phone: resolvedUser?.phone || "",
                          address: resolvedUser?.address || "",
                        });
                      }}
                      className="nh-button-secondary px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="nh-button-primary px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSaving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="nh-button-secondary px-4 py-2"
                  >
                    <PencilLine size={15} />
                    Edit Profile
                  </button>
                )
              ) : null}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-[1.75rem] border border-transparent p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${statCardClasses[stat.tone]}`}
              >
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="mt-6 text-sm text-white/85">{stat.label}</p>
              </div>
            ))}
          </section>

          <section className="nh-panel p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Karma Level Progress</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {karma?.pointsToNextLevel || 0} points to next level
                </p>
              </div>
              <TrendingUp size={18} className="text-emerald-500" />
            </div>

            <div className="mt-6">
              <div className="h-3 rounded-full bg-[#e6edf4]">
                <div
                  className="h-3 rounded-full bg-[#233b5d]"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>{karma?.currentPoints || 0} points</span>
                <span>{karma?.nextLevelPoints || 0} points</span>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[#dfe8f1] bg-[#f5f9fd] p-5">
              <p className="font-semibold text-slate-900">Earn more karma points:</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {karma?.tips?.map((tip) => (
                  <li key={tip}>- {tip}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="nh-panel p-6">
            <div className="grid grid-cols-3 rounded-full bg-[#eef3f8] p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-[0_8px_20px_rgba(23,32,51,0.06)]"
                      : "text-slate-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {activeTab === "requests"
                ? (tabData.myRequests || []).map((request) => {
                    const visual = getCategoryVisual(request.categorySlug);
                    const Icon = visual.icon;

                    return (
                      <div
                        key={request.id}
                        className="rounded-[1.5rem] border border-[#dfe8f1] bg-[#fbfdff] p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3f8] text-[#35557e]">
                              <Icon size={18} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-[#e1e9f2] bg-[#f5f9fd] px-3 py-1 text-[11px] font-semibold text-slate-600">
                                  {request.category}
                                </span>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                                  {request.status}
                                </span>
                              </div>
                              <p className="mt-3 font-semibold text-slate-900">{request.title}</p>
                              <p className="mt-1 text-sm text-slate-500">{request.description}</p>
                            </div>
                          </div>
                          <div className="text-right text-xs text-slate-400">
                            <p>{request.responseCount} responses</p>
                            <p className="mt-1">{request.postedAt}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}

              {activeTab === "helping"
                ? (tabData.helpingHistory || []).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.5rem] border border-[#dfe8f1] bg-[#fbfdff] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                            <Sparkles size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{item.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                            <p className="mt-2 text-xs text-slate-400">
                              Earned {item.karmaEarned} karma points | {item.completedAt}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full border border-[#e1e9f2] bg-[#f5f9fd] px-3 py-1 text-[11px] font-semibold text-slate-600">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))
                : null}

              {activeTab === "reviews"
                ? (tabData.reviews || []).map((review) => (
                    <div
                      key={review.id}
                      className="rounded-[1.5rem] border border-[#dfe8f1] bg-[#fbfdff] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3f8] font-semibold text-slate-700">
                          {review.reviewer[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{review.reviewer}</p>
                          <div className="mt-1 flex items-center gap-1 text-amber-500">
                            {Array.from({ length: review.rating }).map((_, index) => (
                              <Star key={`${review.id}-${index}`} size={14} fill="currentColor" />
                            ))}
                          </div>
                          <p className="mt-2 text-sm text-slate-500">{review.comment}</p>
                          <p className="mt-2 text-xs text-slate-400">{review.postedAt}</p>
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </div>

            <button
              type="button"
              className="nh-button-secondary mt-5 w-full"
            >
              View All {activeTab === "requests" ? "Requests" : activeTab === "helping" ? "Tasks" : "Reviews"}
            </button>
          </section>
        </div>
      </main>
    </AppPageFrame>
  );
}
