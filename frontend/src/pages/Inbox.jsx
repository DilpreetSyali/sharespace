import { useEffect, useState } from "react";
import ConversationList from "../components/ConversationList.jsx";
import ChatBox from "../components/ChatBox.jsx";
import PageShell from "../components/PageShell.jsx";
import api from "../api/client";

export default function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");

      try {
        const res = await api.get("/api/conversations");
        const all = res.data || [];
        setConversations(all);

        if (all.length > 0 && !selectedConversationId) {
          setSelectedConversationId(all[0]._id);
        }
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <PageShell>
      <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-lg">
        <div className="grid h-full grid-cols-1 md:grid-cols-[1fr_340px]">
          <div className="min-h-0">
            <ChatBox
              conversationId={selectedConversationId}
              onBack={() => setSelectedConversationId("")}
            />
          </div>

          <div className="min-h-0 hidden md:flex flex-col border-l border-slate-200">
            <ConversationList
              conversations={conversations}
              loading={loading}
              err={err}
              selectedConversationId={selectedConversationId}
              onSelect={(conv) => setSelectedConversationId(conv._id)}
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}