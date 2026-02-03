cat > src/layouts/AdminLayout.jsx << 'EOF'
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/sharespace-logo.png";

const navLinkClass = ({ isActive }) =>
  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm " +
  (isActive
    ? "bg-gray-900 text-white"
    : "text-gray-700 hover:bg-gray-100");

function Badge({ text }) {
  return (
    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border">
      {text}
    </span>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-72 bg-white border-r min-h-screen p-4">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="ShareSpace" className="h-12 w-12 rounded-xl border bg-white object-contain p-1" />
            <div>
              <div className="font-bold text-lg leading-tight">ShareSpace</div>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </div>

          <nav className="space-y-1">
            <NavLink className={navLinkClass} to="/admin">Dashboard</NavLink>
            <NavLink className={navLinkClass} to="/admin/items">Items</NavLink>
            <NavLink className={navLinkClass} to="/admin/users">Users</NavLink>
            <NavLink className={navLinkClass} to="/admin/transactions">Transactions</NavLink>
            <NavLink className={navLinkClass} to="/admin/feedback">Feedback</NavLink>
          </nav>

          <div className="mt-8 p-3 rounded-xl border bg-gray-50">
            <div className="text-xs text-gray-500">Signed in as</div>
            <div className="font-medium text-sm truncate">{user?.email || "Admin"}</div>
            <div className="mt-2"><Badge text="admin" /></div>

            <button
              onClick={logout}
              className="mt-4 w-full bg-white border rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm text-gray-500">ShareSpace</div>
                <div className="text-2xl font-bold">Admin Dashboard</div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-gray-500">Tip:</span>
                <span className="text-xs px-2 py-1 rounded-full border bg-white">
                  Edit API endpoints in <b>src/api/client.js</b>
                </span>
              </div>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
EOF
