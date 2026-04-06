// 星座カード — 太陽軌道リング + 今日のバイオリズム波形
const ELEMENT_COLORS = {
  '火': '#ff6b35', '土': '#ffd700', '風': '#00f5ff', '水': '#7b8fff',
}

const ZODIAC_ORDER = ['牡羊座','牡牛座','双子座','蟹座','獅子座','乙女座','天秤座','蠍座','射手座','山羊座','水瓶座','魚座']
const ZODIAC_SHORT = { '牡羊座':'♈','牡牛座':'♉','双子座':'♊','蟹座':'♋','獅子座':'♌','乙女座':'♍','天秤座':'♎','蠍座':'♏','射手座':'♐','山羊座':'♑','水瓶座':'♒','魚座':'♓' }

function ZodiacWheel({ name }) {
  const idx = ZODIAC_ORDER.indexOf(name)
  const cx = 72, cy = 72, r = 54
  const signs = ZODIAC_ORDER.map((s, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    const active = i === idx
    return { s, x, y, angle, active, i }
  })
  const activeAngle = (idx / 12) * 360 - 90
  const markerR = 56
  const mx = cx + markerR * Math.cos((activeAngle * Math.PI) / 180)
  const my = cy + markerR * Math.sin((activeAngle * Math.PI) / 180)

  return (
    <svg width={144} height={144} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="zodiac-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,245,255,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={62} fill="url(#zodiac-glow)" />
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={62} fill="none" stroke="rgba(0,245,255,0.08)" strokeWidth={1} />
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={46} fill="none" stroke="rgba(0,245,255,0.06)" strokeWidth={1} />
      {/* Tick marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2
        const x1 = cx + 55 * Math.cos(a), y1 = cy + 55 * Math.sin(a)
        const x2 = cx + 62 * Math.cos(a), y2 = cy + 62 * Math.sin(a)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,245,255,0.2)" strokeWidth={1} />
      })}
      {/* Sign symbols */}
      {signs.map(({ s, x, y, active }) => (
        <text key={s} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          fontSize={active ? 13 : 9}
          fill={active ? '#00f5ff' : 'rgba(200,216,232,0.25)'}
          style={{ filter: active ? 'drop-shadow(0 0 6px #00f5ff)' : 'none' }}
        >
          {ZODIAC_SHORT[s]}
        </text>
      ))}
      {/* Center */}
      <circle cx={cx} cy={cy} r={24} fill="rgba(0,0,0,0.6)" stroke="rgba(0,245,255,0.12)" strokeWidth={1} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={18} fill="#fff"
        style={{ filter: 'drop-shadow(0 0 8px #00f5ff)' }}>
        {ZODIAC_SHORT[name]}
      </text>
      {/* Active glow dot */}
      <circle cx={mx} cy={my} r={4} fill="#00f5ff" style={{ filter: 'drop-shadow(0 0 6px #00f5ff)' }} />
    </svg>
  )
}

// 今日の星座バイオリズム波 (emotional/intellectual/physical)
function BioWave({ birthDate }) {
  const today = new Date()
  const birth = new Date(birthDate.year, birthDate.month - 1, birthDate.day)
  const daysSince = Math.floor((today - birth) / 86400000)
  const W = 200, H = 56
  const points = (period, offset = 0) => {
    const pts = []
    for (let x = 0; x <= W; x += 2) {
      const t = (daysSince + x / W * 30 - 15) // show ±15 days around today
      const y = H / 2 - (H / 2 - 6) * Math.sin((2 * Math.PI * t) / period + offset)
      pts.push(`${x},${y}`)
    }
    return pts.join(' ')
  }
  const pPhysical = 23, pEmotional = 28, pIntellect = 33
  const todayX = W / 2
  const yP = H / 2 - (H / 2 - 6) * Math.sin((2 * Math.PI * daysSince) / pPhysical)
  const yE = H / 2 - (H / 2 - 6) * Math.sin((2 * Math.PI * daysSince) / pEmotional)
  const yI = H / 2 - (H / 2 - 6) * Math.sin((2 * Math.PI * daysSince) / pIntellect)
  const pctP = Math.round((-(Math.sin((2 * Math.PI * daysSince) / pPhysical)) + 1) * 50)
  const pctE = Math.round((-(Math.sin((2 * Math.PI * daysSince) / pEmotional)) + 1) * 50)
  const pctI = Math.round((-(Math.sin((2 * Math.PI * daysSince) / pIntellect)) + 1) * 50)

  return (
    <div>
      <div style={{ fontSize: 9, color: 'rgba(0,245,255,0.5)', letterSpacing: '0.2em', marginBottom: 8, textTransform: 'uppercase' }}>
        Today's Biorhythm
      </div>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        <line x1={todayX} y1={0} x2={todayX} y2={H} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="3,3" />
        <line x1={0} y1={H/2} x2={W} y2={H/2} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        <polyline points={points(pPhysical)} fill="none" stroke="#ff6b35" strokeWidth={1.5} opacity={0.8} />
        <polyline points={points(pEmotional)} fill="none" stroke="#00f5ff" strokeWidth={1.5} opacity={0.8} />
        <polyline points={points(pIntellect)} fill="none" stroke="#bf00ff" strokeWidth={1.5} opacity={0.8} />
        <circle cx={todayX} cy={yP} r={3} fill="#ff6b35" style={{ filter: 'drop-shadow(0 0 4px #ff6b35)' }} />
        <circle cx={todayX} cy={yE} r={3} fill="#00f5ff" style={{ filter: 'drop-shadow(0 0 4px #00f5ff)' }} />
        <circle cx={todayX} cy={yI} r={3} fill="#bf00ff" style={{ filter: 'drop-shadow(0 0 4px #bf00ff)' }} />
      </svg>
      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        {[['肉体', pctP, '#ff6b35'], ['感情', pctE, '#00f5ff'], ['知性', pctI, '#bf00ff']].map(([label, pct, color]) => (
          <div key={label} style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(200,216,232,0.5)', marginBottom: 3 }}>
              <span>{label}</span><span style={{ color }}>{pct}%</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 0 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ZodiacCard({ data, birthDate }) {
  const color = ELEMENT_COLORS[data.element] || '#00f5ff'
  return (
    <div className="card" style={{ '--accent': color }}>
      <div className="card-top-line" style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
      <div className="card-header">
        <ZodiacWheel name={data.name} />
        <div className="card-meta">
          <div className="card-category">Western Astrology · 星座</div>
          <div className="card-name" style={{ color, textShadow: `0 0 15px ${color}` }}>{data.name}</div>
          <div className="card-sub">{data.english}</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <span className="tag" style={{ color, borderColor: `${color}44`, background: `${color}12` }}>{data.element}属性</span>
            <span className="tag" style={{ color: 'rgba(200,216,232,0.5)', borderColor: 'rgba(200,216,232,0.12)' }}>☿ {data.ruling}</span>
          </div>
          <p className="card-trait" style={{ marginTop: 8 }}>{data.trait}</p>
        </div>
      </div>
      <div className="card-divider" />
      <BioWave birthDate={birthDate} />
    </div>
  )
}
