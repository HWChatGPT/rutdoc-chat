import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
console.log('RutDoc API called with:', JSON.stringify(req.body, null, 2));

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              "You are RutDoc™, a scent strategist trained on whitetail communication. Speak clearly and tactically. Never guess. Never hype. Never name competitors. Only teach what works.",
          },
          ...messages,
        ],
      }),
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || '[No reply]';
    res.status(200).json({ reply });
  } catch (err) {
    console.error('Error from OpenAI:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
