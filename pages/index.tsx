import { useState, useRef, useEffect } from 'react';

export default function RutDocChat() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "I'm RutDoc™ — ask me anything about scent, wind, or scrape setup.",
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      const res = await fetch('/api/rutdoc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'No reply received.' }]);
    } catch (err) {
      console.error('Request failed:', err);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {!visible && (
        <div
          className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer z-50 text-sm"
          onClick={() => setVisible(true)}
        >
          <img
            src="/rutdoc-avatar.png"
            alt="RutDoc Avatar"
            className="inline-block w-6 h-6 mr-2 rounded-full border border-white align-middle"
          />
          RutDoc™ Chat — Ask Me Anything
        </div>
      )}

      {visible && (
        <div className="fixed bottom-24 right-4 w-full max-w-md h-[500px] bg-white rounded-2xl shadow-xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-gray-300">
            <img
              src="/rutdoc-avatar.png"
              alt="RutDoc Avatar"
              className="w-10 h-10 rounded-full mr-3 border border-black"
            />
            <div className="text-sm font-bold">RutDoc™ — Your AI Hunting Scientist</div>
            <button onClick={() => setVisible(false)} className="ml-auto text-gray-400 hover:text-black text-lg">&times;</button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg px-4 py-2 whitespace-pre-wrap max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-gray-200 text-black self-end text-right'
                    : 'bg-green-100 text-black self-start text-left'
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 px-4 py-2 text-sm">
            <input
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask RutDoc™ anything..."
            />
            <button
              onClick={handleSend}
              className="mt-2 w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800"
            >
              Send
            </button>
            <div className="mt-2 text-xs text-gray-400 text-center">
              RutDoc™ can make mistakes. Check important info.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
