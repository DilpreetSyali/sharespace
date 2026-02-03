cat > src/pages/admin/AdminUsers.jsx << 'EOF'
import { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const ENDPOINT = "/api/users"; // change if needed

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await client.get(ENDPOINT);
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load users. Check endpoint.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Users</h2>

      {err && <div className="p-3 border rounded-xl bg-red-50 text-red-600 text-sm">{err}</div>}

      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="p-3 border-b text-sm text-gray-500">Endpoint: {ENDPOINT}</div>

        {loading ? (
          <div className="p-4 text-gray-500">Loading…</div>
        ) : users.length === 0 ? (
          <div className="p-4 text-gray-500">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3 font-medium">{u.name || "-"}</td>
                  <td className="p-3">{u.email || "-"}</td>
                  <td className="p-3">{u.role || (u.isAdmin ? "admin" : "user")}</td>
                  <td className="p-3">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-xs text-gray-500">
        For block/unblock, share your update endpoint and I’ll add action buttons.
      </div>
    </div>
  );
}
EOF
