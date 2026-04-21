import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";
import MessagesBell from "./MessagesBell.jsx";

function AnimatedBrand() {
  const words = ["CONNECT", "SELL", "DONATE", "SAVE", "SHARESPACE"];
  const durations = [2000, 2000, 2000, 2000, 5000];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
    }, Math.max(durations[index] - 250, 250));

    const changeTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % words.length);
      setVisible(true);
    }, durations[index]);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(changeTimer);
    };
  }, [index]);

  const isFinal = words[index] === "SHARESPACE";

  return (
    <div className="flex h-7 items-center overflow-hidden sm:h-8">
      <span
        className={`block transform uppercase transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        } ${
          isFinal
            ? "text-[20px] sm:text-[26px] tracking-[0.04em]"
            : "text-[16px] sm:text-[20px] tracking-[0.08em]"
        } text-slate-900`}
        style={{
          fontFamily: '"Bricolage Grotesque", "Montserrat", sans-serif',
          fontWeight: 800,
          fontVariationSettings: '"wdth" 110',
          lineHeight: 1,
          textShadow: isFinal
            ? `
              1px 1px 0 rgba(0,0,0,0.20),
              2px 2px 0 rgba(0,0,0,0.14),
              3px 3px 0 rgba(0,0,0,0.08)
            `
            : `
              1px 1px 0 rgba(0,0,0,0.14),
              2px 2px 0 rgba(0,0,0,0.08)
            `,
        }}
      >
        {words[index]}
      </span>
    </div>
  );
}

export default function AppBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/signup" || location.pathname === "/login";

  const isLoggedIn = !!user?.token;
  const displayName = user?.name?.trim();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
        <Link
          to={isLoggedIn ? "/dashboard" : "/signup"}
          className="flex flex-shrink-0 items-center gap-3"
        >
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 shadow-sm">
            <img
              src={logo}
              alt="ShareSpace"
              className="h-full w-full object-contain p-1"
            />
          </div>

          <div className="leading-tight block">
            <AnimatedBrand />
            <div
              className="mt-1 uppercase text-[9px] sm:text-[11px] text-slate-700"
              style={{
                fontFamily: '"Bricolage Grotesque", "Montserrat", sans-serif',
                fontWeight: 800,
                letterSpacing: "0.18em",
                lineHeight: 1,
                textShadow: `
                  1px 1px 0 rgba(0,0,0,0.10),
                  2px 2px 0 rgba(0,0,0,0.05)
                `,
              }}
            >
              Campus Buy & Sell
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isAuthPage && isLoggedIn && displayName && (
            <div className="hidden text-sm font-semibold text-slate-700 sm:block sm:text-base">
              Hi,{" "}
              <span className="font-bold text-slate-900">
                {displayName.split(" ")[0]}
              </span>
            </div>
          )}

          {!isAuthPage && isLoggedIn ? (
            <>
              <MessagesBell />

              <Link
                to="/items/new"
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md sm:rounded-xl sm:px-4 sm:text-base"
              >
                + Post
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:text-base"
              >
                Logout
              </button>
            </>
          ) : !isAuthPage ? (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:text-base"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md sm:rounded-xl sm:px-4 sm:text-base"
              >
                Sign up
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}