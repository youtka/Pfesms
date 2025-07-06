import React, { useEffect, useState } from 'react';
import { getToken } from '../services/authService';
import AdminSidebarLayout from './AdminSidebarLayout';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Support.css';

const AdminSupport = () => {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [newMsgNotif, setNewMsgNotif] = useState({});
  const token = getToken();

  // Get admin email
  useEffect(() => {
    fetch('http://localhost:9190/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(user => setAdminEmail(user.email))
      .catch(console.error);
  }, []);

  // Fetch users
  useEffect(() => {
    fetch('http://localhost:9190/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  // Fetch messages for selected user and set notification
  useEffect(() => {
    if (!selectedEmail) return;
    const fetchMessages = () => {
      fetch(`http://localhost:9190/api/support/${selectedEmail}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          // Check new messages from user
          const last = data[data.length - 1];
          setMessages(data);
          if (
            last &&
            last.senderEmail !== adminEmail &&
            (!newMsgNotif[selectedEmail] || newMsgNotif[selectedEmail] < last.timestamp)
          ) {
            setNewMsgNotif(prev => ({
              ...prev,
              [selectedEmail]: last.timestamp
            }));
            setTimeout(() => {
              setNewMsgNotif(prev => {
                const copy = { ...prev };
                delete copy[selectedEmail];
                return copy;
              });
            }, 5000);
          }
        })
        .catch(console.error);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [selectedEmail, adminEmail]);

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
            <h5>
              <i className="bi bi-people" /> Users
            </h5>
            <ul className="list-group">
              {users.map(user => (
                <li
                  key={user.id}
                  className={`list-group-item${user.email === selectedEmail ? ' active' : ''}`}
                  onClick={() => setSelectedEmail(user.email)}
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {user.email}
                  {newMsgNotif[user.email] && (
                    <span className="new-message-notif ms-auto">
                      <i className="bi bi-bell-fill"></i>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="chat-area">
            <h5>
              <i className="bi bi-chat-text"></i> Chat with: {selectedEmail || 'Select a user'}
            </h5>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.senderEmail === adminEmail ? 'sent' : 'received'}`}>
                  <div className="bubble">{msg.content}</div>
                  <div className="timestamp">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {selectedEmail && (
              <div className="input-group mt-3">
                <input
                  className="form-control"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                />
                <button className="btn btn-primary" onClick={handleSend}>
                  <i className="bi bi-send-fill"></i> Send
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
