import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";

export default function MessagesBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/conversations");
        const conversations = res.data || [];
        const unread = conversations.filter((conv) => conv.unread).length;
        setUnreadCount(unread);
      } catch {
        setUnreadCount(0);
      }
    };

    load();
    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      to="/inbox"
      className="relative rounded-lg p-2.5 transition hover:bg-slate-100 active:bg-slate-200"
      title="Messages"
    >
      <svg
        className="h-5 w-5 sm:h-6 sm:w-6 text-slate-900"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>

      {unreadCount > 0 && (
        <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shadow-md" />
      )}
    </Link>
  );
}