// --- FRONTEND --- //
// File: /pages/index.tsx
import { useState } from 'react';

export default function RutDocChat() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'I\'m RutDoc™ — ask me anything about scent, wind, or scrape setup.' }
  ]);
  const [input, setInput] = useState('');

const handleSend = async (): Promise<void> => {
  console.log('HANDLE_SEND_TRIGGERED with input:', input);
  console.log('sending to backend...');

  if (!input.trim()) return;

  const userMessage = { role: 'user', content: input };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  setInput('');

  try {
    const res = await fetch('/api/rutdoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    if (!res.ok) {
      console.error('API error:', res.statusText);
      return;
    }

    console.log('response status:', res.status);
    const data = await res.json();
    console.log('API returned:', data);
    setMessages([...updatedMessages, { role: 'assistant', content: data.reply || 'No reply received.' }]);
  } catch (err) {
    console.error('Request failed:', err);
  }
};

  return (
    <>
      <div
        className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer z-50"
        onClick={() => setVisible(!visible)}
      >
        RutDoc™ Chat — Ask Me Anything
      </div>

      {visible && (
        <div className="fixed bottom-20 right-4 w-96 max-w-full h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-50">
          <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md ${msg.role === 'user' ? 'bg-gray-200 text-black self-end' : 'bg-green-100 text-black self-start'}`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex border-t p-2">
            <input
              className="flex-1 border rounded-md px-2 py-1 text-black"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask RutDoc anything..."
            />
            <button onClick={handleSend} className="ml-2 bg-black text-white px-4 py-1 rounded-md">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
