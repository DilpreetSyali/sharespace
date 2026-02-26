import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await api.post("/api/users/login", form);
      localStorage.setItem("sharespace_user", JSON.stringify(res.data));
      setUser(res.data);
      navigate("/dashboard");
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Login</h1>
          <p className="text-sm text-slate-500">Access your college marketplace.</p>
        </div>

        {err && (
          <div className="text-sm bg-red-50 text-red-700 border border-red-200 rounded-xl p-3">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-xl p-3 font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-slate-600">
          New here?{" "}
          <Link className="font-semibold text-slate-900 underline" to="/signup">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16, background: '#f6f7fb' },
  card: { width: '100%', maxWidth: 420, background: 'white', padding: 18, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' },
  title: { margin: 0, fontSize: 22 },
  sub: { marginTop: 6, marginBottom: 14, color: '#555', fontSize: 14 },
  input: { padding: 10, borderRadius: 10, border: '1px solid #ddd', outline: 'none' },
  btn: { padding: 10, borderRadius: 10, border: 'none', cursor: 'pointer', background: '#111', color: 'white', fontWeight: 600 },
  err: { background: '#ffe3e3', color: '#a40000', padding: 10, borderRadius: 10, marginBottom: 10, fontSize: 14 },
}