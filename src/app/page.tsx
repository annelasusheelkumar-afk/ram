'use client';
import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMessage = { role: 'assistant', content: data.reply };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">ServeAi Chat</h1>
      <div className="w-full max-w-md flex flex-col gap-2 overflow-y-auto h-[60vh] border rounded p-3 bg-white shadow-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex w-full max-w-md mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-l px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded-r">
          Send
        </button>
      </form>
    </main>
  );
}
