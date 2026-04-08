import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, MoreVertical, Phone, Search, Send, Video } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearStoredSession, getStoredSession } from "../../auth/services/session.js";
import AppPageFrame from "../../common/components/AppPageFrame.jsx";
import {
  fetchMessages,
  sendConversationMessage,
  updateConversationSettings,
} from "../../requests/services/requestService.js";

export default function MessagesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getStoredSession();
  const user = session?.user;
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const actionsMenuRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    async function loadMessages() {
      try {
        const payload = await fetchMessages();

        if (!isActive) {
          return;
        }

        setConversations(payload.conversations);
        setSelectedConversationId(
          searchParams.get("conversation") ||
            payload.selectedConversationId ||
            payload.conversations[0]?.id ||
            ""
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus({
          type: "error",
          message: error.message || "Unable to load messages right now.",
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      isActive = false;
    };
  }, [searchParams]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setShowActionsMenu(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const selectedConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === selectedConversationId) ||
      conversations[0] ||
      null,
    [conversations, selectedConversationId]
  );

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  async function handleSend() {
    if (!selectedConversation || !messageText.trim()) {
      return;
    }

    setIsSending(true);

    try {
      const payload = await sendConversationMessage(
        selectedConversation.id,
        messageText
      );

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === payload.conversation.id
            ? payload.conversation
            : conversation
        )
      );
      setSelectedConversationId(payload.conversation.id);
      setMessageText("");
      setStatus({ type: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to send your message right now.",
      });
    } finally {
      setIsSending(false);
    }
  }

  async function handleConversationSetting(nextSettings, successMessage) {
    if (!selectedConversation) {
      return;
    }

    try {
      const payload = await updateConversationSettings(
        selectedConversation.id,
        nextSettings
      );
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === payload.conversation.id
            ? payload.conversation
            : conversation
        )
      );
      setStatus({ type: "success", message: successMessage });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to update conversation settings.",
      });
    }
  }

  function handleCall() {
    if (selectedConversation?.contactPhone) {
      window.location.href = `tel:${selectedConversation.contactPhone}`;
      return;
    }

    setStatus({
      type: "error",
      message: "Phone number is not available for this conversation yet.",
    });
  }

  function handleVideoCall() {
    if (!selectedConversation) {
      return;
    }

    const videoUrl = `https://meet.jit.si/needhelp-${selectedConversation.id}`;
    window.open(videoUrl, "_blank", "noopener,noreferrer");
    setStatus({
      type: "success",
      message: `Secure video room opened for ${selectedConversation.helperName}.`,
    });
  }

  if (isLoading) {
    return (
      <AppPageFrame onLogout={handleLogout} user={user}>
        <main className="px-4 py-16 md:px-6">
          <div className="nh-panel mx-auto flex max-w-7xl items-center justify-center p-12">
            <div className="inline-flex items-center gap-3 text-slate-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading messages...
            </div>
          </div>
        </main>
      </AppPageFrame>
    );
  }

  return (
    <AppPageFrame onLogout={handleLogout} user={user}>
      <main className="px-4 pb-12 pt-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          {status.message ? (
            <div className={`${status.type === "error" ? "nh-status-error" : "nh-status-success"} mb-4`}>
              {status.message}
            </div>
          ) : null}

          <section className="nh-panel overflow-hidden">
            <div className="grid min-h-[72vh] lg:grid-cols-[320px_1fr]">
              <aside className="border-r border-[#e2eaf2] bg-[#f8fbfd] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5f7ea8]">
                  Conversations
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-[#233b5d]">Messages</h1>
                <div className="relative mt-4">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="nh-input pl-11"
                  />
                </div>

                <div className="mt-5 space-y-2">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`flex w-full items-start gap-3 rounded-[1rem] px-3 py-3 text-left transition ${
                        selectedConversation?.id === conversation.id
                          ? "border border-[#dbe4ee] bg-white shadow-[0_14px_28px_rgba(20,32,51,0.08)]"
                          : "hover:bg-white/70"
                      }`}
                    >
                      <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#233b5d] text-sm font-semibold text-white">
                        {conversation.helperAvatar}
                        {conversation.helperOnline ? (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate font-semibold text-slate-900">
                            {conversation.helperName}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            {conversation.updatedAt}
                          </span>
                        </div>
                        <p className="truncate text-xs text-slate-500">
                          {conversation.requestTitle}
                        </p>
                        <p className="mt-1 truncate text-sm text-slate-600">
                          {conversation.preview}
                        </p>
                      </div>
                      {conversation.unreadCount ? (
                        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#20466f] px-1.5 text-[10px] font-bold text-white">
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </aside>

              <section className="flex min-h-[72vh] flex-col bg-white">
                {selectedConversation ? (
                  <>
                    <div className="flex items-center justify-between gap-4 border-b border-[#e2eaf2] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#233b5d] text-sm font-semibold text-white">
                          {selectedConversation.helperAvatar}
                          {selectedConversation.helperOnline ? (
                            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {selectedConversation.helperName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {selectedConversation.requestTitle}
                          </p>
                        </div>
                      </div>

                      <div className="relative flex items-center gap-2 text-slate-500" ref={actionsMenuRef}>
                        <button
                          type="button"
                          onClick={handleCall}
                          className="nh-button-secondary h-10 w-10 rounded-[0.95rem] px-0 py-0 transition hover:text-[#20466f]"
                          aria-label="Call helper"
                        >
                          <Phone size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={handleVideoCall}
                          className="nh-button-secondary h-10 w-10 rounded-[0.95rem] px-0 py-0 transition hover:text-[#20466f]"
                          aria-label="Start video call"
                        >
                          <Video size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/requests/${selectedConversation.requestId}`)}
                          className="nh-button-secondary px-4 py-2 text-sm font-semibold text-[#35557e] transition hover:text-[#20466f]"
                        >
                          View Request
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowActionsMenu((current) => !current)}
                          className="nh-button-secondary h-10 w-10 rounded-[0.95rem] px-0 py-0 transition hover:text-[#20466f]"
                          aria-label="Open chat actions"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {showActionsMenu ? (
                          <div className="absolute right-0 top-[calc(100%+0.9rem)] z-20 w-48 rounded-[1rem] border border-[#d8e3ee] bg-white p-2 shadow-[0_18px_40px_rgba(20,32,51,0.12)]">
                            <button
                              type="button"
                              onClick={() => {
                                setShowActionsMenu(false);
                                navigate(`/requests/${selectedConversation.requestId}`);
                              }}
                              className="flex w-full rounded-[0.85rem] px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-[#f8fbfd]"
                            >
                              Open request details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowActionsMenu(false);
                                handleConversationSetting(
                                  { starred: !selectedConversation.isStarred },
                                  selectedConversation.isStarred
                                    ? "Conversation removed from quick access."
                                    : `Conversation with ${selectedConversation.helperName} marked for quick access.`
                                );
                              }}
                              className="mt-1 flex w-full rounded-[0.85rem] px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-[#f8fbfd]"
                            >
                              {selectedConversation.isStarred ? "Unstar this chat" : "Star this chat"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowActionsMenu(false);
                                handleConversationSetting(
                                  { muted: !selectedConversation.isMuted },
                                  selectedConversation.isMuted
                                    ? "Alerts restored for this conversation."
                                    : "Notifications muted for this conversation."
                                );
                              }}
                              className="mt-1 flex w-full rounded-[0.85rem] px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-[#f8fbfd]"
                            >
                              {selectedConversation.isMuted ? "Unmute alerts" : "Mute alerts"}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                      {selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === "requester"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div className="max-w-[72%]">
                            <div
                              className={`rounded-[1rem] px-4 py-3 text-sm leading-6 ${
                                message.sender === "requester"
                                  ? "bg-[linear-gradient(180deg,#285784_0%,#20466f_100%)] text-white shadow-[0_12px_24px_rgba(32,70,111,0.14)]"
                                  : "border border-[#e2eaf2] bg-[#f8fbfe] text-slate-700"
                              }`}
                            >
                              {message.text}
                            </div>
                            <p className="mt-1 px-1 text-[11px] text-slate-400">
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#e2eaf2] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(event) => setMessageText(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleSend();
                            }
                          }}
                          placeholder="Type a message..."
                          className="nh-input flex-1"
                        />
                        <button
                          type="button"
                          onClick={handleSend}
                          disabled={isSending}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,#285784_0%,#20466f_100%)] text-white shadow-[0_14px_28px_rgba(32,70,111,0.16)] transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSending ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : (
                            <Send size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center text-slate-500">
                    No conversation selected.
                  </div>
                )}
              </section>
            </div>
          </section>
        </div>
      </main>
    </AppPageFrame>
  );
}
