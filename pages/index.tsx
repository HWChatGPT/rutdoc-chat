// pages/index.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RutDocChat() {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "I'm RutDoc™ — ask me anything about scent, wind, or scrape setup."
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
    }
  }, [visible]);

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
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'No reply received.' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Request failed. Please try again later.' }]);
    }
  };

  return (
    <>
      <div
        className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer z-50"
        onClick={() => setVisible(true)}
      >
        RutDoc™ Chat — Ask Me Anything
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 w-[90vw] max-w-md h-[65vh] bg-white text-black rounded-xl shadow-xl flex flex-col z-50 border border-gray-300"
          >
            <div className="flex justify-between items-center border-b border-gray-200 p-3">
              <div className="font-semibold text-sm">RutDoc™ Chat — Ask Me Anything</div>
              <button
                onClick={() => setVisible(false)}
                className="text-gray-500 hover:text-black text-sm"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-4 py-2 whitespace-pre-wrap max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-gray-200 text-black self-end text-right ml-auto'
                      : 'bg-green-100 text-black self-start text-left mr-auto'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex border-t border-gray-200 p-3">
              <input
                ref={inputRef}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
