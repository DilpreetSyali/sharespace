
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import PageShell from "../components/PageShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get("/api/items");
        const found = (res.data || []).find((x) => x._id === id);
        setItem(found || null);
      } catch (e) {
        setErr("Failed to load item");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const isOwner = useMemo(() => {
    if (!item || !user) return false;
    const ownerId = item.owner?._id || item.owner;
    const userId = user?._id || user?.id;
    return String(ownerId) === String(userId);
  }, [item, user]);

  const handleDelete = async () => {
    const ok = window.confirm("Delete this item?");
    if (!ok) return;

    try {
      await api.delete(`/api/items/${item._id}`);
      window.location.href = "/dashboard";
    } catch (e) {
      setActionMsg(e?.response?.data?.message || "Failed to delete item");
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
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="text-sm font-semibold underline">
          ← Back
        </Link>

        {loading ? (
          <div className="mt-4 rounded-3xl border bg-white p-6">Loading...</div>
        ) : err ? (
          <div className="mt-4 rounded-3xl border bg-red-50 p-6 text-red-700">{err}</div>
        ) : !item ? (
          <div className="mt-4 rounded-3xl border bg-white p-6">Item not found</div>
        ) : (
          <div className="mt-4 rounded-3xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900">{item.title}</h1>
              <span
                className={
                  "px-3 py-1 rounded-full text-xs font-extrabold border " +
                  (item.isFree
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-900 text-white border-slate-900")
                }
              >
                {item.isFree ? "FREE" : `₹${item.price}`}
              </span>
            </div>

            {item.images?.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {item.images.map((src, i) => {
                  const finalSrc = normalizeImageSrc(src);
                  const isBroken = brokenImages[i];

                  return (
                    <div key={i} className="rounded-3xl overflow-hidden border bg-slate-50">
                      {isBroken ? (
                        <div className="flex h-48 w-full items-center justify-center text-sm text-slate-400">
                          Image not available
                        </div>
                      ) : (
                        <img
                          src={finalSrc}
                          alt={`item-${i}`}
                          className="h-48 w-full object-cover"
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
            )}

            <p className="mt-4 text-slate-700">{item.description || "No description"}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Tag>{item.category}</Tag>
              <Tag>{item.condition}</Tag>
              <Tag>{item.location}</Tag>
            </div>

            <div className="mt-6 text-sm text-slate-600">
              Seller: <span className="font-semibold text-slate-900">{sellerName}</span>
            </div>

            {actionMsg && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {actionMsg}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {isOwner ? (
                <>
                  <button
                    type="button"
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-2 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-2xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleMessageSeller}
                    disabled={messageLoading}
                    className="rounded-2xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {messageLoading ? "Opening chat..." : "Message Seller"}
                  </button>

                  {sellerEmail ? (
                    <a
                      href={`mailto:${sellerEmail}?subject=${mailSubject}&body=${mailBody}`}
                      className="rounded-2xl border border-slate-300 bg-white px-4 py-2 font-semibold"
                    >
                      Email Seller
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="rounded-2xl bg-slate-200 px-4 py-2 font-semibold text-slate-500"
                    >
                      Seller contact unavailable
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
    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700">
      {children}
    </span>
  );
}