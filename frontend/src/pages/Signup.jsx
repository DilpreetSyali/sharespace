import { useState } from "react";
import { COLLEGES } from "/workspaces/sharespace/frontend/src/constants/ colleges";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PageShell from "../components/PageShell.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeID: "",
    customCollege: "",
    role: "student",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const finalCollege =
        form.collegeID === "Other" ? form.customCollege.trim() : form.collegeID.trim();

      if (!finalCollege) {
        setErr("Please select or enter your college");
        setLoading(false);
        return;
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        collegeID: finalCollege,
        role: form.role,
      };

      await signup(payload);
      navigate("/dashboard");
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Signup failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="grid items-center gap-6 lg:gap-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-lg">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Sell to your campus.<br/>Buy from your campus.
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              ShareSpace shows listings only from your <span className="font-semibold text-slate-900">same college</span>. Faster deals, safer chats, and cheaper items.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Feature title="Same-college feed" desc="Only your campus listings." />
              <Feature title="Quick posting" desc="List items in minutes." />
              <Feature title="Better prices" desc="Save money on essentials." />
              <Feature title="Trusted community" desc="Students & faculty." />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-900">Create your account</h2>
            <p className="mt-1 text-sm text-slate-500">
              Start with your college name. You’ll see campus listings after signup.
            </p>

            {err && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {err}
              </div>
            )}

            <form onSubmit={submit} className="mt-5 space-y-3">
              <Input name="name" placeholder="Full name" value={form.name} onChange={onChange} />
              <Input name="email" placeholder="Email" value={form.email} onChange={onChange} />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
              />

              <select
                className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-200"
                name="collegeID"
                value={form.collegeID}
                onChange={onChange}
                required
              >
                <option value="">Select your college</option>
                {COLLEGES.map((college, index) => (
                  <option key={`${college}-${index}`} value={college}>
                    {college}
                  </option>
                ))}
              </select>

              {form.collegeID === "Other" && (
                <Input
                  name="customCollege"
                  placeholder="Enter your college name"
                  value={form.customCollege}
                  onChange={onChange}
                />
              )}

              <select
                className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-200"
                name="role"
                value={form.role}
                onChange={onChange}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 p-3 font-extrabold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-600">
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
      className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-200"
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
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
    </div>
  );
}