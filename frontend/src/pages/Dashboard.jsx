import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import PageShell from "../components/PageShell.jsx";

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

export default function Dashboard() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/api/items");
      setItems(res.data || []);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => {
      return (
        it.title?.toLowerCase().includes(s) ||
        it.description?.toLowerCase().includes(s) ||
        it.category?.toLowerCase().includes(s) ||
        it.location?.toLowerCase().includes(s)
      );
    });
  }, [items, q]);

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        {/* Header Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm hover:shadow-md transition">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your campus feed</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Showing items for <span className="font-semibold text-slate-700">{user?.collegeID}</span>
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={fetchItems}
                className="px-4 py-2 rounded-lg sm:rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50 transition"
              >
                🔄 Refresh
              </button>
              <Link
                to="/items/new"
                className="px-4 py-2 rounded-lg sm:rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow-sm hover:shadow-md"
              >
                + Post item
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 sm:mt-5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search items (title, category, location...)"
              className="w-full border border-slate-200 rounded-lg sm:rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Error message */}
        {err && (
          <div className="text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg sm:rounded-xl p-4 flex items-start gap-3">
            <span className="text-lg leading-none">⚠️</span>
            <span>{err}</span>
          </div>
        )}

        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-slate-600 text-center">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-sm sm:text-base font-medium\">No items found. Try another search or post your first item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((it) => (
              <Link
                key={it._id}
                to={`/items/${it._id}`}
                className="group rounded-2xl sm:rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full"
              >
                <div className="aspect-4/3 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  {it.images?.[0] ? (
                    <img
                      src={normalizeImageSrc(it.images[0])}
                      alt={it.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-3xl text-slate-300">
                      📷
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-extrabold text-slate-900 group-hover:text-slate-700 line-clamp-2 text-sm sm:text-base">
                      {it.title}
                    </h3>
                    <PricePill isFree={it.isFree} price={it.price} />
                  </div>

                  <div className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4">
                    {it.description || "No description"}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Tag>{it.category}</Tag>
                    <Tag>{it.condition}</Tag>
                    <Tag>{it.location}</Tag>
                  </div>

                  <div className="mt-auto text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-center gap-2">
                    <span className="text-sm">👤</span>
                    <span className="font-medium text-slate-700 truncate">
                      {it.owner?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

function Tag({ children }) {
  return (
    <span className="px-2.5 py-1.5 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 text-slate-700 border border-slate-200 text-xs font-medium">
      {children}
    </span>
  );
}

function PricePill({ isFree, price }) {
  return (
    <span
      className={
        "shrink-0 px-3 py-1 rounded-full text-xs font-extrabold border " +
        (isFree
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-900 text-white border-slate-900")
      }
    >
      {isFree ? "FREE" : `₹${price}`}
    </span>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border bg-white overflow-hidden shadow-sm animate-pulse"
        >
          <div className="h-48 bg-slate-200" />
          <div className="p-5">
            <div className="h-4 w-2/3 bg-slate-200 rounded" />
            <div className="mt-3 h-3 w-full bg-slate-200 rounded" />
            <div className="mt-2 h-3 w-5/6 bg-slate-200 rounded" />
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-16 bg-slate-200 rounded-full" />
              <div className="h-6 w-16 bg-slate-200 rounded-full" />
              <div className="h-6 w-16 bg-slate-200 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}