import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebarLayout from "./UserSidebarLayout";

const SmsInsights = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const saved = localStorage.getItem("sms_ai_chat");
    if (saved && messages.length === 0) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sms_ai_chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  const fetchStatsAndAnalyze = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:9190/api/statistics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { totalSmsSent, messagesPerCategory, messagesPerDay } = res.data;
      const mostUsedCat = Object.entries(messagesPerCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
      const leastUsedCat = Object.entries(messagesPerCategory).sort((a, b) => a[1] - b[1])[0]?.[0] || "N/A";
      const topDay = Object.entries(messagesPerDay).sort((a, b) => b[1] - a[1])[0];

      const prompt = `Here are the SMS usage stats:\n- Total messages: ${totalSmsSent}\n- Most used category: ${mostUsedCat}\n- Least used: ${leastUsedCat}\n- Days with high activity: ${topDay?.[0]} (${topDay?.[1]} messages)\n\nPlease provide suggestions or observations on how this user can improve their SMS strategy.`;

      const initialMessage = { role: "user", content: prompt };

      const response = await axios.post("http://localhost:9190/api/ai/analyze", [initialMessage], {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages([{ role: "user", content: prompt }, { role: "assistant", content: response.data }]);
    } catch (err) {
      console.error("❌ AI Analysis Error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:9190/api/ai/analyze", newMessages, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([...newMessages, { role: "assistant", content: res.data }]);
    } catch (err) {
      alert("❌ Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserSidebarLayout>
      <div className="container mt-4">
        <h3 className="mb-4">🤖 SMS AI Insights</h3>
        <button className="btn btn-primary mb-3" onClick={fetchStatsAndAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "🔍 Analyze SMS Usage"}
        </button>

        <div className="chat-box p-3 mb-3 border rounded bg-light" style={{ height: 300, overflowY: "auto" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.role === "user" ? "text-end" : "text-start"}`}>
              <strong>{msg.role === "user" ? "You" : "AI"}</strong>: {msg.content}
            </div>
          ))}
        </div>

        <div className="input-group">
          <input
            className="form-control"
            placeholder="Ask follow-up..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={loading}
          />
          <button className="btn btn-success" onClick={handleSend} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default SmsInsights;
