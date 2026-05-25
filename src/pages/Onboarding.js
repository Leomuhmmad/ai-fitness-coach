import { useState } from 'react'
import { supabase } from '../supabase'

const goals = [
  { id: 'lose_weight', label: 'Lose Weight', icon: '🔥' },
  { id: 'build_muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'stay_healthy', label: 'Stay Healthy', icon: '❤️' },
  { id: 'get_fit', label: 'Get Fit', icon: '🏃' },
]

export default function Onboarding({ user, onDone, darkMode }) {
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [loading, setLoading] = useState(false)

  const t = darkMode ? {
    bg: '#0d0d10', bgS: '#131316', bgCard: '#1a1a20',
    text: '#fff', textS: '#888', border: '#2a2a30',
    accent: '#7F77DD', accentBg: '#1E1B3A',
  } : {
    bg: '#fff', bgS: '#f8f8ff', bgCard: '#fff',
    text: '#111', textS: '#666', border: '#e8e6ff',
    accent: '#7F77DD', accentBg: '#EEEDFE',
  }

  const handleFinish = async () => {
    setLoading(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id, name, goal,
      age: parseInt(age),
      weight_kg: parseFloat(weight),
      height_cm: parseFloat(height)
    })
    if (!error) onDone()
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, background: '#7F77DD', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white', margin: '0 auto 10px', letterSpacing: -1 }}>R</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2, color: t.text }}>REPS</div>
        </div>

        <div style={{ background: t.bgS, borderRadius: 18, padding: 24, border: `0.5px solid ${t.border}` }}>
          {step === 1 && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 6 }}>What's your goal?</h2>
              <p style={{ fontSize: 13, color: t.textS, marginBottom: 20 }}>Coach Alex will build a plan just for you</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {goals.map(g => (
                  <div key={g.id} onClick={() => setGoal(g.id)} style={{ padding: '18px 12px', borderRadius: 12, textAlign: 'center', cursor: 'pointer', border: goal === g.id ? `1.5px solid #7F77DD` : `0.5px solid ${t.border}`, background: goal === g.id ? t.accentBg : t.bgCard, transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{g.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: goal === g.id ? '#7F77DD' : t.text }}>{g.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} disabled={!goal} style={{ width: '100%', padding: '13px', background: '#7F77DD', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: !goal ? 0.5 : 1 }}>
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 6 }}>Tell us about you</h2>
              <p style={{ fontSize: 13, color: t.textS, marginBottom: 20 }}>For a more accurate plan</p>
              {[
                { label: 'Your name', val: name, set: setName, type: 'text', placeholder: 'Leo' },
                { label: 'Age', val: age, set: setAge, type: 'number', placeholder: '25' },
                { label: 'Weight (kg)', val: weight, set: setWeight, type: 'number', placeholder: '75' },
                { label: 'Height (cm)', val: height, set: setHeight, type: 'number', placeholder: '175' },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: t.textS, display: 'block', marginBottom: 5, fontWeight: 500 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={f.val} onChange={e => f.set(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', fontSize: 14, border: `0.5px solid ${t.border}`, borderRadius: 10, outline: 'none', background: t.bgCard, color: t.text }} />
                </div>
              ))}
              <button onClick={handleFinish} disabled={loading || !name || !age} style={{ width: '100%', padding: '13px', background: '#7F77DD', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4, opacity: (!name || !age) ? 0.5 : 1 }}>
                {loading ? 'Setting up...' : 'Start with REPS 🚀'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}