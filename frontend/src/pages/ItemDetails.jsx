import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import PageShell from "../components/PageShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function normalizeImageSrc(src) {
  if (!src) return "";
  if (src.startsWith("/uploads/")) return src;
  if (src.startsWith("uploads/")) return `/${src}`;
  if (src.includes("/uploads/")) {
    const idx = src.indexOf("/uploads/");
    return src.slice(idx);
  }
  return `/uploads/${src}`;
}

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [brokenImages, setBrokenImages] = useState({});
  const [markingSold, setMarkingSold] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get("/api/items");
        const found = (res.data || []).find((x) => String(x._id) === String(id));
        setItem(found || null);
      } catch (e) {
        setErr("Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const ownerId = useMemo(() => {
    if (!item) return "";
    return item?.owner?._id || item?.owner?.id || item?.owner || "";
  }, [item]);

  const userId = useMemo(() => {
    if (!user) return "";
    return user?._id || user?.id || user?.user?._id || user?.user?.id || "";
  }, [user]);

  const ownerEmail = useMemo(() => {
    if (!item) return "";
    return (item?.owner?.email || "").toLowerCase();
  }, [item]);

  const userEmail = useMemo(() => {
    if (!user) return "";
    return (user?.email || user?.user?.email || "").toLowerCase();
  }, [user]);

  const isOwner = useMemo(() => {
    if (!item || !user) return false;

    const idMatch =
      ownerId && userId && String(ownerId).trim() === String(userId).trim();

    const emailMatch = ownerEmail && userEmail && ownerEmail === userEmail;

    return !!(idMatch || emailMatch);
  }, [item, user, ownerId, userId, ownerEmail, userEmail]);

  const handleDelete = async () => {
    const ok = window.confirm("Delete this item?");
    if (!ok) return;

    try {
      setActionMsg("");
      await api.delete(`/api/items/${item._id}`);
      navigate("/dashboard");
    } catch (e) {
      setActionMsg(e?.response?.data?.message || "Failed to delete item");
    }
  };

  const handleMarkAsSold = async () => {
    try {
      setMarkingSold(true);
      setActionMsg("");
      const newStatus = item.status === "completed" ? "available" : "completed";
      const res = await api.put(`/api/items/${item._id}`, { status: newStatus });
      setItem(res.data);
      setActionMsg(
        newStatus === "completed"
          ? "Item marked as sold!"
          : "Item marked as available!"
      );
    } catch (e) {
      setActionMsg(e?.response?.data?.message || "Failed to update item");
    } finally {
      setMarkingSold(false);
    }
  };

  const handleMessageSeller = async () => {
    if (isOwner) {
      setActionMsg("You cannot message yourself for your own item.");
      return;
    }

    try {
      setActionMsg("");
      setMessageLoading(true);
      const res = await api.post("/api/conversations", { itemId: item._id });
      navigate(`/messages/${res.data._id}`);
    } catch (e) {
      setActionMsg(e?.response?.data?.message || "Failed to start chat");
    } finally {
      setMessageLoading(false);
    }
  };

  const sellerEmail = item?.owner?.email || "";
  const sellerName = item?.owner?.name || "Seller";
  const mailSubject = encodeURIComponent(`Interested in ${item?.title}`);
  const mailBody = encodeURIComponent(
    `Hi ${sellerName},\n\nI am interested in your item "${item?.title}". Please let me know if it is still available.\n`
  );

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard"
          className="mb-6 flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          ← Back to items
        </Link>

        {loading ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 py-12 text-center sm:rounded-3xl sm:p-8">
            <div className="mb-2 text-2xl">⏳</div>
            <div className="text-slate-500">Loading item...</div>
          </div>
        ) : err ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 sm:rounded-3xl sm:p-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>{err}</div>
            </div>
          </div>
        ) : !item ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-center sm:rounded-3xl sm:p-8">
            <div className="mb-2 text-2xl">🔍</div>
            <div className="text-slate-600">Item not found</div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:gap-6">
              <div>
                <h1 className="mb-2 text-2xl font-extrabold text-slate-900 sm:text-4xl">
                  {item.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span>📍 {item.location}</span>
                  <span>•</span>
                  <span>👤 {item.owner?.name || "Unknown"}</span>
                </div>
              </div>

              <span
                className={
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold shadow-sm " +
                  (item.isFree
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-900 bg-slate-900 text-white")
                }
              >
                {item.isFree ? "🎁 FREE" : `₹${item.price}`}
              </span>
            </div>

            {item.images?.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  {item.images.map((src, i) => {
                    const finalSrc = normalizeImageSrc(src);
                    const isBroken = brokenImages[i];

                    return (
                      <div
                        key={i}
                        className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 sm:rounded-3xl"
                      >
                        {isBroken ? (
                          <div className="flex h-full w-full items-center justify-center text-2xl text-slate-300">
                            📷
                          </div>
                        ) : (
                          <img
                            src={finalSrc}
                            alt={`item-${i}`}
                            className="h-full w-full object-cover"
                            onError={() =>
                              setBrokenImages((prev) => ({
                                ...prev,
                                [i]: true,
                              }))
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 sm:mt-10">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                About this item
              </h2>
              <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                {item.description || "No description provided"}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Tag>{item.category}</Tag>
              <Tag>{item.condition}</Tag>
              <Tag>{item.location}</Tag>
            </div>

            {actionMsg && (
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 sm:rounded-xl">
                <span>ℹ️</span>
                <span>{actionMsg}</span>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:mt-10 sm:flex-row sm:pt-8">
              {isOwner ? (
                <>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    type="button"
                    onClick={handleMarkAsSold}
                    disabled={markingSold}
                    className={`rounded-2xl px-4 py-2 font-semibold text-white transition ${
                      item.status === "completed"
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-green-600 hover:bg-green-700"
                    } disabled:opacity-60`}
                  >
                    {markingSold
                      ? "Updating..."
                      : item.status === "completed"
                      ? "Mark as Available"
                      : "Mark as Sold"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                  >
                    🗑️ Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleMessageSeller}
                    disabled={messageLoading}
                    className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:flex-none sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                  >
                    {messageLoading ? "Opening chat..." : "💬 Message Seller"}
                  </button>

                  {sellerEmail ? (
                    <a
                      href={`mailto:${sellerEmail}?subject=${mailSubject}&body=${mailBody}`}
                      className="inline-block flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50 sm:flex-none sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                    >
                      ✉️ Email
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                    >
                      Contact unavailable
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 sm:text-sm">
      {children}
    </span>
  );
}