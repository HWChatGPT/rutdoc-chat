import { useState, useRef, useEffect } from 'react';

export default function RutDocChat() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
  console.log("Chat visibility:", visible);
}, [visible]);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "I'm RutDoc™ — ask me anything about scent, wind, or scrape setup.",
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        console.error('API error:', res.statusText);
        return;
      }

      const data = await res.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply || 'No reply received.' }]);
    } catch (err) {
      console.error('Request failed:', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

{!visible && (
  <div
    className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer z-50"
    onClick={() => setVisible(true)}
  >
    RutDoc™ Chat — Ask Me Anything
  </div>
)}

      {visible && (
        <div className="fixed bottom-20 right-4 w-full max-w-md h-[500px] bg-white rounded-xl shadow-xl flex flex-col z-50 border border-gray-300">
          <div className="flex-1 grow overflow-y-auto p-4 space-y-3 text-sm">
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

          <div className="flex border-t border-gray-200 p-2">
            <input
              className="flex-1 border rounded-md px-3 py-2 text-sm outline-none bg-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask RutDoc anything..."
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
