import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import PageShell from "../components/PageShell.jsx";

function normalizeImageSrc(src) {
  if (!src) return "";
  if (src.startsWith("/uploads/")) return src;
  if (src.includes("/uploads/")) {
    const idx = src.indexOf("/uploads/");
    return src.slice(idx);
  }
  return src;
}

export default function Inbox() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get("/api/conversations");
        setConversations(res.data || []);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-4">Inbox</h1>

        {loading ? (
          <div className="rounded-3xl border bg-white p-6">Loading...</div>
        ) : err ? (
          <div className="rounded-3xl border bg-red-50 p-6 text-red-700">{err}</div>
        ) : conversations.length === 0 ? (
          <div className="rounded-3xl border bg-white p-6 text-slate-600">
            No conversations yet.
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => {
              const me = user?._id || user?.id;
              const other =
                String(conv.buyer?._id) === String(me) ? conv.seller : conv.buyer;

              return (
                <Link
                  key={conv._id}
                  to={`/messages/${conv._id}`}
                  className="flex items-center gap-4 rounded-3xl border bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 shrink-0">
                    {conv.item?.images?.[0] ? (
                      <img
                        src={normalizeImageSrc(conv.item.images[0])}
                        alt={conv.item?.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {conv.item?.title || "Item"}
                    </div>
                    <div className="text-sm text-slate-600 truncate">
                      Chat with {other?.name || "User"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}