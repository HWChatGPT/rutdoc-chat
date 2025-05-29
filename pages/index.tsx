// RutDoc Chat v2 – Full Upgrade: ChatGPT-style UX with animation polish

'use client';

import { useState, useRef, useEffect } from 'react';
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
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!res.ok) {
        console.error('API error:', res.statusText);
        return;
      }

      const data = await res.json();
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: data.reply || 'No reply received.'
      }]);
    } catch (err) {
      console.error('Request failed:', err);
    }
  };

  return (
    <>
      {/* Toggle Bubble */}
      {!visible && (
        <div
          className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer z-50 text-sm hover:bg-gray-800 transition"
          onClick={() => setVisible(true)}
        >
          RutDoc™ Chat — Ask Me Anything
        </div>
      )}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 w-full max-w-md h-[500px] bg-white rounded-xl shadow-xl flex flex-col z-50 border border-gray-300 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50">
              <span className="text-sm font-medium text-gray-700">RutDoc™ Chat — Ask Me Anything</span>
              <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-black text-sm">&times;</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div key={i} className={`whitespace-pre-wrap px-4 py-2 rounded-lg max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-gray-200 text-black self-end ml-auto'
                    : 'bg-green-100 text-black self-start'
                }`}>
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 px-3 py-2 flex">
              <input
                className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none bg-white"
                placeholder="Ask RutDoc anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="ml-2 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800"
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
