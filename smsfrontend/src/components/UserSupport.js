import React, { useEffect, useRef, useState } from 'react';
import { getCurrentUser, getToken } from '../services/authService';
import UserSidebarLayout from './UserSidebarLayout';
import './Support.css';

const UserSupport = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const token = getToken();
  const chatEndRef = useRef(null);

  useEffect(() => {
    getCurrentUser()
      .then(user => setUserEmail(user.email))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userEmail]);

  const fetchMessages = () => {
    fetch(`http://localhost:9190/api/support/admin@gmail.com`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        scrollToBottom();
      })
      .catch(console.error);
  };

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    fetch('http://localhost:9190/api/support', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        receiverEmail: 'admin@gmail.com',
        content: input.trim()
      })
    })
      .then(res => res.json())
      .then(() => {
        setInput('');
        fetchMessages();
      })
      .catch(console.error);
  };

  return (
    <UserSidebarLayout>
      <div className="container mt-4 support-page">
        <h5>💬 Support Chat with Admin</h5>
        <div className="chat-area">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`msg ${msg.senderEmail === userEmail ? 'sent' : 'received'}`}
              >
                <div className="bubble">{msg.content}</div>
                <div className="timestamp">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

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
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default UserSupport;
