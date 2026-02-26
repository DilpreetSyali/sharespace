import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";

function Badge({ children, variant = "gray" }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    yellow: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-rose-50 text-rose-700 border-rose-100",
    gray: "bg-slate-50 text-slate-700 border-slate-100",
    blue: "bg-sky-50 text-sky-700 border-sky-100",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[variant]}`}>
      {children}
    </span>
  );
}

function sentimentBadge(sent) {
  const s = String(sent || "").toLowerCase();
  if (s.includes("pos")) return { label: sent, variant: "green" };
  if (s.includes("neg")) return { label: sent, variant: "red" };
  if (s.includes("neu")) return { label: sent, variant: "yellow" };
  if (s) return { label: sent, variant: "blue" };
  return { label: "—", variant: "gray" };
}

export default function AdminFeedback() {
  const [fb, setFb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const ENDPOINT = "/api/feedback";

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await client.get(ENDPOINT);
        setFb(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load feedback.");
        setFb([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return fb;
    return fb.filter((f) => {
      const user = (f.user?.email || f.user?.name || f.user || "").toString().toLowerCase();
      const comment = (f.comment || f.text || "").toString().toLowerCase();
      const sentiment = (f.sentiment || f.label || "").toString().toLowerCase();
      return user.includes(s) || comment.includes(s) || sentiment.includes(s);
    });
  }, [fb, q]);

  const avgRating = useMemo(() => {
    const nums = fb.map((x) => Number(x.rating)).filter((n) => Number.isFinite(n));
    if (!nums.length) return null;
    const sum = nums.reduce((a, b) => a + b, 0);
    return (sum / nums.length).toFixed(1);
  }, [fb]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Feedback</h1>
          <p className="text-sm text-slate-500">
            View ratings, comments, and sentiment to monitor exchange quality.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="bg-white border rounded-2xl px-4 py-3 shadow-sm">
            <div className="text-xs text-slate-500">Average rating</div>
            <div className="text-lg font-extrabold text-slate-900">{avgRating ?? "—"}</div>
          </div>

          <div className="bg-white border rounded-2xl px-4 py-3 shadow-sm">
            <div className="text-xs text-slate-500">Total feedback</div>
            <div className="text-lg font-extrabold text-slate-900">{fb.length}</div>
          </div>
        </div>
      </div>

      {/* Search + error */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          className="w-full sm:w-96 bg-white border rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Search by user, comment, sentiment..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="sm:ml-auto text-xs text-slate-400">
          Endpoint: <span className="font-mono">{ENDPOINT}</span>
        </div>
      </div>

      {err && (
        <div className="p-3 border rounded-xl bg-rose-50 text-rose-700 text-sm">
          {err}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 text-slate-500">Loading feedback…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-slate-900 font-bold">No feedback found</div>
            <div className="text-sm text-slate-500 mt-1">
              Try clearing search or check if your backend endpoint returns data.
            </div>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-slate-700">User</th>
                  <th className="p-4 text-left font-semibold text-slate-700">Rating</th>
                  <th className="p-4 text-left font-semibold text-slate-700">Comment</th>
                  <th className="p-4 text-left font-semibold text-slate-700">Sentiment</th>
                  <th className="p-4 text-left font-semibold text-slate-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => {
                  const sb = sentimentBadge(f.sentiment || f.label);
                  const userText = f.user?.email || f.user?.name || f.user || "-";
                  const rating = f.rating ?? "-";
                  const comment = f.comment || f.text || "-";
                  const created = f.createdAt ? new Date(f.createdAt).toLocaleString() : "-";

                  return (
                    <tr key={f._id} className="border-t hover:bg-slate-50/60">
                      <td className="p-4 font-medium text-slate-900">{userText}</td>
                      <td className="p-4">
                        <Badge variant={Number(rating) >= 4 ? "green" : Number(rating) >= 3 ? "yellow" : "red"}>
                          {rating}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-700 max-w-xl">
                        <div className="line-clamp-2">{comment}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant={sb.variant}>{sb.label}</Badge>
                      </td>
                      <td className="p-4 text-slate-500">{created}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
