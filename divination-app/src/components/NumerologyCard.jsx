// 数秘術カード — 大きな光る数字 + ライフパスエネルギーアーク

const NUM_COLORS = {
  1: '#ff6b35', 2: '#00f5ff', 3: '#ffd700', 4: '#00ff88',
  5: '#bf00ff', 6: '#ff69b4', 7: '#4169ff', 8: '#ff4444',
  9: '#00ffd5', 11: '#fff700', 22: '#fff700', 33: '#fff700',
}

const NUM_SYMBOLS = {
  1: '♟', 2: '☯', 3: '✦', 4: '◈', 5: '∞', 6: '♡',
  7: '✧', 8: '⊕', 9: '◉', 11: '⚡', 22: '▲', 33: '❋',
}

// Radial arc gauge showing the number's "energy level" (1-9, master treated as special)
function NumberArc({ number, color }) {
  const cx = 72, cy = 72
  const R = 52
  const startAngle = Math.PI * 0.75
  const endAngle = Math.PI * 2.25
  const totalArc = endAngle - startAngle

  const displayNum = [11, 22, 33].includes(number) ? 9 : number // master = full arc
  const filled = (displayNum / 9) * totalArc
  const isMaster = [11, 22, 33].includes(number)

  const arcPath = (start, end, r) => {
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const large = end - start > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  // Tick marks
  const ticks = Array.from({ length: 9 }, (_, i) => {
    const a = startAngle + (i / 8) * totalArc
    const r1 = R - 6, r2 = R + 2
    return {
      x1: cx + r1 * Math.cos(a), y1: cy + r1 * Math.sin(a),
      x2: cx + r2 * Math.cos(a), y2: cy + r2 * Math.sin(a),
      active: i < displayNum,
    }
  })

  return (
    <svg width={144} height={144} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="num-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`${color}20`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={62} fill="url(#num-glow)" />
      {/* Background arc */}
      <path d={arcPath(startAngle, endAngle, R)} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth={6} strokeLinecap="round" />
      {/* Filled arc */}
      <path d={arcPath(startAngle, startAngle + filled, R)} fill="none"
        stroke="url(#arc-grad)" strokeWidth={6} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      {/* Ticks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.active ? color : 'rgba(255,255,255,0.08)'}
          strokeWidth={t.active ? 1.5 : 0.5}
          style={{ filter: t.active ? `drop-shadow(0 0 3px ${color})` : 'none' }}
        />
      ))}
      {/* Center content */}
      <circle cx={cx} cy={cy} r={32} fill="rgba(0,0,0,0.7)" stroke={`${color}22`} strokeWidth={1} />
      {/* Symbol */}
      <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle"
        fontSize={11} fill={`${color}88`}>
        {NUM_SYMBOLS[number] || '✦'}
      </text>
      {/* Big number */}
      <text x={cx} y={cy + 6} textAnchor="middle" dominantBaseline="middle"
        fontSize={isMaster ? 18 : 24} fontWeight="900"
        fill={color}
        style={{ filter: `drop-shadow(0 0 10px ${color})` }}>
        {number}
      </text>
      {isMaster && (
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize={6}
          fill={`${color}88`} letterSpacing="0.2em">
          MASTER
        </text>
      )}
    </svg>
  )
}

// Life path bars: 1-9 (or 11/22/33) energy resonance
function LifePathBars({ number, color }) {
  const W = 200, H = 52
  const isMaster = [11, 22, 33].includes(number)
  // Show resonance with each number 1-9
  const baseNum = isMaster ? (number === 11 ? 2 : number === 22 ? 4 : 6) : number

  return (
    <div>
      <div style={{ fontSize: 9, color: 'rgba(0,245,255,0.5)', letterSpacing: '0.2em', marginBottom: 8, textTransform: 'uppercase' }}>
        Numerological Resonance
      </div>
      <svg width={W} height={H}>
        {Array.from({ length: 9 }, (_, i) => {
          const n = i + 1
          const x = i * (W / 9) + 1
          const barW = W / 9 - 3
          // Resonance: peaks at the number, falls off
          const dist = Math.abs(n - baseNum)
          const resonance = Math.max(0.08, 1 - dist * 0.22)
          const h = resonance * (H - 14)
          const y = H - 2 - h
          const isActive = n === baseNum
          const barColor = NUM_COLORS[n] || color
          return (
            <g key={n}>
              <rect x={x} y={y} width={barW} height={h}
                fill={isActive ? barColor : `${barColor}44`}
                style={{ filter: isActive ? `drop-shadow(0 0 5px ${barColor})` : 'none' }}
              />
              <text x={x + barW / 2} y={H} textAnchor="middle"
                fontSize={7} fill={isActive ? barColor : 'rgba(200,216,232,0.25)'}>
                {n}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function NumerologyCard({ data }) {
  const color = NUM_COLORS[data.number] || '#00f5ff'
  return (
    <div className="card" style={{ '--accent': color }}>
      <div className="card-top-line" style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
      <div className="card-header">
        <NumberArc number={data.number} color={color} />
        <div className="card-meta">
          <div className="card-category">Numerology · 数秘術</div>
          <div className="card-name" style={{ color, textShadow: `0 0 15px ${color}` }}>
            {data.number}
          </div>
          <div className="card-sub">{data.title}</div>
          {data.isMaster && (
            <div style={{ marginTop: 6 }}>
              <span className="tag" style={{ color: '#fff700', borderColor: 'rgba(255,247,0,0.3)', background: 'rgba(255,247,0,0.08)' }}>
                ⚡ マスターナンバー
              </span>
            </div>
          )}
          <p className="card-trait" style={{ marginTop: 8 }}>{data.desc}</p>
        </div>
      </div>
      <div className="card-divider" />
      <LifePathBars number={data.number} color={color} />
    </div>
  )
}
