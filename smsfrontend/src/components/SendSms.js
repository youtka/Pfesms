import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebarLayout from "./UserSidebarLayout";

const SendSms = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [manualNumbers, setManualNumbers] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:9190/api/category/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error("❌ Error loading categories", err));
  }, [token]);

  const toggleCategory = async (categoryId, isChecked) => {
    let updatedIds = [...selectedCategoryIds];
    if (isChecked) {
      updatedIds.push(categoryId);
    } else {
      updatedIds = updatedIds.filter((id) => id !== categoryId);
    }
    setSelectedCategoryIds(updatedIds);

    const updatedNumbers = new Set(
      manualNumbers.split(",").map((n) => n.trim()).filter((n) => n)
    );

    try {
      const res = await axios.get(
        `http://localhost:9190/api/number/by-category/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      res.data.forEach((n) => {
        if (isChecked) {
          updatedNumbers.add(n.phoneNumber);
        } else {
          updatedNumbers.delete(n.phoneNumber);
        }
      });
      setManualNumbers(Array.from(updatedNumbers).join(", "));
    } catch (err) {
      console.error("❌ Failed to fetch numbers for category", categoryId, err);
    }
  };

  const toggleAllCategories = async (checked) => {
    if (checked) {
      const allIds = categories.map((c) => c.id);
      setSelectedCategoryIds(allIds);

      try {
        const responses = await Promise.all(
          categories.map((cat) =>
            axios.get(`http://localhost:9190/api/number/by-category/${cat.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        const allNumbers = new Set();
        responses.forEach((res) => {
          res.data.forEach((n) => allNumbers.add(n.phoneNumber));
        });
        setManualNumbers(Array.from(allNumbers).join(", "));
      } catch (err) {
        console.error("❌ Failed to fetch all numbers", err);
      }
    } else {
      setSelectedCategoryIds([]);
      setManualNumbers("");
    }
  };

  const handleGenerateAIMessage = async () => {
    setLoading(true);
    try {
      const prompt = "Generate a short SMS message for customer engagement.";
      const response = await axios.post(
        "http://localhost:9190/api/ai/generate",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data);
    } catch (err) {
      alert("❌ Failed to generate message");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return alert("❌ Message required");
    if (!manualNumbers.trim()) return alert("❌ Enter at least one phone number");

    const payload = {
      categoryId: null,
      numbers: manualNumbers
        ? manualNumbers.split(",").map((n) => n.trim()).filter((n) => n)
        : [],
      message,
      isAi: useAI,
    };

    try {
      const res = await axios.post("http://localhost:9190/api/sms/send", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ SMS Sent");
      setMessage("");
      setManualNumbers("");
      setSelectedCategoryIds([]);
    } catch (err) {
      alert("❌ Failed to send SMS");
    }
  };

  return (
    <UserSidebarLayout>
      <div className="container mt-4">
        <h3 className="mb-4">📤 Send SMS</h3>

        <div className="mb-3">
          <label>Select Categories:</label>
          <div className="d-flex flex-wrap gap-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={categories.length > 0 && selectedCategoryIds.length === categories.length}
                onChange={(e) => toggleAllCategories(e.target.checked)}
                id="all-categories"
              />
              <label className="form-check-label" htmlFor="all-categories">
                All Categories
              </label>
            </div>

            {categories.map((cat) => (
              <div className="form-check" key={cat.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedCategoryIds.includes(cat.id)}
                  onChange={(e) => toggleCategory(cat.id, e.target.checked)}
                  id={`cat-${cat.id}`}
                />
                <label className="form-check-label" htmlFor={`cat-${cat.id}`}>
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label>Manual Numbers (comma-separated):</label>
          <textarea
            className="form-control"
            rows="2"
            placeholder="+2126..., +2126..., ..."
            value={manualNumbers}
            onChange={(e) => setManualNumbers(e.target.value)}
          />
        </div>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={useAI}
            onChange={() => setUseAI(!useAI)}
          />
          <label className="form-check-label">Use AI to generate message</label>
        </div>

        <div className="mb-3">
          <label>Message:</label>
          <textarea
            className="form-control"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message or use AI"
          />
        </div>

        {useAI && (
          <button
            className="btn btn-secondary me-2"
            onClick={handleGenerateAIMessage}
            disabled={loading}
          >
            {loading ? "Generating..." : "🧠 Generate with AI"}
          </button>
        )}

        <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "📤 Send SMS"}
        </button>
      </div>
    </UserSidebarLayout>
  );
};

export default SendSms;
