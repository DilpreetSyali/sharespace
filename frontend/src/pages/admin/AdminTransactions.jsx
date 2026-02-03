cat > src/pages/admin/AdminTransactions.jsx << 'EOF'
import { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminTransactions() {
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const ENDPOINT = "/api/transactions"; // change if needed

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await client.get(ENDPOINT);
        setTx(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load transactions. Check endpoint.");
        setTx([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Transactions</h2>

      {err && <div className="p-3 border rounded-xl bg-red-50 text-red-600 text-sm">{err}</div>}

      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="p-3 border-b text-sm text-gray-500">Endpoint: {ENDPOINT}</div>

        {loading ? (
          <div className="p-4 text-gray-500">Loading…</div>
        ) : tx.length === 0 ? (
          <div className="p-4 text-gray-500">No transactions found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Item</th>
                <th className="text-left p-3">From</th>
                <th className="text-left p-3">To</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {tx.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="p-3 font-medium">{t.item?.title || t.item || "-"}</td>
                  <td className="p-3">{t.from?.email || t.from || "-"}</td>
                  <td className="p-3">{t.to?.email || t.to || "-"}</td>
                  <td className="p-3">{t.status || "-"}</td>
                  <td className="p-3">{t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-xs text-gray-500">
        Want approve/complete/cancel buttons? Send your transaction update endpoint.
      </div>
    </div>
  );
}
EOF
