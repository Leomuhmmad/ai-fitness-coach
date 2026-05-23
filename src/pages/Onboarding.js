import { useState } from 'react'
import { supabase } from '../supabase'

const goals = [
  { id: 'lose_weight', label: 'Lose Weight', icon: '🔥' },
  { id: 'build_muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'stay_healthy', label: 'Stay Healthy', icon: '❤️' },
  { id: 'get_fit', label: 'Get Fit', icon: '🏃' },
]

export default function Onboarding({ user, onDone }) {
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFinish = async () => {
    setLoading(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name, goal, age: parseInt(age),
      weight_kg: parseFloat(weight),
      height_cm: parseFloat(height)
    })
    if (!error) onDone()
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: '0 20px' }}>
      {step === 1 && (
        <>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>What's your goal?</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>AI will build a plan just for you</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {goals.map(g => (
              <div key={g.id} onClick={() => setGoal(g.id)}
                style={{
                  padding: '20px 12px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                  border: goal === g.id ? '2px solid #1D9E75' : '1px solid #ddd',
                  background: goal === g.id ? '#E1F5EE' : 'white'
                }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{g.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{g.label}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={!goal} style={btnStyle}>
            Continue →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Tell us about you</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>For a more accurate plan</p>
          {[
            { label: 'Your name', val: name, set: setName, type: 'text', placeholder: 'Leo' },
            { label: 'Age', val: age, set: setAge, type: 'number', placeholder: '25' },
            { label: 'Weight (kg)', val: weight, set: setWeight, type: 'number', placeholder: '75' },
            { label: 'Height (cm)', val: height, set: setHeight, type: 'number', placeholder: '175' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={f.val}
                onChange={e => f.set(e.target.value)} style={inputStyle} />
            </div>
          ))}
          <button onClick={handleFinish} disabled={loading || !name || !age} style={btnStyle}>
            {loading ? 'Saving...' : 'Start my journey 🚀'}
          </button>
        </>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '11px 14px', fontSize: 14,
  border: '1px solid #ddd', borderRadius: 10, outline: 'none'
}
const btnStyle = {
  width: '100%', padding: '13px', background: '#1D9E75',
  color: 'white', border: 'none', borderRadius: 10,
  fontSize: 15, fontWeight: 500, cursor: 'pointer'
}