cat > src/pages/admin/AdminDashboard.jsx << 'EOF'
import { useEffect, useState } from "react";
import client from "../../api/client";

function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded-2xl p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div className="bg-white border rounded-2xl p-4">
      <div className="font-semibold mb-3">{title}</div>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: "-", items: "-", transactions: "-", feedback: "-" });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // If you create this endpoint later, it will auto-use it:
        // GET /api/admin/stats -> { users, items, transactions, feedback }
        const res = await client.get("/api/admin/stats");
        setStats(res.data);
      } catch {
        // Fallback: counts by list endpoints (change these if your routes differ)
        const [u, i, t, f] = await Promise.allSettled([
          client.get("/api/users"),
          client.get("/api/items"),
          client.get("/api/transactions"),
          client.get("/api/feedback"),
        ]);

        setStats({
          users: u.value?.data?.length ?? "-",
          items: i.value?.data?.length ?? "-",
          transactions: t.value?.data?.length ?? "-",
          feedback: f.value?.data?.length ?? "-",
        });
      }

      try {
        // Optional: recent activity endpoint
        const r = await client.get("/api/admin/recent");
        setRecent(Array.isArray(r.data) ? r.data : []);
      } catch {
        setRecent([]);
      }

      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.users} />
        <StatCard label="Total Items" value={stats.items} />
        <StatCard label="Transactions" value={stats.transactions} />
        <StatCard label="Feedback Entries" value={stats.feedback} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Box title="System Status">
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex justify-between">
              <span>API Connection</span>
              <span className="text-gray-500">{loading ? "Checking..." : "OK / Check endpoints"}</span>
            </li>
            <li className="flex justify-between">
              <span>Admin Endpoints</span>
              <span className="text-gray-500">Optional (stats/recent)</span>
            </li>
            <li className="text-xs text-gray-500 mt-2">
              If counts show “-”, update fallback endpoints in <b>AdminDashboard.jsx</b>.
            </li>
          </ul>
        </Box>

        <Box title="Recent Activity">
          {recent.length === 0 ? (
            <div className="text-sm text-gray-500">
              No recent feed endpoint found. (Optional) Create <b>/api/admin/recent</b>.
            </div>
          ) : (
            <div className="text-sm">
              {recent.map((r, idx) => (
                <div key={idx} className="py-2 border-b last:border-b-0">
                  <div className="font-medium">{r.title || r.type || "Activity"}</div>
                  <div className="text-xs text-gray-500">{r.time || r.createdAt || ""}</div>
                </div>
              ))}
            </div>
          )}
        </Box>
      </div>
    </div>
  );
}
EOF
