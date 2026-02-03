cat > src/pages/admin/AdminLogin.jsx << 'EOF'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/sharespace-logo.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // Change this endpoint if your backend uses a different one:
      // e.g. /api/admin/login
      const res = await client.post("/api/users/login", { email, password });

      // Expected: { token, user }
      const token = res.data?.token;
      const user = res.data?.user;

      if (!token || !user) {
        throw new Error("Backend did not return { token, user }");
      }

      login(token, user);
      nav("/admin");
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="ShareSpace" className="h-20 w-20 rounded-2xl border bg-white object-contain p-2" />
          <h1 className="text-2xl font-bold mt-3">Admin Login</h1>
          <p className="text-sm text-gray-500">Manage users, items, transactions & feedback</p>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-xl border text-sm text-red-600 bg-red-50">
            {err}
            <div className="text-xs text-red-500 mt-1">
              If this is an endpoint issue, update <b>/api/users/login</b> in <b>AdminLogin.jsx</b>.
            </div>
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">Email</label>
            <input
              className="w-full border p-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600">Password</label>
            <input
              className="w-full border p-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-gray-200"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-lg p-2 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-xs text-gray-500 mt-4">
          Note: You must login with an account having <b>role: "admin"</b> (or <b>isAdmin: true</b>).
        </div>
      </div>
    </div>
  );
}
EOF
