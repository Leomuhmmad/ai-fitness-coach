import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import ExerciseGif from '../components/ExerciseGif'

const isMobile = () => window.innerWidth <= 768

export default function Dashboard({ user, profile, darkMode, setDarkMode }) {
  const [screen, setScreen] = useState('home')
  const [workoutPlan, setWorkoutPlan] = useState(null)
  const [nutritionPlan, setNutritionPlan] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [checked, setChecked] = useState({})
  const [streak, setStreak] = useState(0)
  const [todayDone, setTodayDone] = useState(false)
  const [activeTimer, setActiveTimer] = useState(null)
  const [timerInterval, setTimerInterval] = useState(null)
  const [workoutHistory, setWorkoutHistory] = useState([])
  const [mobile, setMobile] = useState(isMobile())

  const t = darkMode ? {
    bg: '#0d0d10', bgS: '#131316', bgCard: '#1a1a20',
    accent: '#7F77DD', accentBg: '#1E1B3A', accentText: '#AFA9EC',
    text: '#fff', textS: '#888', textM: '#555', border: '#2a2a30',
  } : {
    bg: '#fff', bgS: '#f8f8ff', bgCard: '#fff',
    accent: '#7F77DD', accentBg: '#EEEDFE', accentText: '#534AB7',
    text: '#111', textS: '#666', textM: '#bbb', border: '#f0f0f0',
  }

  useEffect(() => {
    fetchPlans()
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPlans = async () => {
    const { data: wp } = await supabase.from('workout_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
    const { data: np } = await supabase.from('nutrition_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
    if (wp?.length) setWorkoutPlan(wp[0].plan)
    if (np?.length) setNutritionPlan(np[0].plan)
    const today = new Date().toISOString().split('T')[0]
    const { data: tp } = await supabase.from('progress').select('*').eq('user_id', user.id).eq('date', today).single()
    if (tp?.workout_done) setTodayDone(true)
    const { data: sd } = await supabase.rpc('calculate_streak', { p_user_id: user.id })
    if (sd !== null) setStreak(sd)
    const { data: history } = await supabase.from('workout_history').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(10)
    if (history) setWorkoutHistory(history)
  }

  const callAI = async (messages, systemMsg = '') => {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, system: systemMsg })
    })
    const data = await res.json()
    return data.text
  }

  const generatePlan = async () => {
    setLoadingAI(true)
    try {
      const prompt = `Create a detailed weekly home workout plan for:
- Goal: ${profile.goal}, Age: ${profile.age}, Weight: ${profile.weight_kg}kg, Height: ${profile.height_cm}cm
- Equipment: None
Respond ONLY with JSON, no markdown:
{"days":[{"day":"Monday","focus":"Upper Body","exercises":[{"name":"Push-ups","sets":3,"reps":"15","rest":"60s"}]}],"tips":["tip1"]}`
      const text = await callAI([{ role: 'user', content: prompt }])
      const plan = JSON.parse(text.replace(/```json|```/g, '').trim())
      await supabase.from('workout_plans').insert({ user_id: user.id, plan })
      setWorkoutPlan(plan)
    } catch (e) { alert('Error generating plan.') }
    setLoadingAI(false)
  }

  const generateNutrition = async () => {
    setLoadingAI(true)
    try {
      const prompt = `Create a daily nutrition plan for:
- Goal: ${profile.goal}, Weight: ${profile.weight_kg}kg, Height: ${profile.height_cm}cm, Age: ${profile.age}
Respond ONLY with JSON, no markdown:
{"calories":2000,"protein":150,"carbs":200,"fats":60,"meals":[{"time":"8:00 AM","name":"Breakfast","foods":"Eggs, toast","calories":480,"protein":32}]}`
      const text = await callAI([{ role: 'user', content: prompt }])
      const plan = JSON.parse(text.replace(/```json|```/g, '').trim())
      await supabase.from('nutrition_plans').insert({ user_id: user.id, plan })
      setNutritionPlan(plan)
    } catch (e) { alert('Error generating nutrition plan.') }
    setLoadingAI(false)
  }

  const askCoach = async () => {
    if (!question.trim()) return
    setAsking(true)
    const userMsg = question
    setQuestion('')
    const newHistory = [...chatHistory, { role: 'user', content: userMsg }]
    setChatHistory(newHistory)
    try {
      const answer = await callAI(newHistory, `You are Coach Alex, an expert fitness and nutrition coach. The user's goal is ${profile.goal}, age ${profile.age}, weight ${profile.weight_kg}kg. Give concise, motivating advice.`)
      setChatHistory([...newHistory, { role: 'assistant', content: answer }])
    } catch (e) {
      setChatHistory([...newHistory, { role: 'assistant', content: 'Error connecting. Try again.' }])
    }
    setAsking(false)
  }

  const markTodayDone = async () => {
    const today = new Date().toISOString().split('T')[0]
    const exercisesDone = Object.entries(checked).filter(([_, v]) => v).map(([k]) => k)
    await supabase.from('progress').upsert({ user_id: user.id, date: today, workout_done: true }, { onConflict: 'user_id,date' })
    await supabase.from('workout_history').insert({
      user_id: user.id, date: today,
      exercises_done: exercisesDone,
      total_exercises: workoutPlan?.days?.[0]?.exercises?.length || 0,
      completed_exercises: exercisesDone.length
    })
    setTodayDone(true)
    setStreak(prev => prev + 1)
    setWorkoutHistory(prev => [{ date: today, completed_exercises: exercisesDone.length, total_exercises: workoutPlan?.days?.[0]?.exercises?.length || 0 }, ...prev])
  }

  const startTimer = (key, seconds) => {
    if (timerInterval) clearInterval(timerInterval)
    setActiveTimer({ key, seconds, total: seconds, running: true })
    const interval = setInterval(() => {
      setActiveTimer(prev => {
        if (!prev || prev.seconds <= 1) { clearInterval(interval); return { ...prev, seconds: 0, running: false } }
        return { ...prev, seconds: prev.seconds - 1 }
      })
    }, 1000)
    setTimerInterval(interval)
  }

  const stopTimer = () => { if (timerInterval) clearInterval(timerInterval); setActiveTimer(null) }
  const parseRest = (rest) => { const n = parseInt(rest); return isNaN(n) ? 60 : n }
  const signOut = async () => { await supabase.auth.signOut(); window.location.reload() }
  const toggleCheck = (key) => setChecked(p => ({ ...p, [key]: !p[key] }))
  const doneCount = Object.values(checked).filter(Boolean).length

  const navItems = [
    { id: 'home', icon: 'ti-home', label: 'Home' },
    { id: 'nutrition', icon: 'ti-apple', label: 'Nutrition' },
    { id: 'progress', icon: 'ti-chart-bar', label: 'Progress' },
    { id: 'profile', icon: 'ti-user', label: 'Profile' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: t.bg, minHeight: '100vh', display: 'flex', color: t.text }}>

      {!mobile && (
        <div style={{ width: 220, flexShrink: 0, position: 'fixed', left: 0, top: 0, bottom: 0, borderRight: `0.5px solid ${t.border}`, padding: '20px 12px', background: t.bgS, display: 'flex', flexDirection: 'column', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', marginBottom: 32 }}>
            <div style={{ width: 30, height: 30, background: '#7F77DD', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 15, fontWeight: 700, letterSpacing: -1 }}>R</div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: 2, color: t.text }}>REPS</span>
            <button onClick={() => setDarkMode(!darkMode)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          {navItems.map(tab => (
            <button key={tab.id} onClick={() => setScreen(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: screen === tab.id ? t.accentBg : 'none', border: 'none', borderRadius: 10, cursor: 'pointer', width: '100%', marginBottom: 4, textAlign: 'left' }}>
              <i className={`ti ${tab.icon}`} style={{ fontSize: 18, color: screen === tab.id ? t.accent : t.textS }} aria-hidden="true"></i>
              <span style={{ fontSize: 14, color: screen === tab.id ? t.accent : t.textS, fontWeight: screen === tab.id ? 600 : 400 }}>{tab.label}</span>
            </button>
          ))}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ padding: '0 14px', marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: t.accent, marginBottom: 8 }}>
                {profile.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{profile.name}</div>
              <div style={{ fontSize: 11, color: t.textS, marginTop: 2 }}>{user.email}</div>
            </div>
            <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'none', border: 'none', borderRadius: 10, cursor: 'pointer', width: '100%', color: '#e74c3c', fontSize: 13 }}>
              <i className="ti ti-logout" aria-hidden="true"></i> Sign out
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, marginLeft: mobile ? 0 : 220, paddingBottom: mobile ? 80 : 0 }}>

        {mobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `0.5px solid ${t.border}`, background: t.bgS }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, background: '#7F77DD', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700, letterSpacing: -1 }}>R</div>
              <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: 2, color: t.text }}>REPS</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>{darkMode ? '☀️' : '🌙'}</button>
              <button onClick={signOut} style={{ fontSize: 12, color: t.textS, background: 'none', border: 'none', cursor: 'pointer' }}>Sign out</button>
            </div>
          </div>
        )}

        <div style={{ maxWidth: 800, margin: '0 auto', padding: mobile ? '20px 16px' : '32px 40px' }}>

          {screen === 'home' && (
            <div>
              <div style={{ background: darkMode ? 'linear-gradient(135deg,#1E1B3A,#2D2458)' : '#7F77DD', borderRadius: 18, padding: mobile ? 20 : 28, color: 'white', marginBottom: 24 }}>
                <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div style={{ fontSize: mobile ? 20 : 26, fontWeight: 700, marginBottom: 16 }}>
                  Good {new Date().getHours() < 12 ? 'morning' : 'evening'}, {profile.name} 👋
                </div>
                <div style={{ display: 'flex', gap: 28 }}>
                  <div><div style={{ fontSize: 22, fontWeight: 700 }}>{streak} 🔥</div><div style={{ fontSize: 11, opacity: 0.75 }}>Streak</div></div>
                  <div><div style={{ fontSize: 22, fontWeight: 700 }}>{doneCount}</div><div style={{ fontSize: 11, opacity: 0.75 }}>Done today</div></div>
                  <div><div style={{ fontSize: 16, fontWeight: 600 }}>{profile.goal?.replace('_', ' ')}</div><div style={{ fontSize: 11, opacity: 0.75 }}>Goal</div></div>
                </div>
              </div>

              <div style={{ background: t.bgS, borderRadius: 16, padding: 16, marginBottom: 20, border: `0.5px solid ${darkMode ? t.border : '#e8e6ff'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏋️</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>Coach Alex</div>
                      <div style={{ fontSize: 11, color: t.textS }}>Your AI personal trainer</div>
                    </div>
                  </div>
                  {chatHistory.length > 0 && (
                    <button onClick={() => setChatHistory([])} style={{ fontSize: 12, color: t.textS, background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
                  )}
                </div>
                {chatHistory.length > 0 && (
                  <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {chatHistory.map((msg, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '82%', padding: '8px 12px', borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', fontSize: 13, lineHeight: 1.5, background: msg.role === 'user' ? '#7F77DD' : t.bgCard, color: msg.role === 'user' ? 'white' : t.text, border: msg.role === 'assistant' ? `0.5px solid ${t.border}` : 'none' }}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {asking && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{ padding: '8px 12px', borderRadius: '12px 12px 12px 2px', fontSize: 13, background: t.bgCard, border: `0.5px solid ${t.border}`, color: t.textS }}>Thinking...</div>
                      </div>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && askCoach()}
                    placeholder={chatHistory.length > 0 ? 'Continue...' : 'Ask Coach Alex anything...'}
                    style={{ flex: 1, padding: '10px 12px', fontSize: 13, border: `0.5px solid ${t.border}`, borderRadius: 10, outline: 'none', background: t.bgCard, color: t.text }} />
                  <button onClick={askCoach} disabled={asking} style={{ padding: '10px 14px', background: '#7F77DD', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>
                    <i className="ti ti-send" aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              {!todayDone ? (
                <button onClick={markTodayDone} style={{ width: '100%', padding: '14px', background: '#7F77DD', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}>
                  Complete Today's Workout ✓
                </button>
              ) : (
                <div style={{ width: '100%', padding: '14px', background: t.accentBg, borderRadius: 12, fontSize: 14, fontWeight: 600, textAlign: 'center', color: t.accent, marginBottom: 20 }}>
                  🎉 Workout done! Streak: {streak} 🔥
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.textM, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Weekly Plan</div>
                <button onClick={generatePlan} disabled={loadingAI} style={{ fontSize: 12, color: t.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  {loadingAI ? 'Generating...' : workoutPlan ? '↻ Regenerate' : '✦ Generate with AI'}
                </button>
              </div>

              {!workoutPlan ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: t.bgS, borderRadius: 14, color: t.textS, fontSize: 14, border: `0.5px solid ${t.border}` }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>💪</div>
                  <div>Tap "Generate with AI" to get your weekly plan</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {workoutPlan.days?.map((day, dayIndex) => {
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day.day
                    return (
                      <div key={dayIndex} style={{ borderRadius: 14, overflow: 'hidden', border: isToday ? '1.5px solid #7F77DD' : `0.5px solid ${t.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: isToday ? '#7F77DD' : t.bgS }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: isToday ? 'white' : t.text }}>{day.day} {isToday && '← Today'}</div>
                            <div style={{ fontSize: 11, color: isToday ? 'rgba(255,255,255,0.8)' : t.textS, marginTop: 1 }}>{day.focus}</div>
                          </div>
                          <div style={{ fontSize: 11, color: isToday ? 'rgba(255,255,255,0.75)' : t.textM }}>{day.exercises?.length} exercises</div>
                        </div>
                        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 8, background: t.bgCard }}>
                          {day.exercises?.map((ex, i) => {
                            const key = `day-${dayIndex}-ex-${i}`
                            const restSecs = parseRest(ex.rest)
                            const isActive = activeTimer?.key === key
                            return (
                              <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: `0.5px solid ${checked[key] ? '#7F77DD' : t.border}` }}>
                                {/* GIF */}
                                {isToday && (
                                  <ExerciseGif exerciseName={ex.name} darkMode={darkMode} />
                                )}
                                {/* Exercise Info */}
                                <div onClick={() => isToday && toggleCheck(key)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: checked[key] ? t.accentBg : t.bgCard, cursor: isToday ? 'pointer' : 'default' }}>
                                  {isToday && (
                                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: checked[key] ? '#7F77DD' : 'transparent', border: `1.5px solid ${checked[key] ? '#7F77DD' : t.textM}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                      {checked[key] && <i className="ti ti-check" style={{ fontSize: 11, color: 'white' }} aria-hidden="true"></i>}
                                    </div>
                                  )}
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: checked[key] ? t.textS : t.text, textDecoration: checked[key] ? 'line-through' : 'none' }}>{ex.name}</div>
                                    <div style={{ fontSize: 11, color: t.textM, marginTop: 1 }}>{ex.sets} sets · {ex.reps} reps · {ex.rest} rest</div>
                                  </div>
                                  {isToday && (
                                    <button onClick={(e) => { e.stopPropagation(); isActive ? stopTimer() : startTimer(key, restSecs) }}
                                      style={{ padding: '4px 9px', background: isActive ? '#e74c3c' : t.accentBg, color: isActive ? 'white' : t.accent, border: `0.5px solid ${isActive ? '#e74c3c' : t.accent}`, borderRadius: 6, fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>
                                      <i className={`ti ${isActive ? 'ti-player-stop' : 'ti-clock'}`} aria-hidden="true"></i> {isActive ? 'Stop' : 'Rest'}
                                    </button>
                                  )}
                                </div>
                                {/* Timer */}
                                {isActive && (
                                  <div style={{ background: t.accentBg, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ fontSize: 22, fontWeight: 700, color: activeTimer.seconds > 10 ? t.accent : '#e74c3c', minWidth: 44 }}>{activeTimer.seconds}s</div>
                                    <div style={{ flex: 1, height: 5, background: t.border, borderRadius: 3, overflow: 'hidden' }}>
                                      <div style={{ height: '100%', width: `${(activeTimer.seconds / restSecs) * 100}%`, background: activeTimer.seconds > 10 ? '#7F77DD' : '#e74c3c', borderRadius: 3, transition: 'width 1s linear' }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: t.textS }}>{activeTimer.running ? 'Resting...' : '✓ Done'}</div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                  {workoutPlan.tips?.length > 0 && (
                    <div style={{ background: darkMode ? '#1a1600' : '#FFFBEB', border: `0.5px solid ${darkMode ? '#3a3000' : '#FDE68A'}`, borderRadius: 12, padding: 14 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#F59E0B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Coach Tips</div>
                      {workoutPlan.tips.map((tip, i) => (
                        <div key={i} style={{ fontSize: 13, color: darkMode ? '#ccc' : '#555', marginBottom: 5, display: 'flex', gap: 8 }}>
                          <span style={{ color: '#F59E0B' }}>→</span><span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {screen === 'nutrition' && (
            <div>
              <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: mobile ? 22 : 26, fontWeight: 700, color: t.text }}>Nutrition</div>
                  <div style={{ fontSize: 13, color: t.textS }}>Your AI-generated meal plan</div>
                </div>
                <button onClick={generateNutrition} disabled={loadingAI} style={{ fontSize: 13, color: t.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  {loadingAI ? 'Generating...' : nutritionPlan ? '↻ Regenerate' : '✦ Generate'}
                </button>
              </div>
              {!nutritionPlan ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: t.bgS, borderRadius: 14, color: t.textS, fontSize: 14, border: `0.5px solid ${t.border}` }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🥗</div>
                  <div>Tap "Generate" to get your nutrition plan</div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
                    {[
                      { label: 'Calories', val: nutritionPlan.calories, unit: 'kcal', color: '#7F77DD' },
                      { label: 'Protein', val: nutritionPlan.protein, unit: 'g', color: '#378ADD' },
                      { label: 'Carbs', val: nutritionPlan.carbs, unit: 'g', color: '#EF9F27' },
                      { label: 'Fats', val: nutritionPlan.fats, unit: 'g', color: '#D85A30' },
                    ].map(m => (
                      <div key={m.label} style={{ background: t.bgS, borderRadius: 12, padding: 14, border: `0.5px solid ${t.border}` }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{m.val}<span style={{ fontSize: 11, color: t.textS, fontWeight: 400 }}>{m.unit}</span></div>
                        <div style={{ fontSize: 11, color: t.textS, marginTop: 2 }}>{m.label}</div>
                        <div style={{ height: 3, background: t.border, borderRadius: 2, marginTop: 8 }}>
                          <div style={{ height: '100%', width: '70%', background: m.color, borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.textM, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Meals</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {nutritionPlan.meals?.map((meal, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '13px 14px', background: t.bgS, borderRadius: 12, border: `0.5px solid ${t.border}` }}>
                        <div style={{ fontSize: 22 }}>{i === 0 ? '☕' : i === 1 ? '🍎' : i === 2 ? '🍽️' : '🌙'}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: t.text }}>{meal.name}</div>
                          <div style={{ fontSize: 12, color: t.textS, marginTop: 2 }}>{meal.foods}</div>
                          <div style={{ fontSize: 11, color: t.accent, marginTop: 3 }}>{meal.calories} kcal · {meal.protein}g protein</div>
                        </div>
                        <div style={{ fontSize: 11, color: t.textM }}>{meal.time}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {screen === 'progress' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: mobile ? 22 : 26, fontWeight: 700, color: t.text }}>Progress</div>
                <div style={{ fontSize: 13, color: t.textS }}>Track your fitness journey</div>
              </div>
              <div style={{ background: darkMode ? '#1E1B3A' : '#EEEDFE', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 52, fontWeight: 700, color: '#7F77DD', lineHeight: 1 }}>{streak}</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#7F77DD', fontSize: 16 }}>Day Streak 🔥</div>
                  <div style={{ fontSize: 13, color: darkMode ? '#AFA9EC' : '#534AB7', marginTop: 3 }}>Keep grinding — you're unstoppable!</div>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.textM, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>This Week</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 20 }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => {
                  const isToday = new Date().getDay() === i
                  return (
                    <div key={i} style={{ padding: '10px 0', borderRadius: 10, background: isToday ? (darkMode ? '#1E1B3A' : '#EEEDFE') : t.bgS, textAlign: 'center', border: isToday ? '1.5px solid #7F77DD' : `0.5px solid ${t.border}` }}>
                      <div style={{ fontSize: 10, color: isToday ? t.accent : t.textM, marginBottom: 4 }}>{d}</div>
                      <div style={{ fontSize: 14 }}>{isToday && todayDone ? '✓' : '–'}</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 24 }}>
                {[
                  { val: streak + ' 🔥', label: 'Streak' },
                  { val: workoutHistory.length, label: 'Total Workouts' },
                  { val: todayDone ? '✅' : '⏳', label: 'Today' },
                ].map(s => (
                  <div key={s.label} style={{ background: t.bgS, borderRadius: 12, padding: 16, textAlign: 'center', border: `0.5px solid ${t.border}` }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: t.textS, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.textM, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Workout History</div>
              {workoutHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', background: t.bgS, borderRadius: 14, color: t.textS, fontSize: 13, border: `0.5px solid ${t.border}` }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                  <div>No workouts yet — complete your first one!</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {workoutHistory.map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', background: t.bgS, borderRadius: 12, border: `0.5px solid ${t.border}` }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: t.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💪</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: t.text }}>
                          {new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div style={{ fontSize: 12, color: t.textS, marginTop: 2 }}>
                          {w.completed_exercises}/{w.total_exercises} exercises completed
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: w.completed_exercises === w.total_exercises ? '#7F77DD' : t.textS }}>
                        {w.completed_exercises === w.total_exercises ? '✓ Full' : `${Math.round((w.completed_exercises / w.total_exercises) * 100)}%`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {screen === 'profile' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: mobile ? 22 : 26, fontWeight: 700, color: t.text }}>Profile</div>
              </div>
              <div style={{ background: darkMode ? 'linear-gradient(135deg,#1E1B3A,#2D2458)' : '#7F77DD', borderRadius: 16, padding: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'white' }}>
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'white' }}>{profile.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{user.email}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Goal: {profile.goal?.replace('_', ' ')}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Age', val: profile.age + ' yrs', icon: 'ti-calendar' },
                  { label: 'Weight', val: profile.weight_kg + ' kg', icon: 'ti-scale' },
                  { label: 'Height', val: profile.height_cm + ' cm', icon: 'ti-ruler' },
                ].map(s => (
                  <div key={s.label} style={{ background: t.bgS, borderRadius: 12, padding: 14, textAlign: 'center', border: `0.5px solid ${t.border}` }}>
                    <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: t.accent, display: 'block', marginBottom: 6 }} aria-hidden="true"></i>
                    <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: t.textS, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: t.bgS, borderRadius: 14, overflow: 'hidden', border: `0.5px solid ${t.border}`, marginBottom: 16 }}>
                {[
                  { icon: 'ti-target', label: 'My Goal', val: profile.goal?.replace('_', ' ') },
                  { icon: 'ti-mail', label: 'Email', val: user.email },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i === 0 ? `0.5px solid ${t.border}` : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: t.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`ti ${item.icon}`} style={{ fontSize: 16, color: t.accent }} aria-hidden="true"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: t.textS }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginTop: 1 }}>{item.val}</div>
                    </div>
                    <i className="ti ti-chevron-right" style={{ fontSize: 16, color: t.textM }} aria-hidden="true"></i>
                  </div>
                ))}
              </div>
              <div style={{ background: t.bgS, borderRadius: 14, overflow: 'hidden', border: `0.5px solid ${t.border}`, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: t.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="ti ti-moon" style={{ fontSize: 16, color: t.accent }} aria-hidden="true"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Dark Mode</div>
                      <div style={{ fontSize: 11, color: t.textS }}>Switch appearance</div>
                    </div>
                  </div>
                  <button onClick={() => setDarkMode(!darkMode)} style={{ width: 44, height: 24, borderRadius: 12, background: darkMode ? '#7F77DD' : t.border, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: darkMode ? 23 : 3, transition: 'left 0.2s' }} />
                  </button>
                </div>
              </div>
              <button onClick={signOut} style={{ width: '100%', padding: 13, background: 'transparent', border: `0.5px solid #e74c3c`, borderRadius: 12, fontSize: 14, color: '#e74c3c', cursor: 'pointer', fontWeight: 500 }}>
                Sign out
              </button>
            </div>
          )}

        </div>
      </div>

      {mobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: t.bgS, borderTop: `0.5px solid ${t.border}`, zIndex: 100 }}>
          {navItems.map(tab => (
            <button key={tab.id} onClick={() => setScreen(tab.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
              <i className={`ti ${tab.icon}`} style={{ fontSize: 20, color: screen === tab.id ? '#7F77DD' : t.textM }} aria-hidden="true"></i>
              <span style={{ fontSize: 10, color: screen === tab.id ? '#7F77DD' : t.textM, fontWeight: screen === tab.id ? 600 : 400 }}>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

    </div>
  )
}