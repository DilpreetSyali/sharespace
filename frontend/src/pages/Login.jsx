import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import PageShell from "../components/PageShell.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      const res = await api.post("/api/users/login", payload);
      localStorage.setItem("sharespace_user", JSON.stringify(res.data));
      setUser(res.data);
      navigate("/dashboard");
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Login failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-1">
            Login to see items from your college only.
          </p>

          {err && (
            <div className="mt-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-2xl p-3">
              {err}
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              required
            />
            <input
              className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              required
            />

            <button
              disabled={loading}
              className="w-full rounded-2xl p-3 font-extrabold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-slate-600 mt-4">
            New here?{" "}
            <Link className="font-semibold text-slate-900 underline" to="/signup">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}