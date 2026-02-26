export default function AdminDashboard() {
  const stats = [
    { title: "Total Users", value: "—", hint: "All registered users" },
    { title: "Items Listed", value: "—", hint: "Active listings" },
    { title: "Transactions", value: "—", hint: "Requests & exchanges" },
    { title: "Feedback", value: "—", hint: "Ratings & comments" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of ShareSpace activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.title} className="bg-white border rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-slate-500">{s.title}</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-white border rounded-2xl p-5 shadow-sm xl:col-span-2">
          <div className="font-bold text-slate-900">Quick Notes</div>
          <ul className="mt-3 text-sm text-slate-600 space-y-2 list-disc pl-5">
            <li>Approve/reject items from the Items tab (we can add buttons next).</li>
            <li>Track exchange flow in Transactions.</li>
            <li>Monitor user feedback quality and sentiment.</li>
          </ul>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="font-bold text-slate-900">Admin Actions</div>
          <div className="mt-3 grid gap-2">
            <a className="px-4 py-3 rounded-xl border hover:bg-slate-100" href="/admin/items">
              Review Items
            </a>
            <a className="px-4 py-3 rounded-xl border hover:bg-slate-100" href="/admin/users">
              View Users
            </a>
            <a className="px-4 py-3 rounded-xl border hover:bg-slate-100" href="/admin/feedback">
              Read Feedback
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
