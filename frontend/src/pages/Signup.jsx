import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import PageShell from "../components/PageShell.jsx";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeID: "",
    role: "student",
  });

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
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        collegeID: form.collegeID.trim(),
        role: form.role,
      };

      await api.post("/api/users/register", payload);
      navigate("/login");
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Signup failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="grid lg:grid-cols-2 gap-6 items-center">
        <div className="hidden lg:block">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Sell to your campus. Buy from your campus.
            </h1>
            <p className="mt-3 text-slate-600">
              ShareSpace shows listings only from your <span className="font-semibold">same college</span>.
              Faster deals, safer chats, and cheaper items.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <Feature title="Same-college feed" desc="Only your campus listings." />
              <Feature title="Quick posting" desc="List items in minutes." />
              <Feature title="Better prices" desc="Save money on essentials." />
              <Feature title="Trusted community" desc="Students & faculty." />
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-900">Create your account</h2>
            <p className="text-sm text-slate-500 mt-1">
              Start with your college name. You’ll see campus listings after login.
            </p>

            {err && (
              <div className="mt-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-2xl p-3">
                {err}
              </div>
            )}

            <form onSubmit={submit} className="mt-5 space-y-3">
              <Input name="name" placeholder="Full name" value={form.name} onChange={onChange} />
              <Input name="email" placeholder="Email" value={form.email} onChange={onChange} />
              <Input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />

              <Input
                name="collegeID"
                placeholder="College (exact name)"
                value={form.collegeID}
                onChange={onChange}
              />

              <select
                className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
                name="role"
                value={form.role}
                onChange={onChange}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>

              <button
                disabled={loading}
                className="w-full rounded-2xl p-3 font-extrabold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 transition"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>

            <p className="text-sm text-slate-600 mt-4">
              Already have an account?{" "}
              <Link className="font-semibold text-slate-900 underline" to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Input({ name, value, onChange, placeholder, type = "text" }) {
  return (
    <input
      className="w-full border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-slate-200"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      required
    />
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="font-bold text-slate-900">{title}</div>
      <div className="text-sm text-slate-600 mt-1">{desc}</div>
    </div>
  );
}