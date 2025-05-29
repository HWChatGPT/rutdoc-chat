import { useState, useRef, useEffect } from 'react';

export default function RutDocChat() {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "I'm RutDoc™ — ask me anything about scent, wind, or scrape setup.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

      if (!res.ok) {
        console.error('API error', res.statusText);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'No reply received.' }]);
    } catch (err) {
      console.error('Request failed:', err);
    }
  };

  return (
    <>
      {!visible && (
        <div
          className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer z-50"
          onClick={() => setVisible(true)}
        >
          RutDoc™ Chat — Ask Me Anything
        </div>
      )}

      {visible && (
        <div className="fixed bottom-4 right-4 w-[90vw] sm:w-[400px] max-h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="flex justify-between items-center px-4 py-2 border-b text-sm font-semibold bg-gray-50">
            <span>RutDoc™ Chat — Ask Me Anything</span>
            <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-gray-800">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`px-4 py-2 max-w-[80%] rounded-lg whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gray-200 text-black self-end ml-auto text-right'
                    : 'bg-green-100 text-black self-start mr-auto text-left'
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center border-t px-4 py-2 bg-gray-50">
            <input
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask RutDoc anything..."
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
