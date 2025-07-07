import React, { useState, useRef, useEffect } from 'react';
import './MindBotChat.css';

export default function MindBotChat({ onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am MindBot 🤖. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/mindbot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      if (!res.ok) {
        setMessages(msgs => [...msgs, { sender: 'bot', text: 'Sorry, there was a problem connecting to MindBot.' }]);
      } else {
        const data = await res.json();
        setMessages(msgs => [...msgs, { sender: 'bot', text: data.reply || '...' }]);
      }
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Error: ' + e.message }]);
    }
    setLoading(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !loading) sendMessage();
  };

  return (
    <div className="mindbot-chat-modal">
      <div className="mindbot-chat-header">
        <span>MindBot 🤖</span>
        <button className="mindbot-close-btn" onClick={onClose}>×</button>
      </div>
      <div className="mindbot-chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`mindbot-msg ${msg.sender}`}>{msg.text}</div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="mindbot-chat-input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>Send</button>
      </div>
    </div>
  );
}
