import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebarLayout from "./UserSidebarLayout";

const SendSms = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [manualNumbers, setManualNumbers] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch categories from backend
  useEffect(() => {
    axios
      .get("http://localhost:9190/api/category/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("❌ Error loading categories", err));
  }, [token]);

  // Handle selecting/deselecting a single category
  const toggleCategory = async (categoryId, isChecked) => {
    let updatedIds = [...selectedCategoryIds];
    if (isChecked) {
      updatedIds.push(categoryId);
    } else {
      updatedIds = updatedIds.filter((id) => id !== categoryId);
    }
    setSelectedCategoryIds(updatedIds);

    // Update phone numbers textarea
    const updatedNumbers = new Set(
      manualNumbers.split(",").map((n) => n.trim()).filter((n) => n)
    );

    try {
      const res = await axios.get(
        `http://localhost:9190/api/number/by-category/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
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

  // Handle selecting/deselecting ALL categories
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

  // Generate message with AI
  const handleGenerateAIMessage = async () => {
    setLoading(true);
    try {
      const usePrompt = prompt.trim()
        ? prompt
        : "Generate a short SMS message for customer engagement.";
      const response = await axios.post(
        "http://localhost:9190/api/ai/generate",
        { prompt: usePrompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data);
    } catch (err) {
      alert("❌ Failed to generate message");
    } finally {
      setLoading(false);
    }
  };

  // Send SMS
  const handleSend = async () => {
    if (!manualNumbers.trim()) return alert("❌ Enter at least one phone number");
    if (!message.trim() && !useAI) return alert("❌ Message required");

    const payload = {
      categoryId:
        selectedCategoryIds.length === 1
          ? selectedCategoryIds[0]
          : null,
      numbers: manualNumbers // ✅ هنا بدّلنا الاسم
        ? manualNumbers.split(",").map((n) => n.trim()).filter((n) => n)
        : [],
      message,
      isAi: useAI,
      prompt: prompt,
      useCategory: selectedCategoryIds.length === 1,
    };

    console.log("Payload:", payload);

    try {
      const res = await axios.post(
        "http://localhost:9190/api/sms/send",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ SMS Sent");
      setMessage("");
      setManualNumbers("");
      setSelectedCategoryIds([]);
      setPrompt("");
    } catch (err) {
      alert("❌ Failed to send SMS");
    }
  };

  return (
    <UserSidebarLayout>
      <div className="container py-5">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4 p-md-5">
            <h3 className="mb-4 fw-bold text-primary">📤 Send SMS</h3>
            {/* Category selection */}
            <div className="mb-4">
              <label className="form-label fw-semibold d-flex align-items-center gap-2 mb-3">
                <i className="fas fa-layer-group text-primary"></i>
                Select Categories
              </label>
              {/* Select All */}
              <div className="bg-gradient-primary-subtle border border-primary border-opacity-25 rounded-4 p-3 mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                      <i className="fas fa-check-double text-primary"></i>
                    </div>
                    <span className="fw-medium text-primary">All Categories</span>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={
                        categories.length > 0 &&
                        selectedCategoryIds.length === categories.length
                      }
                      onChange={(e) => toggleAllCategories(e.target.checked)}
                      id="all-categories"
                      style={{ transform: 'scale(1.2)' }}
                    />
                  </div>
                </div>
              </div>
              {/* Individual Categories */}
              <div className="row g-3">
                {categories.map((cat) => (
                  <div className="col-md-6 col-lg-4" key={cat.id}>
                    <div
                      className={`card h-100 border-0 shadow-sm rounded-3 cursor-pointer transition-all ${
                        selectedCategoryIds.includes(cat.id)
                          ? 'border-primary border-2 bg-primary bg-opacity-10'
                          : 'hover-shadow-lg'
                      }`}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: selectedCategoryIds.includes(cat.id) ? 'translateY(-2px)' : 'none'
                      }}
                      onClick={() => toggleCategory(cat.id, !selectedCategoryIds.includes(cat.id))}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <div className={`rounded-circle p-2 ${
                              selectedCategoryIds.includes(cat.id)
                                ? 'bg-primary text-white'
                                : 'bg-light text-muted'
                            }`}>
                              <i className="fas fa-tag"></i>
                            </div>
                            <span className={`fw-medium ${
                              selectedCategoryIds.includes(cat.id)
                                ? 'text-primary'
                                : 'text-dark'
                            }`}>
                              {cat.name}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedCategoryIds.includes(cat.id)}
                              onChange={(e) =>
                                toggleCategory(cat.id, e.target.checked)
                              }
                              id={`cat-${cat.id}`}
                              style={{ transform: 'scale(1.1)' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Selection Summary */}
              {selectedCategoryIds.length > 0 && (
                <div className="mt-3 p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-check-circle text-success"></i>
                    <small className="text-success fw-medium">
                      {selectedCategoryIds.length} categor{selectedCategoryIds.length === 1 ? 'y' : 'ies'} selected
                    </small>
                  </div>
                </div>
              )}
            </div>
            {/* Phone Numbers */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Phone Numbers (comma-separated)
              </label>
              <textarea
                className="form-control rounded-3"
                rows="3"
                placeholder="e.g., +2126..., +2126..."
                value={manualNumbers}
                onChange={(e) => setManualNumbers(e.target.value)}
              />
            </div>
            {/* AI Prompt Toggle + Input */}
            <div className="form-check form-switch mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                checked={useAI}
                onChange={() => setUseAI(!useAI)}
                id="use-ai"
              />
              <label
                className="form-check-label fw-medium"
                htmlFor="use-ai"
              >
                Use AI to generate message
              </label>
            </div>
            {useAI && (
              <div className="mb-4">
                <label className="form-label fw-semibold">AI Prompt</label>
                <textarea
                  className="form-control rounded-3"
                  rows="2"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., promotion about iphone 300 dollar"
                />
              </div>
            )}
            {/* Message Box */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Message</label>
              <textarea
                className="form-control rounded-3"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message or use AI to generate one"
              />
            </div>
            {/* Buttons */}
            <div className="d-flex gap-2">
              {useAI && (
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={handleGenerateAIMessage}
                  disabled={loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "🧠 "
                  )}
                  {loading ? "Generating..." : "Generate with AI"}
                </button>
              )}
              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "📤 "
                )}
                {loading ? "Sending..." : "Send SMS"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default SendSms;
