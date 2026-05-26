const exerciseGifs = {
  'push-ups': 'https://gymvisual.com/img/p/1/5/2/7/1527.gif',
  'pushups': 'https://gymvisual.com/img/p/1/5/2/7/1527.gif',
  'push ups': 'https://gymvisual.com/img/p/1/5/2/7/1527.gif',
  'tricep dips': 'https://gymvisual.com/img/p/1/2/0/4/1204.gif',
  'tricep dips (using a chair)': 'https://gymvisual.com/img/p/1/2/0/4/1204.gif',
  'arm circles': 'https://gymvisual.com/img/p/2/4/0/6/2406.gif',
  'shoulder taps': 'https://gymvisual.com/img/p/2/3/6/5/2365.gif',
  'incline push-ups': 'https://gymvisual.com/img/p/1/5/3/1/1531.gif',
  'wide push-ups': 'https://gymvisual.com/img/p/1/5/2/8/1528.gif',
  'squats': 'https://gymvisual.com/img/p/1/6/0/3/1603.gif',
  'squat': 'https://gymvisual.com/img/p/1/6/0/3/1603.gif',
  'lunges': 'https://gymvisual.com/img/p/1/1/8/8/1188.gif',
  'lunge': 'https://gymvisual.com/img/p/1/1/8/8/1188.gif',
  'calf raises': 'https://gymvisual.com/img/p/1/1/6/4/1164.gif',
  'glute bridges': 'https://gymvisual.com/img/p/2/2/0/7/2207.gif',
  'glute bridge': 'https://gymvisual.com/img/p/2/2/0/7/2207.gif',
  'wall sit': 'https://gymvisual.com/img/p/2/4/3/0/2430.gif',
  'sumo squats': 'https://gymvisual.com/img/p/1/6/0/5/1605.gif',
  'jump squats': 'https://gymvisual.com/img/p/1/6/0/8/1608.gif',
  'plank': 'https://gymvisual.com/img/p/2/3/6/3/2363.gif',
  'crunches': 'https://gymvisual.com/img/p/6/3/63.gif',
  'crunch': 'https://gymvisual.com/img/p/6/3/63.gif',
  'russian twists': 'https://gymvisual.com/img/p/2/3/5/8/2358.gif',
  'russian twist': 'https://gymvisual.com/img/p/2/3/5/8/2358.gif',
  'leg raises': 'https://gymvisual.com/img/p/2/3/5/5/2355.gif',
  'leg raise': 'https://gymvisual.com/img/p/2/3/5/5/2355.gif',
  'mountain climbers': 'https://gymvisual.com/img/p/2/3/6/2/2362.gif',
  'mountain climber': 'https://gymvisual.com/img/p/2/3/6/2/2362.gif',
  'bicycle crunches': 'https://gymvisual.com/img/p/6/6/66.gif',
  'bicycle crunch': 'https://gymvisual.com/img/p/6/6/66.gif',
  'sit-ups': 'https://gymvisual.com/img/p/6/4/64.gif',
  'sit ups': 'https://gymvisual.com/img/p/6/4/64.gif',
  'burpees': 'https://gymvisual.com/img/p/2/3/6/4/2364.gif',
  'burpee': 'https://gymvisual.com/img/p/2/3/6/4/2364.gif',
  'jumping jacks': 'https://gymvisual.com/img/p/2/4/0/5/2405.gif',
  'jumping jack': 'https://gymvisual.com/img/p/2/4/0/5/2405.gif',
  'high knees': 'https://gymvisual.com/img/p/2/4/0/4/2404.gif',
  'high knee': 'https://gymvisual.com/img/p/2/4/0/4/2404.gif',
  'bear crawls': 'https://gymvisual.com/img/p/2/3/6/6/2366.gif',
  'bear crawl': 'https://gymvisual.com/img/p/2/3/6/6/2366.gif',
  'box jumps': 'https://gymvisual.com/img/p/2/4/0/3/2403.gif',
  'box jump': 'https://gymvisual.com/img/p/2/4/0/3/2403.gif',
}

export default function ExerciseGif({ exerciseName, darkMode }) {
  const key = exerciseName?.toLowerCase().trim()
  const gifUrl = exerciseGifs[key]

  const fallbackEmoji = () => {
    if (key?.includes('push')) return '💪'
    if (key?.includes('squat') || key?.includes('lunge')) return '🦵'
    if (key?.includes('plank') || key?.includes('crunch') || key?.includes('sit')) return '🏋️'
    if (key?.includes('jump') || key?.includes('burpee') || key?.includes('high')) return '⚡'
    if (key?.includes('mountain') || key?.includes('bear')) return '🔥'
    return '💪'
  }

  if (!gifUrl) return (
    <div style={{
      width: '100%', height: 140,
      background: darkMode ? '#1E1B3A' : '#EEEDFE',
      borderRadius: '12px 12px 0 0',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 6
    }}>
      <div style={{ fontSize: 40 }}>{fallbackEmoji()}</div>
      <div style={{ fontSize: 11, color: darkMode ? '#AFA9EC' : '#7F77DD', fontWeight: 500 }}>{exerciseName}</div>
    </div>
  )

  return (
    <div style={{ width: '100%', borderRadius: '12px 12px 0 0', overflow: 'hidden', height: 140 }}>
      <img
        src={gifUrl}
        alt={exerciseName}
        style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
        onError={(e) => {
          e.target.parentNode.innerHTML = `<div style="width:100%;height:140px;background:${darkMode ? '#1E1B3A' : '#EEEDFE'};display:flex;align-items:center;justify-content:center;font-size:40px;border-radius:12px 12px 0 0">${fallbackEmoji()}</div>`
        }}
      />
    </div>
  )
}