import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user)
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user)
        fetchProfile(session.user.id)
        setShowAuth(false)
      } else {
        setUser(null)
        setProfile(null)
      }
    })
  }, [])

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p style={{ color: '#666' }}>Loading...</p>
    </div>
  )

  if (user && profile) return <Dashboard user={user} profile={profile} />
  if (user && !profile) return <Onboarding user={user} onDone={() => fetchProfile(user.id)} />
  if (showAuth) return <Login onLogin={(u) => setUser(u)} />

  return <Landing onGetStarted={() => setShowAuth(true)} />
}