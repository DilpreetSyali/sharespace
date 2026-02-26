import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/sharespace-logo.png";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/items", label: "Items" },
  { to: "/admin/transactions", label: "Transactions" },
  { to: "/admin/feedback", label: "Feedback" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout?.();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 p-4">
        <div className="card w-full p-4 flex flex-col">
          <div className="flex items-center gap-3 p-2">
            <img src={logo} alt="ShareSpace" className="w-10 h-10 object-contain" />
            <div>
              <div className="text-slate-900 font-extrabold leading-5">ShareSpace</div>
              <div className="text-xs text-slate-500">Admin Panel</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {nav.map((x) => (
              <NavLink
                key={x.to}
                to={x.to}
                end={x.to === "/admin"}
                className={({ isActive }) =>
                  [
                    "px-4 py-3 rounded-xl font-semibold transition block",
                    isActive
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")
                }
              >
                {x.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <button onClick={onLogout} className="btn btn-ghost w-full">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 p-4 md:p-6">
        <div className="card p-4 md:p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">ShareSpace</div>
            <div className="text-lg font-extrabold text-slate-900">Admin Console</div>
          </div>
          <div className="text-xs text-slate-500">From students, for students</div>
        </div>

        <div className="mt-4 md:mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
