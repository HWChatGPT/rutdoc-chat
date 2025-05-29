// RutDoc v2.5 UI Upgrade
// Full index.tsx for Next.js + React site using framer-motion and Tailwind CSS
// Includes clean input, scrollable message history, disclaimer, avatar, and mobile responsiveness

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

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
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply || 'No reply received.' }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: 'Request failed. Please try again.' }]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Toggle Button */}
      {!visible && (
        <div
          onClick={() => setVisible(true)}
          className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer z-50 flex items-center gap-2"
        >
          <Image
            src="/avatar_rutdoc.png"
            alt="RutDoc Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          RutDoc™ Chat — Ask Me Anything
        </div>
      )}

      {/* Chat Bubble */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 w-[360px] max-h-[70vh] bg-white border border-gray-300 rounded-2xl shadow-xl flex flex-col z-50 overflow-hidden sm:w-[90vw] sm:right-2"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b text-sm font-semibold bg-white">
              <span>RutDoc™ — Your AI Hunting Scientist</span>
              <button onClick={() => setVisible(false)} className="text-xl font-bold">&times;</button>
            </div>

            {/* Message Display */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap rounded-lg px-4 py-2 max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-gray-200 text-black self-end ml-auto'
                      : 'bg-gray-100 text-black self-start mr-auto'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t px-3 py-2 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask RutDoc anything..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={handleSend}
                className="text-sm px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
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
