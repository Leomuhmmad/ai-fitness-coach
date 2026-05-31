export default function ProModal({ onClose, darkMode }) {
  const t = darkMode ? {
    bg: '#131316', border: '#2a2a30', text: '#fff', textS: '#888'
  } : {
    bg: '#fff', border: '#f0f0f0', text: '#111', textS: '#666'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{ background: t.bg, borderRadius: 20, padding: 28, maxWidth: 380, width: '100%', border: `0.5px solid ${t.border}` }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👑</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 6 }}>Upgrade to REPS Pro</div>
          <div style={{ fontSize: 13, color: t.textS, lineHeight: 1.6 }}>
            You've used your 3 free workout plans this month. Upgrade to get unlimited access.
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          {[
            { icon: '✦', text: 'Unlimited AI workout plans' },
            { icon: '🥗', text: 'Daily nutrition plans' },
            { icon: '🏋️', text: 'Coach Alex — AI chat coach' },
            { icon: '📊', text: 'Advanced progress tracking' },
            { icon: '🔥', text: 'Streak & history analytics' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{f.icon}</div>
              <div style={{ fontSize: 14, color: t.text }}>{f.text}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'linear-gradient(135deg, #7F77DD, #534AB7)', borderRadius: 14, padding: 16, textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>$9.99<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.8 }}>/month</span></div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>Cancel anytime</div>
        </div>
        <button style={{ width: '100%', padding: '13px', background: '#7F77DD', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
          Upgrade to Pro →
        </button>
        <button onClick={onClose} style={{ width: '100%', padding: '11px', background: 'none', color: t.textS, border: `0.5px solid ${t.border}`, borderRadius: 12, fontSize: 14, cursor: 'pointer' }}>
          Maybe later
        </button>
      </div>
    </div>
  )
}