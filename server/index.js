const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))
const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: '../.env' })

const app = express()
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.post('/api/ai', async (req, res) => {
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
    console.log('GROQ:', JSON.stringify(data, null, 2))
    const text = data.choices[0].message.content
    res.json({ text })
  } catch (e) {
    console.error('ERROR:', e.message)
    res.status(500).json({ error: e.message })
  }
})

app.listen(3001, () => console.log('Server running on port 3001'))