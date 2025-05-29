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
  const messageEndRef = useRef<HTMLDivElement>(null);

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
      const data = await res.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: 'No reply received.' }]);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div
        className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer z-50"
        onClick={() => setVisible(true)}
      >
        <div className="flex items-center gap-2">
          <img src="/rutdoc-avatar.png" alt="RutDoc Avatar" className="w-6 h-6 rounded-full" />
          <span className="text-sm font-semibold">RutDoc™ Chat — Ask Me Anything</span>
        </div>
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 w-[90vw] max-w-md h-[75vh] bg-white rounded-2xl shadow-xl flex flex-col z-50 border border-gray-300"
          >
            <div className="flex justify-between items-center px-4 pt-4">
              <div className="flex items-center gap-2">
                <img src="/rutdoc-avatar.png" alt="RutDoc Avatar" className="w-8 h-8 rounded-full" />
                <span className="text-xs font-semibold">RutDoc™ — Your AI Hunting Scientist</span>
              </div>
              <button
                className="text-sm text-gray-400 hover:text-black"
                onClick={() => setVisible(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-4 py-2 whitespace-pre-wrap max-w-[90%] ${
                    msg.role === 'user'
                      ? 'bg-gray-200 text-black self-end text-right ml-auto'
                      : 'bg-green-100 text-black self-start text-left'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            <div className="border-t border-gray-200 p-2">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 border rounded-full px-4 py-2 text-sm outline-none bg-gray-100"
                  placeholder="Ask RutDoc™ anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 text-sm bg-black text-white rounded-full hover:bg-gray-800"
                >
                  Send
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center pt-1">
                RutDoc™ can make mistakes. Check important info.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
