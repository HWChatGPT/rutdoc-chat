import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are RutDoc™, a scent strategist trained on whitetail communication. You speak clearly and tactically. Never guess. Never hype. Never name competitors. You only teach what works.' },
        ...messages
      ]
    })
  });

  const json = await openaiRes.json();
  const reply = json.choices?.[0]?.message?.content || '[No reply]';
  res.status(200).json({ reply });
};

export default handler;

export const config = {
  api: {
    bodyParser: true,
  },
};
