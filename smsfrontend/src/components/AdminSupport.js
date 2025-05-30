import React, { useEffect, useState } from 'react';
import { getToken } from '../services/authService';
import './Support.css';
import AdminSidebarLayout from './AdminSidebarLayout'; // ✅ sidebar layout

const AdminSupport = () => {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const token = getToken();

  // ✅ Fetch logged-in admin email
  useEffect(() => {
    fetch('http://localhost:9190/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(user => setAdminEmail(user.email))
      .catch(console.error);
  }, []);

  // ✅ Fetch all users
  useEffect(() => {
    fetch('http://localhost:9190/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  // ✅ Fetch conversation
  useEffect(() => {
    if (!selectedEmail) return;
    fetch(`http://localhost:9190/api/support/${selectedEmail}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setMessages)
      .catch(console.error);
  }, [selectedEmail]);

  const handleSend = () => {
    if (!input || !selectedEmail) return;

    fetch('http://localhost:9190/api/support', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        receiverEmail: selectedEmail,
        content: input
      })
    })
      .then(res => res.json())
      .then(() => {
        setInput('');
        // refresh messages
        return fetch(`http://localhost:9190/api/support/${selectedEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json()).then(setMessages);
      })
      .catch(console.error);
  };

  return (
    <AdminSidebarLayout>
      <div className="container mt-4 support-page">
        <div className="support-chat">
          <div className="users-list">
            <h5>👥 Users</h5>
            <ul className="list-group">
              {users.map(user => (
                <li
                  key={user.id}
                  className={`list-group-item ${user.email === selectedEmail ? 'active' : ''}`}
                  onClick={() => setSelectedEmail(user.email)}
                >
                  {user.email}
                </li>
              ))}
            </ul>
          </div>

          <div className="chat-area">
            <h5>📨 Chat with: {selectedEmail || 'Select a user'}</h5>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`msg ${msg.senderEmail === adminEmail ? 'sent' : 'received'}`}
                >
                  <div className="bubble">{msg.content}</div>
                  <div className="timestamp">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {selectedEmail && (
              <div className="input-group mt-2">
                <input
                  className="form-control"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                />
                <button className="btn btn-primary" onClick={handleSend}>
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminSupport;
