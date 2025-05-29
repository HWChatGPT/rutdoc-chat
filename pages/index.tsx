import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
      setMessages([...updatedMessages, { role: 'assistant', content: 'No reply received.' }]);
    }
  };

  return (
    <>
      {/* Bubble Button */}
      {!visible && (
        <div
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer"
          onClick={() => setVisible(true)}
        >
          <img src="/rutdoc-avatar.png" alt="RutDoc" className="w-6 h-6 rounded-full" />
          <span className="text-sm font-medium">RutDoc™ Chat — Ask Me Anything</span>
        </div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-4 right-4 z-50 w-[95vw] max-w-md md:max-w-lg lg:max-w-xl h-[75vh] bg-white rounded-xl shadow-xl flex flex-col border border-gray-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <div className="text-sm font-semibold">RutDoc™ — Your AI Hunting Scientist</div>
              <button className="text-gray-400 hover:text-black" onClick={() => setVisible(false)}>
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-4 py-2 whitespace-pre-wrap max-w-[85%] ${
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

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-gray-200 px-4 py-2">
              <input
                className="flex-1 border rounded-md px-3 py-2 text-sm outline-none"
                placeholder="Ask RutDoc anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-black text-white px-3 py-2 rounded-md text-sm hover:bg-gray-800"
              >
                Send
              </button>
            </div>

            {/* Disclaimer */}
            <div className="text-[10px] text-gray-400 px-4 pb-2 text-center">
              RutDoc™ can make mistakes. Check important info.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
