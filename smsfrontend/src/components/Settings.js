import React, { useEffect, useState } from "react";
import UserSidebarLayout from './UserSidebarLayout';
import axios from "axios";

const Settings = () => {
  const [user, setUser] = useState({ fullName: "", email: "" });
  const [config, setConfig] = useState({ sid: "", authToken: "", fromNumber: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  // Helper for Twilio flag
  const setTwilioFlag = (isSet) => {
    if (isSet) {
      localStorage.setItem("twilioConfigSet", "true");
    } else {
      localStorage.removeItem("twilioConfigSet");
    }
  };

  useEffect(() => {
    if (!token) {
      console.warn("❌ Token not found in localStorage");
      return;
    }

    axios.get("http://localhost:9190/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setUser(res.data);
      return axios.get(`http://localhost:9190/api/twilio/get?email=${res.data.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    })
    .then((res) => {
      if (res.data && res.data.sid && res.data.authToken && res.data.fromNumber) {
        setConfig(res.data);
        setTwilioFlag(true);
      } else {
        setTwilioFlag(false);
      }
    })
    .catch(() => {
      setTwilioFlag(false);
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
    }).then((res) => {
      // If Twilio fields are filled, set flag, else remove it
      if (config.sid && config.authToken && config.fromNumber) {
        setTwilioFlag(true);
      } else {
        setTwilioFlag(false);
      }
      setIsEditMode(false);
      setPassword("");
      alert("✅ Info updated");
    });
  };

  const isTwilioEmpty = !config.sid && !config.authToken && !config.fromNumber;

  return (
    <UserSidebarLayout>
      <div className="container mt-4">
        <h2 className="mb-4" style={{ color: '#2c3e50', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}>⚙️ Settings</h2>

        <div className="card shadow-lg mb-4">
          <div className="card-header bg-light fw-bold" style={{ borderBottom: '1px solid #ddd', padding: '15px' }}>👤 Profile Info</div>
          <div className="card-body p-4">
            <p style={{ color: '#34495e', fontSize: '16px' }}><strong>Email:</strong> {user.email}</p>

            {isEditMode ? (
              <>
                <div className="mb-3">
                  <label style={{ color: '#2c3e50', fontWeight: '500' }}>Full Name</label>
                  <input
                    className="form-control"
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                    style={{ borderRadius: '8px', padding: '10px', borderColor: '#ccc' }}
                  />
                </div>
                <div className="mb-3">
                  <label style={{ color: '#2c3e50', fontWeight: '500' }}>New Password (optional)</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ borderRadius: '8px', padding: '10px', borderColor: '#ccc' }}
                  />
                </div>
              </>
            ) : (
              <p style={{ color: '#34495e', fontSize: '16px' }}><strong>Full Name:</strong> {user.fullName}</p>
            )}
          </div>
        </div>

        <div className="card shadow-lg mb-4">
          <div className="card-header bg-light fw-bold" style={{ borderBottom: '1px solid #ddd', padding: '15px' }}>🔐 Twilio Config</div>
          <div className="card-body p-4">
            {isTwilioEmpty && (
              <div className="alert alert-warning" style={{ borderRadius: '8px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba' }}>
                ⚠️ You haven't configured your Twilio settings yet. Please set them up below.
              </div>
            )}

            {isEditMode ? (
              <>
                <div className="mb-3">
                  <label style={{ color: '#2c3e50', fontWeight: '500' }}>SID</label>
                  <input
                    className="form-control"
                    value={config.sid}
                    onChange={(e) => setConfig({ ...config, sid: e.target.value })}
                    style={{ borderRadius: '8px', padding: '10px', borderColor: '#ccc' }}
                  />
                </div>
                <div className="mb-3">
                  <label style={{ color: '#2c3e50', fontWeight: '500' }}>Auth Token</label>
                  <input
                    className="form-control"
                    value={config.authToken}
                    onChange={(e) => setConfig({ ...config, authToken: e.target.value })}
                    style={{ borderRadius: '8px', padding: '10px', borderColor: '#ccc' }}
                  />
                </div>
                <div className="mb-3">
                  <label style={{ color: '#2c3e50', fontWeight: '500' }}>From Number</label>
                  <input
                    className="form-control"
                    value={config.fromNumber}
                    onChange={(e) => setConfig({ ...config, fromNumber: e.target.value })}
                    style={{ borderRadius: '8px', padding: '10px', borderColor: '#ccc' }}
                  />
                </div>
              </>
            ) : (
              <>
                <p style={{ color: '#34495e', fontSize: '16px' }}><strong>SID:</strong> {config.sid}</p>
                <p style={{ color: '#34495e', fontSize: '16px' }}><strong>Auth Token:</strong> {config.authToken}</p>
                <p style={{ color: '#34495e', fontSize: '16px' }}><strong>From Number:</strong> {config.fromNumber}</p>
              </>
            )}
          </div>
        </div>

        <div className="text-end">
          {isEditMode ? (
            <>
              <button className="btn btn-secondary me-2" style={{ borderRadius: '20px', padding: '8px 20px', backgroundColor: '#6c757d', color: '#fff', transition: 'transform 0.2s' }} onClick={() => { setIsEditMode(false); setPassword(""); }}>
                Cancel
              </button>
              <button className="btn btn-success" style={{ borderRadius: '20px', padding: '8px 20px', backgroundColor: '#28a745', color: '#fff', transition: 'transform 0.2s' }} onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <button className="btn btn-primary" style={{ borderRadius: '20px', padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', transition: 'transform 0.2s' }} onClick={() => setIsEditMode(true)}>
              Edit My Info
            </button>
          )}
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default Settings;
