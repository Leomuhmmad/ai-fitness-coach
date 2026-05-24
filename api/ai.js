export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { messages, prompt, system } = req.body
    const chatMessages = messages || [{ role: 'user', content: prompt }]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: system || 'You are a helpful fitness coach.' },
          ...chatMessages
        ]
      })
    })
    const data = await response.json()
    res.json({ text: data.choices[0].message.content })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}