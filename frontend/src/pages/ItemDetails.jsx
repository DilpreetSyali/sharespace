import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
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

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

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
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {item.images.map((src, i) => (
                  <div key={i} className="rounded-3xl overflow-hidden border bg-slate-50">
                    <img
                      src={normalizeImageSrc(src)}
                      alt={`item-${i}`}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <p className="mt-4 text-slate-700">{item.description || "No description"}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Tag>{item.category}</Tag>
              <Tag>{item.condition}</Tag>
              <Tag>{item.location}</Tag>
            </div>

            <div className="mt-6 text-sm text-slate-600">
              Seller: <span className="font-semibold text-slate-900">{item.owner?.name}</span>
            </div>
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