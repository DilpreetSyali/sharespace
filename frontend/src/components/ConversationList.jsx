import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function normalizeImageSrc(src) {
  if (!src) return "";
  if (src.startsWith("/uploads/")) return src;
  if (src.includes("/uploads/")) {
    const idx = src.indexOf("/uploads/");
    return src.slice(idx);
  }
  return src;
}

export default function ConversationList({
  conversations = [],
  loading = false,
  err = "",
  selectedConversationId = "",
  onSelect,
}) {
  const { user } = useAuth();
  const me = user?._id || user?.id || user?.user?._id || user?.user?.id;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-slate-200 px-4 py-4 sm:py-5">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Messages</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">Your conversations</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-slate-500 text-sm text-center py-8">
            <div className="text-2xl mb-2">⏳</div>
            Loading...
          </div>
        ) : err ? (
          <div className="p-4 text-sm text-red-700 bg-red-50 m-2 rounded-lg">{err}</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-sm text-slate-500 text-center py-8">
            <div className="text-2xl mb-2">💬</div>
            No conversations yet.
          </div>
        ) : (
          conversations.map((conv) => {
            const other =
              String(conv.buyer?._id) === String(me) ? conv.seller : conv.buyer;

            const isSelected = String(selectedConversationId) === String(conv._id);

            return (
              <Link
                key={conv._id}
                to={`/messages/${conv._id}`}
                onClick={() => onSelect?.(conv)}
                className={`flex items-center gap-3 border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50 ${
                  isSelected ? "bg-slate-100" : "bg-white"
                }`}
              >
                <div className="h-12 w-12 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shrink-0 flex-shrink-0">
                  {conv.item?.images?.[0] ? (
                    <img
                      src={normalizeImageSrc(conv.item.images[0])}
                      alt={conv.item?.title || "Item"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg text-slate-300">
                      📦
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="truncate font-bold text-slate-900 text-sm">
                      {other?.name || "User"}
                    </div>
                    {conv.unread && (
                      <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 flex-shrink-0" />
                    )}
                  </div>

                  <div className="truncate text-xs sm:text-sm text-slate-600">
                    {conv.lastMessage || conv.item?.title || "Item"}
                  </div>

                  <div className="mt-0.5 text-xs text-slate-400">
                    {conv.updatedAt
                      ? new Date(conv.updatedAt).toLocaleDateString()
                      : ""}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}