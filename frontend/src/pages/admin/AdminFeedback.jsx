cat > src/pages/admin/AdminFeedback.jsx << 'EOF'
import { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminFeedback() {
  const [fb, setFb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const ENDPOINT = "/api/feedback"; // change if needed

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await client.get(ENDPOINT);
        setFb(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load feedback. Check endpoint.");
        setFb([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Feedback</h2>

      {err && <div className="p-3 border rounded-xl bg-red-50 text-red-600 text-sm">{err}</div>}

      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="p-3 border-b text-sm text-gray-500">Endpoint: {ENDPOINT}</div>

        {loading ? (
          <div className="p-4 text-gray-500">Loading…</div>
        ) : fb.length === 0 ? (
          <div className="p-4 text-gray-500">No feedback found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Rating</th>
                <th className="text-left p-3">Comment</th>
                <th className="text-left p-3">Sentiment</th>
                <th className="text-left p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {fb.map((f) => (
                <tr key={f._id} className="border-t align-top">
                  <td className="p-3 font-medium">{f.user?.email || f.user || "-"}</td>
                  <td className="p-3">{f.rating ?? "-"}</td>
                  <td className="p-3 max-w-lg">{f.comment || f.text || "-"}</td>
                  <td className="p-3">{f.sentiment || f.label || "-"}</td>
                  <td className="p-3">{f.createdAt ? new Date(f.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-xs text-gray-500">
        If you want sentiment badges (Positive/Neutral/Negative), share your feedback schema.
      </div>
    </div>
  );
}
EOF
