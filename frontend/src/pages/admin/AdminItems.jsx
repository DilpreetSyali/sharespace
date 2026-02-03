cat > src/pages/admin/AdminItems.jsx << 'EOF'
import { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const ENDPOINT = "/api/items"; // change if needed

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await client.get(ENDPOINT, { params: q ? { q } : {} });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load items. Check endpoint.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h2 className="text-xl font-bold">Items</h2>
        <div className="sm:ml-auto flex gap-2">
          <input
            className="border rounded-lg p-2 w-full sm:w-72"
            placeholder="Search by title/category..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button onClick={load} className="border rounded-lg px-3 py-2 hover:bg-gray-100">
            Search
          </button>
        </div>
      </div>

      {err && <div className="p-3 border rounded-xl bg-red-50 text-red-600 text-sm">{err}</div>}

      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="p-3 border-b text-sm text-gray-500">Endpoint: {ENDPOINT}</div>

        {loading ? (
          <div className="p-4 text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-gray-500">No items found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Condition</th>
                <th className="text-left p-3">Owner</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="border-t">
                  <td className="p-3 font-medium">{it.title || it.name || "-"}</td>
                  <td className="p-3">{it.category || "-"}</td>
                  <td className="p-3">{it.condition || "-"}</td>
                  <td className="p-3">{it.owner?.email || it.owner || "-"}</td>
                  <td className="p-3">{it.status || "active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-xs text-gray-500">
        To add approve/reject/delete buttons, tell me your item update/delete endpoints.
      </div>
    </div>
  );
}
EOF
