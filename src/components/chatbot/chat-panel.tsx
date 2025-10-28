'use client';
import { useState } from 'react';

export default function ChatPanel() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi! How can I help you today?' }]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const reply = data.reply || 'Sorry, I did not understand that.';
      setMessages([...newMessages, { sender: 'bot', text: reply }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'bot', text: 'Error: Unable to connect.' }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-xs ${
              msg.sender === 'bot' ? 'bg-blue-200 self-start' : 'bg-green-200 self-end'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded-lg p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
