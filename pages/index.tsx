import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RutDocChat() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "I'm RutDoc™ — ask me anything about scent, wind, or scrape setup."
    }
  ]);
  const [input, setInput] = useState('');
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

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: 'RutDoc couldn\'t respond. Try again.' }]);
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 w-[90vw] max-w-md h-[70vh] bg-white rounded-xl shadow-xl flex flex-col z-50 border border-gray-300"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-orange-500 text-white rounded-t-xl">
              <span className="text-sm font-semibold">Your AI Hunting Scientist</span>
              <button onClick={() => setVisible(false)} className="text-white font-bold text-lg">×</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-4 py-2 max-w-[85%] whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-gray-200 text-black self-end text-right ml-auto'
                      : 'bg-green-100 text-black self-start text-left'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 px-4 py-2 flex">
              <input
                autoFocus
                className="flex-1 border rounded-md px-3 py-2 text-sm outline-none bg-white"
                placeholder="Ask RutDoc anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
