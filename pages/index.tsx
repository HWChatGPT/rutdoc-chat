// RutDoc v2.2 UI Upgrade
// Includes: Styling polish, layout fixes, typing indicator, avatar-ready

'use client';

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
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/rutdoc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data = await res.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: "RutDoc couldn't reply. Try again." }]);
    } finally {
      setIsThinking(false);
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 w-[90vw] max-w-md h-[75vh] max-h-[600px] bg-white rounded-xl shadow-xl flex flex-col z-50 border border-gray-300 overflow-hidden"
          >
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 text-sm font-semibold">
              <span>RutDoc™ Chat — Ask Me Anything</span>
              <button onClick={() => setVisible(false)} className="text-gray-500">&#x2715;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div key={i} className={`rounded-lg px-4 py-2 max-w-[85%] whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gray-200 text-black self-end text-right ml-auto' : 'bg-green-100 text-black self-start text-left mr-auto'}`}>
                  {msg.content}
                </div>
              ))}
              {isThinking && (
                <div className="bg-green-50 text-black px-4 py-2 rounded-lg text-sm w-fit animate-pulse">
                  RutDoc is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex border-t border-gray-200 p-2">
              <input
                ref={inputRef}
                className="flex-1 border rounded-md px-3 py-2 text-sm outline-none"
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
