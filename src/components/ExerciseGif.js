function getExerciseStyle(name) {
  const k = name?.toLowerCase() || ''
  if (k.includes('push')) return { bg: '#EEF2FF', color: '#7F77DD', emoji: '💪', muscle: 'Chest & Triceps' }
  if (k.includes('squat')) return { bg: '#FEF3C7', color: '#D97706', emoji: '🦵', muscle: 'Quads & Glutes' }
  if (k.includes('lunge')) return { bg: '#FEF3C7', color: '#D97706', emoji: '🦵', muscle: 'Quads & Glutes' }
  if (k.includes('plank')) return { bg: '#ECFDF5', color: '#059669', emoji: '🏋️', muscle: 'Core' }
  if (k.includes('crunch') || k.includes('sit')) return { bg: '#ECFDF5', color: '#059669', emoji: '🏋️', muscle: 'Abs' }
  if (k.includes('burpee')) return { bg: '#FEE2E2', color: '#DC2626', emoji: '⚡', muscle: 'Full Body' }
  if (k.includes('jump') || k.includes('jack')) return { bg: '#FEE2E2', color: '#DC2626', emoji: '⚡', muscle: 'Cardio' }
  if (k.includes('mountain') || k.includes('climber')) return { bg: '#FEE2E2', color: '#DC2626', emoji: '🔥', muscle: 'Core & Cardio' }
  if (k.includes('high') && k.includes('knee')) return { bg: '#FEE2E2', color: '#DC2626', emoji: '⚡', muscle: 'Cardio' }
  if (k.includes('tricep') || k.includes('dip')) return { bg: '#EEF2FF', color: '#7F77DD', emoji: '💪', muscle: 'Triceps' }
  if (k.includes('shoulder') || k.includes('arm') || k.includes('circle')) return { bg: '#EEF2FF', color: '#7F77DD', emoji: '🔄', muscle: 'Shoulders' }
  if (k.includes('glute') || k.includes('bridge')) return { bg: '#FEF3C7', color: '#D97706', emoji: '🍑', muscle: 'Glutes' }
  if (k.includes('calf') || k.includes('raise')) return { bg: '#FEF3C7', color: '#D97706', emoji: '🦵', muscle: 'Calves' }
  if (k.includes('wall') && k.includes('sit')) return { bg: '#FEF3C7', color: '#D97706', emoji: '🧱', muscle: 'Quads' }
  if (k.includes('russian') || k.includes('twist')) return { bg: '#ECFDF5', color: '#059669', emoji: '🌀', muscle: 'Obliques' }
  if (k.includes('leg') && k.includes('raise')) return { bg: '#ECFDF5', color: '#059669', emoji: '🦵', muscle: 'Lower Abs' }
  if (k.includes('bicycle')) return { bg: '#ECFDF5', color: '#059669', emoji: '🚴', muscle: 'Abs' }
  if (k.includes('bear') || k.includes('crawl')) return { bg: '#FEE2E2', color: '#DC2626', emoji: '🐻', muscle: 'Full Body' }
  if (k.includes('box') || k.includes('jump')) return { bg: '#FEE2E2', color: '#DC2626', emoji: '📦', muscle: 'Power' }
  return { bg: '#EEF2FF', color: '#7F77DD', emoji: '💪', muscle: 'Full Body' }
}

export default function ExerciseGif({ exerciseName, darkMode, isChecked }) {
  const s = getExerciseStyle(exerciseName)
  const bg = darkMode ? '#1a1a2e' : s.bg

  return (
    <div style={{
      width: '100%', height: 110,
      borderRadius: '12px 12px 0 0',
      background: bg,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative circle */}
      <div style={{
        position: 'absolute', right: -20, top: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: darkMode ? 'rgba(255,255,255,0.03)' : `${s.color}15`,
      }} />

      {/* Left content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: darkMode ? 'rgba(255,255,255,0.1)' : `${s.color}20`,
          padding: '3px 9px', borderRadius: 20,
          fontSize: 10, fontWeight: 700,
          color: darkMode ? '#fff' : s.color,
          letterSpacing: 0.3,
        }}>
          🎯 {s.muscle.toUpperCase()}
        </div>
        <div style={{
          fontSize: 13, fontWeight: 700,
          color: darkMode ? '#fff' : '#111',
          maxWidth: 170, lineHeight: 1.3,
        }}>
          {exerciseName}
        </div>
        {isChecked && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: '#7F77DD', color: 'white',
            padding: '3px 9px', borderRadius: 20,
            fontSize: 10, fontWeight: 700,
          }}>
            ✓ COMPLETED
          </div>
        )}
      </div>

      {/* Right emoji */}
      <div style={{
        fontSize: 52,
        opacity: isChecked ? 0.3 : 1,
        filter: isChecked ? 'grayscale(1)' : 'none',
        transition: 'all 0.3s',
        zIndex: 1,
      }}>
        {s.emoji}
      </div>
    </div>
  )
}