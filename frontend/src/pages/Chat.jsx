import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import PageShell from "../components/PageShell.jsx";

export default function Chat() {
  const { conversationId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get(`/api/messages/${conversationId}`);
      setMessages(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setSending(true);
      const res = await api.post(`/api/messages/${conversationId}`, {
        text: text.trim(),
      });
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const me = user?._id || user?.id;

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto">
        <Link to="/inbox" className="text-sm font-semibold underline">
          ← Back to Inbox
        </Link>

        <div className="mt-4 rounded-3xl border bg-white p-4 shadow-sm">
          {loading ? (
            <div>Loading...</div>
          ) : err ? (
            <div className="text-red-700">{err}</div>
          ) : (
            <>
              <div className="space-y-3 max-h-105 overflow-y-auto p-2">
                {messages.length === 0 ? (
                  <div className="text-slate-500 text-sm">No messages yet. Start the conversation.</div>
                ) : (
                  messages.map((msg) => {
                    const isMine = String(msg.sender?._id || msg.sender) === String(me);

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={
                            "max-w-[75%] rounded-2xl px-4 py-2 text-sm " +
                            (isMine
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-900")
                          }
                        >
                          <div>{msg.text}</div>
                          <div
                            className={
                              "mt-1 text-[11px] " +
                              (isMine ? "text-slate-300" : "text-slate-500")
                            }
                          >
                            {msg.sender?.name || "User"}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSend} className="mt-4 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-200"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}