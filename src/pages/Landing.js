import { useState, useEffect } from 'react'

export default function Landing({ onGetStarted, darkMode }) {
  const [scrolled, setScrolled] = useState(false)
  const [dm, setDm] = useState(darkMode)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const t = dm ? {
    bg: '#0d0d10', bgS: '#131316', bgCard: '#1a1a20',
    text: '#fff', textS: '#888', textM: '#555', border: '#2a2a30',
    accent: '#7F77DD', accentBg: '#1E1B3A', accentText: '#AFA9EC',
    navBg: 'rgba(13,13,16,0.95)'
  } : {
    bg: '#fff', bgS: '#f8f8ff', bgCard: '#fff',
    text: '#111', textS: '#666', textM: '#bbb', border: '#f0f0f0',
    accent: '#7F77DD', accentBg: '#EEEDFE', accentText: '#534AB7',
    navBg: 'rgba(255,255,255,0.95)'
  }

  const features = [
    { icon: '🤖', title: 'AI Personal Coach', desc: 'Chat with Coach Alex — your AI trainer that knows your goals, tracks your progress, and pushes you harder.' },
    { icon: '💪', title: 'Weekly Workout Plans', desc: 'Personalized 7-day home workout plans. No gym, no equipment, just results.' },
    { icon: '🥗', title: 'Smart Nutrition', desc: 'Daily meal plans with exact calories, protein, carbs and fats calculated for your body.' },
    { icon: '🔥', title: 'Streak Tracking', desc: 'Build your streak, stay consistent, and watch yourself transform week by week.' },
  ]

  const testimonials = [
    { name: 'Ahmed K.', goal: 'Lost 10kg', text: 'REPS gave me a plan that actually fits my schedule. The AI coach is like having a personal trainer in my pocket.', avatar: 'A' },
    { name: 'Sarah M.', goal: 'Built muscle', text: 'I was skeptical but the weekly plans are genuinely impressive. My strength doubled in 2 months.', avatar: 'S' },
    { name: 'Omar T.', goal: 'Got fit', text: 'The nutrition plan alone changed everything. Finally know what to eat and when.', avatar: 'O' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: t.bg, color: t.text, minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? t.navBg : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? `0.5px solid ${t.border}` : 'none', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, background: '#7F77DD', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 15, fontWeight: 700, letterSpacing: -1 }}>R</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: 2, color: t.text }}>REPS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setDm(!dm)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
            {dm ? '☀️' : '🌙'}
          </button>
          <button onClick={onGetStarted} style={{ padding: '8px 16px', background: 'none', border: `0.5px solid ${t.border}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', color: t.textS }}>Sign in</button>
          <button onClick={onGetStarted} style={{ padding: '8px 18px', background: '#7F77DD', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', background: dm ? 'radial-gradient(ellipse at top, #1E1B3A 0%, #0d0d10 60%)' : 'radial-gradient(ellipse at top, #EEEDFE 0%, #ffffff 60%)' }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.accentBg, border: `0.5px solid ${dm ? '#3D3890' : '#C4C0F8'}`, borderRadius: 20, padding: '6px 14px', fontSize: 12, color: t.accent, marginBottom: 28, fontWeight: 600, letterSpacing: 0.5 }}>
            ✦ AI-Powered Fitness Coach
          </div>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 20, letterSpacing: '-0.03em', color: t.text }}>
            Train Smarter.<br />
            <span style={{ color: '#7F77DD' }}>Get Results.</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: t.textS, lineHeight: 1.7, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
            REPS gives you an AI coach, weekly workout plans, and nutrition tracking — all built for home workouts.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onGetStarted} style={{ padding: '14px 32px', background: '#7F77DD', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 24px rgba(127,119,221,0.4)' }}>
              Start for Free →
            </button>
            <button onClick={onGetStarted} style={{ padding: '14px 24px', background: t.bgCard, color: t.textS, border: `0.5px solid ${t.border}`, borderRadius: 12, fontSize: 15, cursor: 'pointer' }}>
              See how it works
            </button>
          </div>
          <p style={{ fontSize: 12, color: t.textM, marginTop: 16 }}>No credit card · Free forever plan</p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '20px 24px', background: t.bgS, borderTop: `0.5px solid ${t.border}`, borderBottom: `0.5px solid ${t.border}` }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[['10K+', 'Active Users'], ['500K+', 'Workouts Done'], ['4.9★', 'Rating']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#7F77DD' }}>{val}</div>
              <div style={{ fontSize: 12, color: t.textS, marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, marginBottom: 10, color: t.text }}>Everything you need to transform</h2>
          <p style={{ fontSize: 15, color: t.textS }}>One app. AI-powered. Built for real results at home.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{ padding: 24, background: t.bgS, borderRadius: 16, border: `0.5px solid ${t.border}` }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: t.text }}>{f.title}</div>
              <div style={{ fontSize: 13, color: t.textS, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: t.bgS, borderTop: `0.5px solid ${t.border}`, borderBottom: `0.5px solid ${t.border}` }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, marginBottom: 10, color: t.text }}>Ready in 3 steps</h2>
          <p style={{ fontSize: 15, color: t.textS, marginBottom: 48 }}>From zero to your first workout in under 2 minutes</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Set your goal', desc: 'Lose weight, build muscle, or stay healthy.' },
              { step: '02', title: 'AI builds your plan', desc: 'Coach Alex creates a personalized plan for your body.' },
              { step: '03', title: 'Start training', desc: 'Follow your plan, track progress, see results.' },
            ].map((s, i) => (
              <div key={i} style={{ padding: 24 }}>
                <div style={{ width: 44, height: 44, background: '#7F77DD', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, margin: '0 auto 16px', letterSpacing: 1 }}>{s.step}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: t.text }}>{s.title}</div>
                <div style={{ fontSize: 13, color: t.textS, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: t.text }}>Real people, real results</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 16 }}>
          {testimonials.map((t2, i) => (
            <div key={i} style={{ padding: 24, background: t.bgS, borderRadius: 16, border: `0.5px solid ${t.border}` }}>
              <div style={{ fontSize: 13, color: t.textS, lineHeight: 1.7, marginBottom: 20 }}>"{t2.text}"</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#7F77DD', fontSize: 14 }}>{t2.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>{t2.name}</div>
                  <div style={{ fontSize: 11, color: '#7F77DD', marginTop: 1 }}>{t2.goal}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '80px 24px', background: t.bgS, borderTop: `0.5px solid ${t.border}` }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, marginBottom: 10, color: t.text }}>Simple pricing</h2>
          <p style={{ fontSize: 15, color: t.textS, marginBottom: 48 }}>Start free. Upgrade when you're ready.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 16, maxWidth: 580, margin: '0 auto' }}>
            {[
              { name: 'Free', price: '$0', period: 'forever', features: ['3 AI workout plans/month', 'Basic nutrition tips', 'Progress tracking'], primary: false },
              { name: 'Pro', price: '$9.99', period: '/month', features: ['Unlimited AI plans', 'Daily nutrition plans', 'Streak tracking', 'Coach Alex chat', 'Cancel anytime'], primary: true },
            ].map((p, i) => (
              <div key={i} style={{ padding: 28, background: p.primary ? '#7F77DD' : t.bgCard, borderRadius: 18, border: `1.5px solid ${p.primary ? '#7F77DD' : t.border}`, textAlign: 'left', position: 'relative' }}>
                {p.primary && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#534AB7', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 0.5 }}>MOST POPULAR</div>}
                <div style={{ fontSize: 16, fontWeight: 700, color: p.primary ? 'white' : t.text, marginBottom: 4 }}>{p.name}</div>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 34, fontWeight: 800, color: p.primary ? 'white' : t.text }}>{p.price}</span>
                  <span style={{ fontSize: 13, color: p.primary ? 'rgba(255,255,255,0.7)' : t.textS }}>{p.period}</span>
                </div>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 13, color: p.primary ? 'rgba(255,255,255,0.9)' : t.textS }}>
                    <span style={{ color: p.primary ? 'white' : '#7F77DD', fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
                <button onClick={onGetStarted} style={{ width: '100%', marginTop: 20, padding: '12px', background: p.primary ? 'white' : '#7F77DD', color: p.primary ? '#7F77DD' : 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  {p.primary ? 'Start Pro' : 'Start Free'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #7F77DD, #534AB7)' }}>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: 'white', marginBottom: 14 }}>Start your transformation today</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>Join thousands already crushing their fitness goals with REPS</p>
        <button onClick={onGetStarted} style={{ padding: '15px 36px', background: 'white', color: '#7F77DD', border: 'none', borderRadius: 12, fontSize: 17, cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          Get Started — It's Free →
        </button>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 14 }}>No credit card required</p>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '28px 24px', textAlign: 'center', borderTop: `0.5px solid ${t.border}`, background: t.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 24, height: 24, background: '#7F77DD', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: -1 }}>R</div>
          <span style={{ fontWeight: 700, letterSpacing: 2, color: t.text }}>REPS</span>
        </div>
        <p style={{ fontSize: 12, color: t.textM }}>© 2025 REPS. Built for people who want to get fit at home.</p>
      </footer>
    </div>
  )
}