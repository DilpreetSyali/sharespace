import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConversationList from "../components/ConversationList.jsx";
import ChatBox from "../components/ChatBox.jsx";
import PageShell from "../components/PageShell.jsx";
import api from "../api/client";

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");

      try {
        const res = await api.get("/api/conversations");
        setConversations(res.data || []);
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
      <div className="h-[calc(100vh-110px)] overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="grid h-full grid-cols-1 md:grid-cols-[1fr_340px]">
          <div className="min-h-0">
            <ChatBox
              conversationId={conversationId}
              onBack={() => navigate("/inbox")}
            />
          </div>

          <div className="min-h-0">
            <ConversationList
              conversations={conversations}
              loading={loading}
              err={err}
              selectedConversationId={conversationId}
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}