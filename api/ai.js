const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { prompt, system } = req.body
    const messages = []
    if (system) messages.push({ role: 'system', content: system })
    messages.push({ role: 'user', content: prompt })

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1000,
        messages
      })
    })
    const data = await response.json()
    res.json({ text: data.choices[0].message.content })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}