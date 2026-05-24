import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login({ onLogin, darkMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const bg = darkMode ? '#0d0d10' : '#fff'
  const cardBg = darkMode ? '#131316' : '#f8f8ff'
  const text = darkMode ? '#fff' : '#111'
  const textSub = darkMode ? '#888' : '#666'
  const border = darkMode ? '#2a2a30' : '#e8e6ff'
  const inputBg = darkMode ? '#1a1a20' : '#fff'

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else alert('Check your email to confirm your account!')
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else onLogin(data.user)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, background: '#7F77DD', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'white', margin: '0 auto 12px', letterSpacing: -1 }}>R</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: text, letterSpacing: 2 }}>REPS</div>
          <div style={{ fontSize: 14, color: textSub, marginTop: 4 }}>
            {isSignup ? 'Start your fitness journey' : 'Welcome back'}
          </div>
        </div>

        <div style={{ background: cardBg, borderRadius: 16, padding: 24, border: `0.5px solid ${border}` }}>
          {error && (
            <div style={{ background: '#1E1B3A', color: '#AFA9EC', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
              {error}
            </div>
          )}
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', fontSize: 14, border: `0.5px solid ${border}`, borderRadius: 10, marginBottom: 12, outline: 'none', background: inputBg, color: text, display: 'block' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', fontSize: 14, border: `0.5px solid ${border}`, borderRadius: 10, marginBottom: 20, outline: 'none', background: inputBg, color: text, display: 'block' }} />
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '13px', background: '#7F77DD', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            {loading ? 'Loading...' : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: textSub }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)} style={{ color: '#7F77DD', cursor: 'pointer', marginLeft: 6 }}>
            {isSignup ? 'Sign in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  )
}