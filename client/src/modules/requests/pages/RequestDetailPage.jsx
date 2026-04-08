import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  CircleCheckBig,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Star,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { clearStoredSession, getStoredSession } from "../../auth/services/session.js";
import AppPageFrame from "../../common/components/AppPageFrame.jsx";
import NeedHelpMap from "../components/NeedHelpMap.jsx";
import { fetchRequestDetail, submitRequestResponse } from "../services/requestService.js";

export default function RequestDetailPage() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const session = getStoredSession();
  const user = session?.user;
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadDetail() {
      try {
        const payload = await fetchRequestDetail(requestId);

        if (!isActive) {
          return;
        }

        setDetail(payload);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus({
          type: "error",
          message: error.message || "Unable to load this request right now.",
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      isActive = false;
    };
  }, [requestId]);

  const request = detail?.request;
  const postedBy = detail?.postedBy;
  const responses = detail?.responses || [];
  const hasResponded = Boolean(detail?.hasResponded);
  const activeConversation = detail?.activeConversation;
  const mapRequests = request ? [request] : [];

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  async function handleSendResponse() {
    if (!responseMessage.trim()) {
      setStatus({
        type: "error",
        message: "Please enter a message",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = await submitRequestResponse(requestId, responseMessage);
      setDetail(payload.detail);
      setResponseMessage("");
      setStatus({
        type: "success",
        message: "Response sent! The requester will be notified.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to send your response right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AppPageFrame onLogout={handleLogout} user={user}>
        <main className="px-4 py-16 md:px-6">
          <div className="nh-panel mx-auto flex max-w-6xl items-center justify-center p-12">
            <div className="inline-flex items-center gap-3 text-slate-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading request details...
            </div>
          </div>
        </main>
      </AppPageFrame>
    );
  }

  return (
    <AppPageFrame onLogout={handleLogout} user={user}>
      <main className="px-4 pb-16 pt-10 md:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {status.message ? (
            <div className={status.type === "error" ? "nh-status-error" : "nh-status-success"}>
              <div className="flex items-start gap-3">
                {status.type === "error" ? (
                  <CircleAlert size={18} className="mt-0.5 shrink-0" />
                ) : (
                  <CircleCheckBig size={18} className="mt-0.5 shrink-0" />
                )}
                <p>{status.message}</p>
              </div>
            </div>
          ) : null}

          {hasResponded ? (
            <div className="rounded-[1.4rem] border border-[#cfe0ee] bg-[linear-gradient(135deg,#20466f_0%,#2f608e_100%)] px-5 py-4 text-white shadow-[0_18px_36px_rgba(32,70,111,0.2)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
                    Task in Progress
                  </p>
                  <p className="mt-1 text-sm text-white/90">
                    You are working on this task.
                  </p>
                </div>
                {activeConversation ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/messages?conversation=${activeConversation.id}`)}
                    className="inline-flex items-center gap-2 rounded-[1rem] border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-[#20466f]"
                  >
                    <MessageCircle size={15} />
                    Chat with Requester
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1.7fr_0.83fr]">
            <div className="space-y-5">
              <section className="nh-panel p-6">
                <div className={`h-1 rounded-full ${request?.tone ? "bg-[#5f80af]" : "bg-[#5f80af]"}`} />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="nh-tag">{request?.category}</span>
                      <span className="rounded-full bg-[#d7e1ee] px-3 py-1 text-[11px] font-semibold text-[#35557e]">
                        {hasResponded ? "In Progress" : request?.urgency}
                      </span>
                    </div>
                    <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                      {request?.title}
                    </h1>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-emerald-600">{request?.payment}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Payment offered
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>{request?.postedLabel}</span>
                  <span>{request?.distance}</span>
                  <span>{request?.responsesCount} responses</span>
                </div>

                <div className="mt-6 border-t border-[#e2eaf2] pt-6">
                  <p className="text-sm font-semibold text-slate-900">Description</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {request?.fullDescription}
                  </p>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-900">Location</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-[#35557e]">
                    <MapPin size={15} />
                    {request?.location}
                  </div>
                  <div className="mt-4">
                    <NeedHelpMap
                      requests={mapRequests}
                      mode="detail"
                      heightClass="h-[18rem]"
                      centerLabel="Focused location view with subtle movement around the selected request."
                    />
                  </div>
                </div>
              </section>

              <section className="nh-panel p-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Responses ({responses.length})
                </h2>

                <div className="mt-5 space-y-4">
                  {responses.map((response) => (
                    <div
                      key={response.id}
                      className={`rounded-[1.25rem] border px-4 py-4 ${
                        response.isSelected
                          ? "border-emerald-300 bg-emerald-50/70"
                          : "border-[#e2eaf2] bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#233b5d] text-sm font-bold text-white">
                            {response.responderAvatar}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-slate-900">{response.responderName}</p>
                              <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                                <Star size={12} fill="currentColor" />
                                {response.responderRating}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                                <CheckCircle2 size={12} />
                                Verified
                              </span>
                              <span className="text-xs font-semibold text-[#b7792e]">
                                {response.responderKarma} karma
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{response.message}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span>{response.postedAt}</span>
                              <button
                                type="button"
                                onClick={() => navigate(`/users/${response.responderId}`)}
                                className="font-semibold text-[#35557e]"
                              >
                                View Profile
                              </button>
                              {response.canChat ? (
                                <button
                                  type="button"
                                  onClick={() => navigate(`/messages?conversation=${activeConversation?.id || ""}`)}
                                  className="font-semibold text-[#35557e]"
                                >
                                  Chat Now
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => {
                                  if (response.phone) {
                                    window.location.href = `tel:${response.phone}`;
                                  } else {
                                    setStatus({
                                      type: "error",
                                      message: "Call details are not available for this helper yet.",
                                    });
                                  }
                                }}
                                className="inline-flex items-center gap-1 font-semibold text-[#35557e]"
                              >
                                <Phone size={12} />
                                Call
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!hasResponded ? (
                  <div className="mt-6 rounded-[1.25rem] border border-[#d8e3ee] bg-[#f8fbfd] p-5">
                    <p className="text-sm font-semibold text-slate-900">Offer Your Help</p>
                    <textarea
                      value={responseMessage}
                      onChange={(event) => setResponseMessage(event.target.value)}
                      placeholder="Let them know how you can help..."
                      rows={5}
                      className="mt-4 w-full rounded-[1rem] border border-[#d8e3ee] bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#5f86b6] focus:ring-4 focus:ring-[rgba(95,134,182,0.12)]"
                    />
                    <button
                      type="button"
                      onClick={handleSendResponse}
                      disabled={isSubmitting}
                      className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,#285784_0%,#20466f_100%)] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(32,70,111,0.18)] transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? "Sending..." : "Send Response"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50/60 px-5 py-5 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                        <CircleCheckBig size={18} />
                      </div>
                      <p className="mt-4 text-lg font-semibold text-slate-900">Response Sent!</p>
                      <p className="mt-2 text-sm text-slate-600">
                        The requester will review your offer and notify you if you&apos;re selected.
                      </p>
                    </div>
                    <div className="rounded-[1rem] border border-[#cfe0fb] bg-[#eef3ff] px-4 py-3 text-center text-sm font-medium text-[#5d7da4]">
                      This request is no longer accepting new responses
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-5">
              {activeConversation ? (
                <section className="rounded-[1.5rem] bg-[linear-gradient(135deg,#20466f_0%,#356898_100%)] p-5 text-white shadow-[0_18px_36px_rgba(32,70,111,0.18)]">
                  <p className="text-sm font-semibold">Active Conversation</p>
                  <div className="mt-4 rounded-[1rem] border border-white/12 bg-white/12 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 font-semibold text-white">
                        {activeConversation.helperAvatar}
                      </div>
                      <div>
                        <p className="font-semibold">{activeConversation.helperName}</p>
                        <p className="mt-1 text-xs text-white/75">{activeConversation.note}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/messages?conversation=${activeConversation.id}`)}
                    className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-[1rem] border border-white/70 bg-white text-sm font-semibold text-[#20466f]"
                  >
                    Open Chat
                  </button>
                </section>
              ) : null}

              <section className="nh-panel p-5">
                <p className="text-sm font-semibold text-slate-900">Posted By</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#233b5d] text-sm font-bold text-white">
                    {postedBy?.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{postedBy?.name}</p>
                    <p className="mt-1 text-xs text-amber-500">
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        {postedBy?.rating}
                      </span>
                      {" "}
                      {postedBy?.karmaPoints} karma
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {postedBy?.badges?.map((badge) => (
                    <span
                      key={badge}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        badge.includes("Verified")
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Response Rate</span>
                    <span>{postedBy?.responseRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Avg Response Time</span>
                    <span>{postedBy?.averageResponseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Member Since</span>
                    <span>{postedBy?.memberSince}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/users/${postedBy?.id}`)}
                  className="nh-button-secondary mt-5 w-full"
                >
                  View Full Profile
                </button>
              </section>

              <section className="rounded-[1.5rem] border border-[#cfe0fb] bg-[#eef3ff] p-5">
                <div className="flex items-center gap-2 text-[#35557e]">
                  <Shield size={16} />
                  <p className="font-semibold">Safety Tips</p>
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-[#496484]">
                  {detail?.safetyTips?.map((tip) => (
                    <li key={tip}>- {tip}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </AppPageFrame>
  );
}
