import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import PageShell from "../components/PageShell.jsx";

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
      <div className="flex flex-col gap-4">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Your campus feed</h1>
              <p className="text-sm text-slate-500 mt-1">
                Showing items for <span className="font-semibold">{user?.collegeID}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchItems}
                className="px-4 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold transition"
              >
                Refresh
              </button>
              <Link
                to="/items/new"
                className="px-4 py-2 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
              >
                + Post item
              </Link>
            </div>
          </div>

          <div className="mt-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search items (title, category, location...)"
              className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {err && (
          <div className="text-sm bg-red-50 text-red-700 border border-red-200 rounded-2xl p-3">
            {err}
          </div>
        )}

        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border bg-white p-8 text-slate-600 text-center">
            No items found. Try another search or post your first item 🙂
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((it) => (
              <Link
                key={it._id}
                to={`/items/${it._id}`}
                className="group rounded-3xl border bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-extrabold text-slate-900 group-hover:underline">
                    {it.title}
                  </div>
                  <PricePill isFree={it.isFree} price={it.price} />
                </div>

                <div className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {it.description || "No description"}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <Tag>{it.category}</Tag>
                  <Tag>{it.condition}</Tag>
                  <Tag>{it.location}</Tag>
                </div>

                <div className="mt-4 text-xs text-slate-500">
                  Seller: <span className="font-semibold text-slate-700">{it.owner?.name || "Unknown"}</span>
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
    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
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
          className="rounded-3xl border bg-white p-5 shadow-sm animate-pulse"
        >
          <div className="h-4 w-2/3 bg-slate-200 rounded" />
          <div className="mt-3 h-3 w-full bg-slate-200 rounded" />
          <div className="mt-2 h-3 w-5/6 bg-slate-200 rounded" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}