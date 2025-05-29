// RutDoc V2.6 - Fully Redesigned UI with Avatar, ChatGPT-style polish

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

export default function RutDocChat() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "I'm RutDoc™ — ask me anything about scent, wind, or scrape setup."
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

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

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'RutDoc™ is thinking too hard. Try again.'
      }]);
    }
  };

  return (
    <>
      <div
        className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer"
        onClick={() => setVisible(true)}
      >
        RutDoc™ Chat — Ask Me Anything
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-20 right-4 w-[380px] max-h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl z-50 border border-gray-300 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <Image
                  src="/rutdoc-avatar.png"
                  alt="RutDoc Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-semibold">RutDoc™ — Your AI Hunting Scientist</span>
              </div>
              <button
                className="text-sm text-gray-500 hover:text-black"
                onClick={() => setVisible(false)}
              >
                &#10005;
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap px-4 py-2 rounded-xl max-w-[90%] ${
                    msg.role === 'user'
                      ? 'bg-gray-200 self-end text-right'
                      : 'bg-gray-100 self-start text-left'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3 flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Ask RutDoc anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                className="text-sm bg-black text-white rounded-full px-4 py-2 hover:bg-gray-800"
                onClick={handleSend}
              >
                Send
              </button>
            </div>

            {/* Disclaimer */}
            <div className="text-[10px] text-gray-400 px-4 pb-2 mt-1">
              RutDoc™ can make mistakes. Check important info.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
