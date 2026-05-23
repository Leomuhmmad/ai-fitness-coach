import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const isMobile = () => window.innerWidth <= 768

export default function Dashboard({ user, profile }) {
  const [screen, setScreen] = useState('home')
  const [workoutPlan, setWorkoutPlan] = useState(null)
  const [nutritionPlan, setNutritionPlan] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [question, setQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [asking, setAsking] = useState(false)
  const [checked, setChecked] = useState({})
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    fetchPlans()
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPlans = async () => {
    const { data: wp } = await supabase
      .from('workout_plans').select('*')
      .eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
    const { data: np } = await supabase
      .from('nutrition_plans').select('*')
      .eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
    if (wp?.length) setWorkoutPlan(wp[0].plan)
    if (np?.length) setNutritionPlan(np[0].plan)
  }

  const callAI = async (prompt, systemMsg = '') => {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, system: systemMsg })
    })
    const data = await res.json()
    return data.text
  }

  const generatePlan = async () => {
    setLoadingAI(true)
    try {
      const prompt = `Create a detailed weekly home workout plan for someone with these details:
- Goal: ${profile.goal}
- Age: ${profile.age}
- Weight: ${profile.weight_kg}kg
- Height: ${profile.height_cm}cm
- Equipment: None (home workout only)

Respond ONLY with a JSON object in this exact format, no markdown:
{
  "days": [
    {
      "day": "Monday",
      "focus": "Upper Body",
      "exercises": [
        { "name": "Push-ups", "sets": 3, "reps": "15", "rest": "60s" }
      ]
    }
  ],
  "tips": ["tip1", "tip2"]
}`
      const text = await callAI(prompt)
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
- Goal: ${profile.goal}
- Weight: ${profile.weight_kg}kg
- Height: ${profile.height_cm}cm
- Age: ${profile.age}

Respond ONLY with a JSON object, no markdown:
{
  "calories": 2000,
  "protein": 150,
  "carbs": 200,
  "fats": 60,
  "meals": [
    { "time": "8:00 AM", "name": "Breakfast", "foods": "Eggs, toast, yogurt", "calories": 480, "protein": 32 }
  ]
}`
      const text = await callAI(prompt)
      const plan = JSON.parse(text.replace(/```json|```/g, '').trim())
      await supabase.from('nutrition_plans').insert({ user_id: user.id, plan })
      setNutritionPlan(plan)
    } catch (e) { alert('Error generating nutrition plan.') }
    setLoadingAI(false)
  }

  const askCoach = async () => {
    if (!question.trim()) return
    setAsking(true)
    setAiAnswer('')
    try {
      const answer = await callAI(
        question,
        `You are FitAI, an expert fitness and nutrition coach. The user's goal is ${profile.goal}. Give concise, actionable advice.`
      )
      setAiAnswer(answer)
    } catch (e) { setAiAnswer('Error connecting to AI.') }
    setAsking(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const toggleCheck = (key) => setChecked(p => ({ ...p, [key]: !p[key] }))
  const doneCount = Object.values(checked).filter(Boolean).length

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'nutrition', icon: '🥗', label: 'Nutrition' },
    { id: 'progress', icon: '📊', label: 'Progress' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#fff', minHeight: '100vh', display: 'flex' }}>

      {/* SIDEBAR — Desktop */}
      {!mobile && (
        <div style={{ width: 220, flexShrink: 0, position: 'fixed', left: 0, top: 0, bottom: 0, borderRight: '1px solid #f0f0f0', padding: '20px 12px', background: 'white', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', marginBottom: 32 }}>
            <div style={{ width: 28, height: 28, background: '#1D9E75', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14 }}>⚡</div>
            <span style={{ fontWeight: 600, fontSize: 16 }}>FitAI</span>
          </div>
          {navItems.map(tab => (
            <button key={tab.id} onClick={() => setScreen(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: screen === tab.id ? '#E1F5EE' : 'none', border: 'none', borderRadius: 10, cursor: 'pointer', width: '100%', marginBottom: 4, textAlign: 'left' }}>
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              <span style={{ fontSize: 14, color: screen === tab.id ? '#1D9E75' : '#555', fontWeight: screen === tab.id ? 600 : 400 }}>{tab.label}</span>
            </button>
          ))}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ padding: '0 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{profile.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{user.email}</div>
            </div>
            <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: 'none', border: 'none', borderRadius: 10, cursor: 'pointer', width: '100%', color: '#e74c3c', fontSize: 14 }}>
              🚪 <span>Sign out</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, marginLeft: mobile ? 0 : 220, paddingBottom: mobile ? 80 : 0 }}>

        {/* TOP BAR — Mobile only */}
        {mobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, background: '#1D9E75', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14 }}>⚡</div>
              <span style={{ fontWeight: 600, fontSize: 16 }}>FitAI</span>
            </div>
            <button onClick={signOut} style={{ fontSize: 13, color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}>Sign out</button>
          </div>
        )}

        <div style={{ maxWidth: 800, margin: '0 auto', padding: mobile ? '20px 16px' : '32px 40px' }}>

          {/* HOME */}
          {screen === 'home' && (
  <div>
    <div style={{ background: '#1D9E75', borderRadius: 16, padding: mobile ? 20 : 28, color: 'white', marginBottom: 24 }}>
      <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 600, marginBottom: 16 }}>
        Good {new Date().getHours() < 12 ? 'morning' : 'evening'}, {profile.name}! 👋
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        <div><div style={{ fontSize: 22, fontWeight: 600 }}>{doneCount}</div><div style={{ fontSize: 12, opacity: 0.8 }}>Done today</div></div>
        <div><div style={{ fontSize: 22, fontWeight: 600 }}>{profile.goal?.replace('_', ' ')}</div><div style={{ fontSize: 12, opacity: 0.8 }}>Your goal</div></div>
      </div>
    </div>

    {/* AI Coach */}
    <div style={{ background: '#f8f9fa', borderRadius: 14, padding: 16, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>AI Coach</div>
          <div style={{ fontSize: 12, color: '#888' }}>Ask anything about fitness</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: aiAnswer ? 12 : 0 }}>
        <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && askCoach()} placeholder="e.g. How do I lose belly fat fast?" style={{ flex: 1, padding: '10px 12px', fontSize: 13, border: '1px solid #e0e0e0', borderRadius: 10, outline: 'none' }} />
        <button onClick={askCoach} disabled={asking} style={{ padding: '10px 16px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>
          {asking ? '...' : '→'}
        </button>
      </div>
      {aiAnswer && (
        <div style={{ background: 'white', border: '1px solid #e8f5e9', borderRadius: 10, padding: 12, fontSize: 13, lineHeight: 1.6, color: '#333' }}>
          {aiAnswer}
        </div>
      )}
    </div>

    {/* Weekly Plan */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Weekly Plan</div>
      <button onClick={generatePlan} disabled={loadingAI} style={{ fontSize: 12, color: '#1D9E75', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
        {loadingAI ? 'Generating...' : workoutPlan ? '↻ Regenerate' : '✨ Generate with AI'}
      </button>
    </div>

    {!workoutPlan ? (
      <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8f9fa', borderRadius: 14, color: '#999', fontSize: 14 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>💪</div>
        <div>Tap "Generate with AI" to get your personalized weekly plan</div>
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {workoutPlan.days?.map((day, dayIndex) => {
          const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day.day
          return (
            <div key={dayIndex} style={{ background: isToday ? '#f0faf6' : '#f8f9fa', borderRadius: 14, border: isToday ? '1.5px solid #1D9E75' : '1px solid #f0f0f0', overflow: 'hidden' }}>
              {/* Day Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: isToday ? '#1D9E75' : 'transparent' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: isToday ? 'white' : '#111' }}>
                    {day.day} {isToday && '← Today'}
                  </div>
                  <div style={{ fontSize: 12, color: isToday ? 'rgba(255,255,255,0.8)' : '#888', marginTop: 2 }}>
                    {day.focus}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: isToday ? 'rgba(255,255,255,0.8)' : '#888' }}>
                  {day.exercises?.length} exercises
                </div>
              </div>

              {/* Exercises */}
              <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {day.exercises?.map((ex, i) => {
                  const key = `day-${dayIndex}-ex-${i}`
                  return (
                    <div key={i} onClick={() => isToday && toggleCheck(key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: checked[key] ? '#E1F5EE' : 'white', borderRadius: 10, cursor: isToday ? 'pointer' : 'default', border: `1px solid ${checked[key] ? '#9FE1CB' : '#f0f0f0'}` }}>
                      {isToday && (
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: checked[key] ? '#1D9E75' : 'white', border: `2px solid ${checked[key] ? '#1D9E75' : '#ddd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {checked[key] && <span style={{ color: 'white', fontSize: 11 }}>✓</span>}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 13, color: checked[key] ? '#888' : '#111', textDecoration: checked[key] ? 'line-through' : 'none' }}>{ex.name}</div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{ex.sets} sets · {ex.reps} reps · Rest {ex.rest}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Tips */}
        {workoutPlan.tips?.length > 0 && (
          <div style={{ background: '#FFF9E6', border: '1px solid #FFE082', borderRadius: 14, padding: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#F59E0B', marginBottom: 10 }}>💡 AI Tips</div>
            {workoutPlan.tips.map((tip, i) => (
              <div key={i} style={{ fontSize: 13, color: '#555', marginBottom: 6, display: 'flex', gap: 8 }}>
                <span>•</span><span>{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
)}

          {/* NUTRITION */}
          {screen === 'nutrition' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 600, marginBottom: 4 }}>Nutrition</div>
                <div style={{ fontSize: 13, color: '#888' }}>Your AI-generated meal plan</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button onClick={generateNutrition} disabled={loadingAI} style={{ fontSize: 13, color: '#1D9E75', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  {loadingAI ? 'Generating...' : nutritionPlan ? '↻ Regenerate' : '✨ Generate with AI'}
                </button>
              </div>
              {!nutritionPlan ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8f9fa', borderRadius: 14, color: '#999', fontSize: 14 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🥗</div>
                  <div>Tap "Generate with AI" to get your nutrition plan</div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
                    {[
                      { label: 'Calories', val: nutritionPlan.calories, color: '#1D9E75', unit: 'kcal' },
                      { label: 'Protein', val: nutritionPlan.protein, color: '#378ADD', unit: 'g' },
                      { label: 'Carbs', val: nutritionPlan.carbs, color: '#EF9F27', unit: 'g' },
                      { label: 'Fats', val: nutritionPlan.fats, color: '#D85A30', unit: 'g' },
                    ].map(m => (
                      <div key={m.label} style={{ background: '#f8f9fa', borderRadius: 12, padding: 14 }}>
                        <div style={{ fontSize: 20, fontWeight: 600 }}>{m.val}<span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>{m.unit}</span></div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{m.label}</div>
                        <div style={{ height: 4, background: '#e0e0e0', borderRadius: 2, marginTop: 8 }}>
                          <div style={{ height: '100%', width: '70%', background: m.color, borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Meals</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {nutritionPlan.meals?.map((meal, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 16px', background: '#f8f9fa', borderRadius: 12 }}>
                        <div style={{ fontSize: 24 }}>{i === 0 ? '☕' : i === 1 ? '🍎' : i === 2 ? '🍽️' : '🌙'}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{meal.name}</div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{meal.foods}</div>
                          <div style={{ fontSize: 12, color: '#1D9E75', marginTop: 3 }}>{meal.calories} kcal · {meal.protein}g protein</div>
                        </div>
                        <div style={{ fontSize: 11, color: '#bbb', alignSelf: 'flex-start' }}>{meal.time}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* PROGRESS */}
          {screen === 'progress' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 600, marginBottom: 4 }}>Progress</div>
                <div style={{ fontSize: 13, color: '#888' }}>Track your fitness journey</div>
              </div>
              <div style={{ background: '#E1F5EE', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#1D9E75', lineHeight: 1 }}>{doneCount}</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#0F6E56', fontSize: 16 }}>Exercises done today</div>
                  <div style={{ fontSize: 13, color: '#0F6E56', opacity: 0.8, marginTop: 3 }}>Keep pushing — you're doing great!</div>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>This week</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 24 }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => {
                  const isToday = new Date().getDay() === i
                  return (
                    <div key={i} style={{ padding: '12px 0', borderRadius: 10, background: isToday ? '#E1F5EE' : '#f8f9fa', textAlign: 'center', border: isToday ? '1.5px solid #1D9E75' : '1px solid transparent' }}>
                      <div style={{ fontSize: 11, color: isToday ? '#0F6E56' : '#999', marginBottom: 4 }}>{d}</div>
                      <div style={{ fontSize: 16 }}>{isToday ? '✓' : '–'}</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { val: doneCount, label: 'Done today' },
                  { val: profile.weight_kg + ' kg', label: 'Weight' },
                  { val: '🔥', label: 'Streak' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#f8f9fa', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 600 }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {screen === 'profile' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 600 }}>Profile</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: '#f8f9fa', borderRadius: 14, marginBottom: 20 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600, color: '#0F6E56' }}>
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 18 }}>{profile.name}</div>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Goal: {profile.goal?.replace('_', ' ')}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                {[
                  { label: 'Age', val: profile.age + ' yrs' },
                  { label: 'Weight', val: profile.weight_kg + ' kg' },
                  { label: 'Height', val: profile.height_cm + ' cm' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#f8f9fa', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#f8f9fa', borderRadius: 14, overflow: 'hidden' }}>
                {[
                  { icon: '🎯', label: 'My Goal', val: profile.goal?.replace('_', ' ') },
                  { icon: '📧', label: 'Email', val: user.email },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i === 0 ? '1px solid #eee' : 'none' }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#888' }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              {mobile && (
                <button onClick={signOut} style={{ width: '100%', marginTop: 16, padding: 13, background: '#fff', border: '1px solid #ddd', borderRadius: 12, fontSize: 14, color: '#e74c3c', cursor: 'pointer', fontWeight: 500 }}>
                  Sign out
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {/* BOTTOM NAV — Mobile */}
      {mobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'white', borderTop: '1px solid #f0f0f0', zIndex: 100 }}>
          {navItems.map(tab => (
            <button key={tab.id} onClick={() => setScreen(tab.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              <span style={{ fontSize: 10, color: screen === tab.id ? '#1D9E75' : '#999', fontWeight: screen === tab.id ? 600 : 400 }}>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

    </div>
  )
}