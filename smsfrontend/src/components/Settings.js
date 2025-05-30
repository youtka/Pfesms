import React, { useEffect, useState } from "react";
import UserSidebarLayout from './UserSidebarLayout'; // ✅ Sidebar layout wrapper
import axios from "axios";

const Settings = () => {
  const [user, setUser] = useState({ fullName: "", email: "" });
  const [config, setConfig] = useState({ sid: "", authToken: "", fromNumber: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.warn("❌ Token not found in localStorage");
      return;
    }

    axios.get("http://localhost:9190/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log("✅ USER DATA:", res.data);
      setUser(res.data);

      return axios.get(`http://localhost:9190/api/twilio/get?email=${res.data.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    })
    .then((res) => {
      console.log("✅ TWILIO CONFIG:", res.data);
      if (res.data) setConfig(res.data);
    })
    .catch((err) => {
      console.error("❌ Error fetching user or config data:", err);
    });
  }, [token]);

  const handleSave = () => {
    axios.put("http://localhost:9190/api/user/update", {
      fullName: user.fullName,
      password: password !== "" ? password : undefined
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    axios.post("http://localhost:9190/api/twilio/save", {
      userEmail: user.email,
      sid: config.sid,
      authToken: config.authToken,
      fromNumber: config.fromNumber
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setIsEditMode(false);
    setPassword("");
    alert("✅ Info updated");
  };

  const isTwilioEmpty = !config.sid && !config.authToken && !config.fromNumber;

  return (
    <UserSidebarLayout>
      <div className="container mt-4">
        <h2 className="mb-4">⚙️ Settings</h2>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light fw-bold">👤 Profile Info</div>
          <div className="card-body">
            <p><strong>Email:</strong> {user.email}</p>

            {isEditMode ? (
              <>
                <div className="mb-3">
                  <label>Full Name</label>
                  <input
                    className="form-control"
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label>New Password (optional)</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <p><strong>Full Name:</strong> {user.fullName}</p>
            )}
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light fw-bold">🔐 Twilio Config</div>
          <div className="card-body">
            {isTwilioEmpty && (
              <div className="alert alert-warning">
                ⚠️ You haven't configured your Twilio settings yet. Please set them up below.
              </div>
            )}

            {isEditMode ? (
              <>
                <div className="mb-3">
                  <label>SID</label>
                  <input
                    className="form-control"
                    value={config.sid}
                    onChange={(e) => setConfig({ ...config, sid: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label>Auth Token</label>
                  <input
                    className="form-control"
                    value={config.authToken}
                    onChange={(e) => setConfig({ ...config, authToken: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label>From Number</label>
                  <input
                    className="form-control"
                    value={config.fromNumber}
                    onChange={(e) => setConfig({ ...config, fromNumber: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <>
                <p><strong>SID:</strong> {config.sid}</p>
                <p><strong>Auth Token:</strong> {config.authToken}</p>
                <p><strong>From Number:</strong> {config.fromNumber}</p>
              </>
            )}
          </div>
        </div>

        <div className="text-end">
          {isEditMode ? (
            <>
              <button className="btn btn-secondary me-2" onClick={() => { setIsEditMode(false); setPassword(""); }}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setIsEditMode(true)}>
              Edit My Info
            </button>
          )}
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default Settings;
