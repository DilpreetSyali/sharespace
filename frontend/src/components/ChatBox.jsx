import { useEffect, useRef, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function ChatBox({ conversationId, onBack }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sharingLocation, setSharingLocation] = useState(false);
  const bottomRef = useRef(null);

  const me = user?._id || user?.id || user?.user?._id || user?.user?.id;

  const loadConversation = async () => {
    try {
      const res = await api.get("/api/conversations");
      const all = res.data || [];
      const found = all.find((x) => String(x._id) === String(conversationId));
      setConversation(found || null);
    } catch {
      setConversation(null);
    }
  };

  const loadMessages = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setErr("");

    try {
      const res = await api.get(`/api/messages/${conversationId}`);
      setMessages(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load messages");
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    loadConversation();
    loadMessages(true);

    const markSeen = async () => {
      try {
        await api.patch(`/api/conversations/${conversationId}/seen`);
      } catch {}
    };

    markSeen();

    const interval = setInterval(() => {
      loadMessages(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setSending(true);
      setErr("");
      const res = await api.post(`/api/messages/${conversationId}`, {
        text: text.trim(),
        type: "text",
      });
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleShareLocation = async () => {
    if (!navigator.geolocation) {
      setErr("Geolocation is not supported on this browser.");
      return;
    }

    setSharingLocation(true);
    setErr("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await api.post(`/api/messages/${conversationId}`, {
            type: "location",
            location: {
              lat: latitude,
              lng: longitude,
              label: "Shared Location",
            },
          });

          setMessages((prev) => [...prev, res.data]);
        } catch (e) {
          setErr(e?.response?.data?.message || "Failed to share location");
        } finally {
          setSharingLocation(false);
        }
      },
      (error) => {
        if (error.code === 1) setErr("Location permission denied.");
        else if (error.code === 2) setErr("Location unavailable.");
        else if (error.code === 3) setErr("Location request timed out.");
        else setErr("Failed to get location.");
        setSharingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const other =
    conversation &&
    (String(conversation.buyer?._id) === String(me)
      ? conversation.seller
      : conversation.buyer);

  if (!conversationId) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center px-4">
          <div className="text-3xl mb-3">💬</div>
          <div className="text-lg font-bold text-slate-900">Select a conversation</div>
          <div className="mt-2 text-sm text-slate-500">
            Choose a person to start chatting.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b border-slate-200 bg-white px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="hidden sm:block rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 transition"
          >
            ← Back
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="sm:hidden rounded-lg border border-slate-200 px-2 py-2 text-sm hover:bg-slate-50 transition"
          >
            ← 
          </button>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm sm:text-lg font-extrabold text-slate-900">
              {other?.name || "Conversation"}
            </div>
            <div className="truncate text-xs sm:text-sm text-slate-500">
              {conversation?.item?.title || "Item"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3">
        {loading ? (
          <div className="text-center text-slate-500 py-8">
            <div className="text-2xl mb-2">⏳</div>
            <div className="text-sm">Loading messages...</div>
          </div>
        ) : err ? (
          <div className="mb-3 rounded-lg sm:rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm flex items-start gap-2">
            <span>⚠️</span>
            <span>{err}</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center py-8">
            <div>
              <div className="text-2xl mb-2">👋</div>
              <div className="text-sm text-slate-500">No messages yet.</div>
              <div className="text-xs text-slate-400 mt-1">Start the conversation!</div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const senderId = msg.sender?._id || msg.sender;
              const isMine = String(senderId) === String(me);

              return (
                <div
                  key={msg._id}
                  className={`flex gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-2 sm:py-3 text-sm shadow-sm ${
                      isMine
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-900"
                    }`}
                  >
                    {msg.type === "location" && msg.location ? (
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm font-semibold">📍 Shared Location</div>

                        <div
                          className={`rounded-lg sm:rounded-xl border p-2 text-xs ${
                            isMine
                              ? "border-slate-700 bg-slate-800"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <div className={isMine ? "text-slate-300" : "text-slate-600"}>
                            Lat: {msg.location.lat.toFixed(5)}, Lng: {msg.location.lng.toFixed(5)}
                          </div>

                          <div className="mt-2 flex gap-1.5 flex-wrap">
                            <a
                              href={`https://www.google.com/maps?q=${msg.location.lat},${msg.location.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className={`rounded-full px-2 py-1 text-xs font-semibold inline-block ${
                                isMine ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                              }`}
                            >
                              Maps
                            </a>

                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${msg.location.lat},${msg.location.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className={`rounded-full border px-2 py-1 text-xs font-semibold inline-block ${
                                isMine
                                  ? "border-slate-500 text-white"
                                  : "border-slate-300 text-slate-900"
                              }`}
                            >
                              Directions
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="leading-relaxed break-words">{msg.text}</div>
                    )}

                    <div
                      className={`mt-1 text-[10px] sm:text-xs ${
                        isMine ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <div className="border-t border-slate-200 bg-white px-3 sm:px-4 py-3 sm:py-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <button
            type="button"
            onClick={handleShareLocation}
            disabled={sharingLocation || sending}
            className="shrink-0 rounded-full border border-slate-200 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold hover:bg-slate-50 disabled:opacity-60 transition"
          >
            {sharingLocation ? "..." : "📍"}
          </button>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type message..."
            className="flex-1 rounded-full border border-slate-200 px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition"
          />

          <button
            type="submit"
            disabled={sending}
            className="shrink-0 rounded-full bg-slate-900 px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 transition"
          >
            {sending ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}