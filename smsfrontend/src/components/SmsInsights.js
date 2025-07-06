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
        <h3 className="mb-4" style={{ color: '#2c3e50', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>🤖 SMS AI Insights</h3>
        <button className="btn btn-primary mb-3" style={{ backgroundColor: '#3498db', border: 'none', padding: '10px 20px', borderRadius: '20px', transition: 'transform 0.3s', color: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} onClick={fetchStatsAndAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "🔍 Analyze SMS Usage"}
        </button>

        <div className="chat-box p-3 mb-3 border rounded-4 bg-white shadow-lg" style={{ height: 300, overflowY: "auto", backgroundColor: '#f5f7fa' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`mb-3 p-2 rounded-3 ${msg.role === "user" ? "bg-primary text-white text-end" : "bg-light text-dark text-start"}`} style={{ maxWidth: "70%", marginLeft: msg.role === "user" ? "auto" : "0", transition: "opacity 0.3s", boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div className="d-flex align-items-center">
                <span style={{ fontSize: "24px", marginRight: "10px" }}>{msg.role === "user" ? "👤" : "🤖"}</span>
                <div>
                  <strong style={{ color: msg.role === "user" ? "#fff" : "#2c3e50" }}>{msg.role === "user" ? "You" : "AI"}</strong>: {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="input-group shadow-sm rounded-4 overflow-hidden" style={{ backgroundColor: '#fff' }}>
          <input
            className="form-control border-0"
            placeholder="Ask follow-up..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={loading}
            style={{ padding: "15px", fontSize: "16px", backgroundColor: 'transparent' }}
          />
          <button className="btn btn-success" style={{ backgroundColor: '#28a745', border: 'none', padding: '10px 20px', borderRadius: '0 20px 20px 0', transition: 'transform 0.3s', color: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} onClick={handleSend} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default SmsInsights;