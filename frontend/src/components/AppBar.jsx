import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";   // ✅ ADD THIS

export default function AppBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === "/signup" || location.pathname === "/login";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <Link to={user?.token ? "/dashboard" : "/signup"} className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-2xl bg-slate-100 grid place-items-center overflow-hidden border">
            <img
              src={logo}        // ✅ USE IMPORTED LOGO
              alt="ShareSpace"
              className="h-full w-full object-contain p-1"
            />
          </div>

          <div className="leading-tight">
            <div className="text-lg font-extrabold text-slate-900">ShareSpace</div>
            <div className="text-xs text-slate-500 -mt-0.5">Campus buy & sell</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {user?.token ? (
            <>
              <div className="hidden md:block text-right mr-2">
                <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
                <div className="text-xs text-slate-500 truncate max-w-56">{user?.collegeID}</div>
              </div>

              <Link
                to="/items/new"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
              >
                + Post
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold transition"
              >
                Logout
              </button>
            </>
          ) : (
            !isAuthPage && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                >
                  Sign up
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}