// 六星占術カード — 12年サイクルホイール + 今年のフォーチュン
const CAUTION_PHASES = ['乱気', '停止', '陰影', '大殺界']
const FORTUNE_PHASES = ['種', '芽吹き', '成長', '開花', '実り', '乱気', '停止', '減退', '整理', '陰影', '停止', '大殺界']

const PHASE_COLORS = {
  '種': '#00f5ff', '芽吹き': '#00ff88', '成長': '#00ff88', '開花': '#ffd700',
  '実り': '#ffd700', '乱気': '#ff6b35', '停止': '#bf00ff', '減退': '#bf00ff',
  '整理': '#ff6b35', '陰影': '#ff6b35', '大殺界': '#ff4444',
}

function CycleWheel({ cyclePos, color }) {
  const cx = 72, cy = 72, r = 52
  const phases = FORTUNE_PHASES

  return (
    <svg width={144} height={144} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="six-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`${color}18`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={62} fill="url(#six-glow)" />
      {/* Outer arc segments */}
      {phases.map((phase, i) => {
        const startAngle = (i / 12) * Math.PI * 2 - Math.PI / 2
        const endAngle = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2
        const r1 = 44, r2 = 60
        const x1 = cx + r1 * Math.cos(startAngle), y1 = cy + r1 * Math.sin(startAngle)
        const x2 = cx + r2 * Math.cos(startAngle), y2 = cy + r2 * Math.sin(startAngle)
        const x3 = cx + r2 * Math.cos(endAngle), y3 = cy + r2 * Math.sin(endAngle)
        const x4 = cx + r1 * Math.cos(endAngle), y4 = cy + r1 * Math.sin(endAngle)
        const isActive = i === cyclePos
        const phaseColor = PHASE_COLORS[phase] || '#fff'
        return (
          <path key={i}
            d={`M${x1},${y1} L${x2},${y2} A${r2},${r2} 0 0,1 ${x3},${y3} L${x4},${y4} A${r1},${r1} 0 0,0 ${x1},${y1} Z`}
            fill={isActive ? phaseColor : 'rgba(255,255,255,0.03)'}
            stroke={isActive ? phaseColor : 'rgba(255,255,255,0.06)'}
            strokeWidth={0.5}
            style={{ filter: isActive ? `drop-shadow(0 0 6px ${phaseColor})` : 'none' }}
          />
        )
      })}
      {/* Phase labels */}
      {phases.map((phase, i) => {
        const angle = ((i + 0.5) / 12) * Math.PI * 2 - Math.PI / 2
        const lx = cx + 34 * Math.cos(angle)
        const ly = cy + 34 * Math.sin(angle)
        const isActive = i === cyclePos
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize={isActive ? 7 : 5.5}
            fill={isActive ? (PHASE_COLORS[phase] || '#fff') : 'rgba(200,216,232,0.2)'}
            style={{ filter: isActive ? `drop-shadow(0 0 4px ${PHASE_COLORS[phase]})` : 'none' }}
          >
            {phase.length > 2 ? phase.slice(0, 2) : phase}
          </text>
        )
      })}
      {/* Center */}
      <circle cx={cx} cy={cy} r={20} fill="rgba(0,0,0,0.7)" stroke={`${color}22`} strokeWidth={1} />
      <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle" fontSize={8}
        fill="rgba(200,216,232,0.5)">
        今年
      </text>
      <text x={cx} y={cy + 7} textAnchor="middle" dominantBaseline="middle" fontSize={7}
        fill={PHASE_COLORS[FORTUNE_PHASES[cyclePos]] || '#fff'}
        style={{ filter: `drop-shadow(0 0 4px ${PHASE_COLORS[FORTUNE_PHASES[cyclePos]]})` }}>
        {FORTUNE_PHASES[cyclePos]}
      </text>
    </svg>
  )
}

function FortuneArc({ cyclePos, color }) {
  const W = 200, H = 48
  const barW = W / 12 - 2
  return (
    <div>
      <div style={{ fontSize: 9, color: 'rgba(0,245,255,0.5)', letterSpacing: '0.2em', marginBottom: 8, textTransform: 'uppercase' }}>
        12-Year Fortune Cycle
      </div>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        {FORTUNE_PHASES.map((phase, i) => {
          const x = i * (W / 12) + 1
          const isActive = i === cyclePos
          const isCaution = CAUTION_PHASES.includes(phase)
          const barColor = isActive ? (PHASE_COLORS[phase] || color) : (isCaution ? 'rgba(255,107,53,0.15)' : 'rgba(0,245,255,0.06)')
          const h = isActive ? H : (isCaution ? H * 0.5 : H * 0.3)
          const y = H - h
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h}
                fill={barColor}
                style={{ filter: isActive ? `drop-shadow(0 0 6px ${PHASE_COLORS[phase]})` : 'none' }}
              />
              {isActive && (
                <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={7}
                  fill={PHASE_COLORS[phase] || color}>
                  ▼
                </text>
              )}
            </g>
          )
        })}
        {/* year labels */}
        {[0, 3, 6, 9, 11].map(i => (
          <text key={i} x={i * (W / 12) + barW / 2 + 1} y={H + 10} textAnchor="middle"
            fontSize={7} fill="rgba(200,216,232,0.25)">
            {i + 1}
          </text>
        ))}
      </svg>
    </div>
  )
}

export default function SixStarCard({ data }) {
  const color = data.color || '#DAA520'
  const isCaution = CAUTION_PHASES.includes(data.currentFortune)
  const cyclePos = FORTUNE_PHASES.indexOf(data.currentFortune)

  return (
    <div className="card" style={{ '--accent': color }}>
      <div className="card-top-line" style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
      <div className="card-header">
        <CycleWheel cyclePos={cyclePos >= 0 ? cyclePos : 0} color={color} />
        <div className="card-meta">
          <div className="card-category">Six Star · 六星占術</div>
          <div className="card-name" style={{ color, textShadow: `0 0 15px ${color}` }}>{data.star}</div>
          <div className="card-sub">{data.polarity}タイプ</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <span className="tag" style={{
              color: isCaution ? '#ff6b35' : '#00ff88',
              borderColor: isCaution ? 'rgba(255,107,53,0.3)' : 'rgba(0,255,136,0.3)',
              background: isCaution ? 'rgba(255,107,53,0.08)' : 'rgba(0,255,136,0.08)',
            }}>
              {isCaution ? '⚠' : '✦'} {data.currentFortune}
            </span>
          </div>
          <p className="card-trait" style={{ marginTop: 8 }}>{data.description}</p>
        </div>
      </div>
      <div className="card-divider" />
      <FortuneArc cyclePos={cyclePos >= 0 ? cyclePos : 0} color={color} />
      <p style={{ fontSize: 12, color: 'rgba(200,216,232,0.55)', lineHeight: 1.7, letterSpacing: '0.04em', marginTop: 10 }}>
        {data.fortuneDescription}
      </p>
    </div>
  )
}
