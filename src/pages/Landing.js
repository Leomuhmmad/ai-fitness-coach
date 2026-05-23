import { useState, useEffect } from 'react'

export default function Landing({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { icon: '🤖', title: 'AI Personal Coach', desc: 'Get a workout plan tailored exactly to your body, goal, and fitness level — generated in seconds.' },
    { icon: '🥗', title: 'Smart Nutrition Plans', desc: 'Daily meal plans calculated for your calories, protein, and macros. No guessing, just results.' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Track every workout, streak, and milestone. Watch yourself transform week by week.' },
    { icon: '🏠', title: 'Home Workouts Only', desc: 'No gym needed. Every plan is designed for home — zero equipment required.' },
  ]

  const testimonials = [
    { name: 'Sarah M.', goal: 'Lost 8kg', text: 'FitAI gave me a plan that actually fits my life. I lost 8kg in 3 months without stepping in a gym.', avatar: 'S' },
    { name: 'Ahmed K.', goal: 'Built muscle', text: 'I was skeptical about AI coaching but the workout plans are genuinely impressive. My strength doubled.', avatar: 'A' },
    { name: 'Maria L.', goal: 'Got fit', text: 'The nutrition plan alone was worth it. Finally understand what to eat and when.', avatar: 'M' },
  ]

  const plans = [
    { name: 'Free', price: '$0', period: 'forever', color: '#f8f9fa', border: '#e0e0e0', features: ['3 AI workout plans/month', 'Basic nutrition tips', 'Progress tracking'], cta: 'Start Free', primary: false },
    { name: 'Pro', price: '$9.99', period: '/month', color: '#1D9E75', border: '#1D9E75', features: ['Unlimited AI workout plans', 'Daily nutrition plans', 'Streak tracking', 'Priority AI responses', 'Cancel anytime'], cta: 'Start Pro', primary: true },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#111', background: '#fff' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none', borderBottom: scrolled ? '1px solid #f0f0f0' : 'none', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, background: '#1D9E75', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>FitAI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onGetStarted} style={{ padding: '8px 16px', background: 'none', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, cursor: 'pointer', color: '#555' }}>Sign in</button>
          <button onClick={onGetStarted} style={{ padding: '8px 18px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', background: 'linear-gradient(180deg, #f0faf6 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#E1F5EE', border: '1px solid #9FE1CB', borderRadius: 20, padding: '6px 14px', fontSize: 13, color: '#0F6E56', marginBottom: 24, fontWeight: 500 }}>
            ✨ AI-Powered Fitness Coach
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
            Your Personal AI<br />
            <span style={{ color: '#1D9E75' }}>Fitness Coach</span><br />
            At Home
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#555', lineHeight: 1.6, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
            Get a personalized workout and nutrition plan in seconds. No gym, no trainer, no guesswork — just results.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onGetStarted} style={{ padding: '14px 32px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 20px rgba(29,158,117,0.3)' }}>
              Start for Free →
            </button>
            <button onClick={onGetStarted} style={{ padding: '14px 28px', background: 'white', color: '#333', border: '1px solid #ddd', borderRadius: 12, fontSize: 16, cursor: 'pointer' }}>
              See how it works
            </button>
          </div>
          <p style={{ fontSize: 13, color: '#999', marginTop: 16 }}>No credit card required · Free forever plan</p>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: '20px 24px', background: '#f8f9fa', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>Trusted by fitness enthusiasts worldwide</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[['10K+', 'Active Users'], ['500K+', 'Workouts Done'], ['4.9★', 'Average Rating']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1D9E75' }}>{val}</div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>Everything you need to transform</h2>
          <p style={{ fontSize: 16, color: '#666', maxWidth: 500, margin: '0 auto' }}>One app. AI-powered. Built for real results at home.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ padding: 24, background: '#f8f9fa', borderRadius: 16, border: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: '#f0faf6' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>Ready in 3 steps</h2>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 48 }}>From zero to your first workout in under 2 minutes</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Tell us your goal', desc: 'Lose weight, build muscle, or stay healthy — you choose.' },
              { step: '02', title: 'AI builds your plan', desc: 'Our AI creates a personalized workout & nutrition plan for you.' },
              { step: '03', title: 'Start training', desc: 'Follow your daily plan, track progress, and see results.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ width: 48, height: 48, background: '#1D9E75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, margin: '0 auto 16px' }}>{s.step}</div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>Real people, real results</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ padding: 24, background: '#f8f9fa', borderRadius: 16, border: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#0F6E56' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#1D9E75', marginTop: 2 }}>{t.goal}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '80px 24px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>Simple pricing</h2>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 48 }}>Start free. Upgrade when you're ready.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 600, margin: '0 auto' }}>
            {plans.map((p, i) => (
              <div key={i} style={{ padding: 28, background: p.primary ? '#1D9E75' : 'white', borderRadius: 20, border: `2px solid ${p.border}`, textAlign: 'left', position: 'relative' }}>
                {p.primary && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#0F6E56', color: 'white', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>Most Popular</div>}
                <div style={{ fontSize: 18, fontWeight: 700, color: p.primary ? 'white' : '#111', marginBottom: 4 }}>{p.name}</div>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: p.primary ? 'white' : '#111' }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: p.primary ? 'rgba(255,255,255,0.8)' : '#888' }}>{p.period}</span>
                </div>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 14, color: p.primary ? 'rgba(255,255,255,0.9)' : '#444' }}>
                    <span style={{ color: p.primary ? 'white' : '#1D9E75', fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
                <button onClick={onGetStarted} style={{ width: '100%', marginTop: 20, padding: '12px', background: p.primary ? 'white' : '#1D9E75', color: p.primary ? '#1D9E75' : 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #1D9E75, #0F6E56)' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: 'white', marginBottom: 16 }}>Start your transformation today</h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 36 }}>Join thousands already reaching their fitness goals with FitAI</p>
        <button onClick={onGetStarted} style={{ padding: '16px 40px', background: 'white', color: '#1D9E75', border: 'none', borderRadius: 12, fontSize: 18, cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          Get Started — It's Free →
        </button>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 14 }}>No credit card required</p>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, background: '#1D9E75', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>⚡</div>
          <span style={{ fontWeight: 600 }}>FitAI</span>
        </div>
        <p style={{ fontSize: 13, color: '#999' }}>© 2025 FitAI. Built with ❤️ for people who want to get fit at home.</p>
      </footer>

    </div>
  )
}