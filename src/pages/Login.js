import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
          {isSignup ? 'Create account' : 'Welcome back'}
        </h1>
        <p style={{ color: '#666' }}>
          {isSignup ? 'Start your fitness journey' : 'Sign in to FitAI'}
        </p>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c00', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ ...inputStyle, marginBottom: 20 }}
      />

      <button onClick={handleSubmit} disabled={loading} style={btnStyle}>
        {loading ? 'Loading...' : isSignup ? 'Create account' : 'Sign in'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#666' }}>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}
        <span
          onClick={() => setIsSignup(!isSignup)}
          style={{ color: '#1D9E75', cursor: 'pointer', marginLeft: 6 }}
        >
          {isSignup ? 'Sign in' : 'Sign up'}
        </span>
      </p>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 14px', fontSize: 14,
  border: '1px solid #ddd', borderRadius: 10,
  marginBottom: 12, outline: 'none', display: 'block'
}

const btnStyle = {
  width: '100%', padding: '13px', background: '#1D9E75',
  color: 'white', border: 'none', borderRadius: 10,
  fontSize: 15, fontWeight: 500, cursor: 'pointer'
}