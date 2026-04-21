import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PageShell from "../components/PageShell.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

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

      await login(payload);
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
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-2">
            Login to see items from your college only.
          </p>

          {err && (
            <div className="mt-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg sm:rounded-xl p-4 flex items-start gap-3">
              <span>⚠️</span>
              <span>{err}</span>
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition"
                name="email"
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5\">Password</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-lg py-3 px-4 font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 transition mt-6 shadow-sm hover:shadow-md\"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-slate-600 mt-5 text-center">
            New here?{" "}
            <Link className="font-semibold text-slate-900 hover:underline" to="/signup">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}