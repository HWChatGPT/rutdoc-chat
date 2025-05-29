import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Request failed. Please try again.' },
      ]);
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full text-sm shadow-lg z-50 flex items-center space-x-2"
        >
          <img src="/rutdoc-avatar.png" alt="RutDoc Avatar" className="w-6 h-6 rounded-full" />
          <span>RutDoc™ Chat — Ask Me Anything</span>
        </button>
      )}

      {/* Chat Bubble */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 right-4 w-full max-w-md bg-white shadow-xl rounded-xl z-50 flex flex-col border border-gray-300 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center p-3 border-b border-gray-200 bg-gray-100">
              <img src="/rutdoc-avatar.png" alt="RutDoc Avatar" className="w-8 h-8 rounded-full mr-2" />
              <div className="text-sm font-semibold">RutDoc™ — Your AI Hunting Scientist</div>
              <button onClick={() => setVisible(false)} className="ml-auto text-sm text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-lg whitespace-pre-wrap max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-gray-200 text-black self-end text-right'
                      : 'bg-gray-100 text-black self-start text-left'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-2 flex items-center space-x-2 bg-white">
              <input
                type="text"
                placeholder="Ask RutDoc™ anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Send
              </button>
            </div>

            {/* Disclaimer */}
            <div className="text-[10px] text-gray-400 text-center p-1 pb-2 bg-white">
              RutDoc™ can make mistakes. Check important info.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
