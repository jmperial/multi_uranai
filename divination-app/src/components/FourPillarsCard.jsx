// 四柱推命カード — 五行レーダーチャート + 四柱グリッド

const ELEMENT_COLORS = {
  木: '#4ade80', 火: '#ff6b35', 土: '#ffd700', 金: '#e2e8f0', 水: '#60a5ff',
}

const ELEMENT_SYMBOLS = {
  木: '🌿', 火: '🔥', 土: '⛰', 金: '⚙', 水: '💧',
}

// Pentagon radar chart for 5-element balance
function WuxingRadar({ elementCount, dominantElement }) {
  const W = 144, H = 144
  const cx = W / 2, cy = H / 2
  const R = 52
  const elements = ['木', '火', '土', '金', '水']
  // Pentagon: top = 木, clockwise
  const angles = elements.map((_, i) => (i / 5) * Math.PI * 2 - Math.PI / 2)
  const maxVal = Math.max(...Object.values(elementCount), 1)

  const outerPts = angles.map(a => ({
    x: cx + R * Math.cos(a),
    y: cy + R * Math.sin(a),
  }))

  // Data polygon
  const dataScale = elements.map(el => {
    const val = elementCount[el] || 0
    return val === 0 ? 0.08 : (val / (maxVal + 0.5))
  })
  const dataPts = angles.map((a, i) => ({
    x: cx + R * dataScale[i] * Math.cos(a),
    y: cy + R * dataScale[i] * Math.sin(a),
  }))

  const outerPath = outerPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z'
  const dataPath = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z'

  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="wuxing-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,245,255,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="data-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ELEMENT_COLORS[dominantElement]} stopOpacity="0.3" />
          <stop offset="100%" stopColor={ELEMENT_COLORS[dominantElement]} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={60} fill="url(#wuxing-glow)" />
      {/* Concentric reference pentagons */}
      {[0.33, 0.66, 1].map((scale, si) => {
        const pts = angles.map(a => `${cx + R * scale * Math.cos(a)},${cy + R * scale * Math.sin(a)}`).join(' ')
        return <polygon key={si} points={pts} fill="none"
          stroke="rgba(0,245,255,0.07)" strokeWidth={0.5} />
      })}
      {/* Axis lines */}
      {outerPts.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
          stroke="rgba(0,245,255,0.08)" strokeWidth={0.5} />
      ))}
      {/* Data fill */}
      <path d={dataPath} fill="url(#data-fill)"
        stroke={ELEMENT_COLORS[dominantElement]} strokeWidth={1.5}
        style={{ filter: `drop-shadow(0 0 6px ${ELEMENT_COLORS[dominantElement]})` }}
        opacity={0.9} />
      {/* Data vertices */}
      {dataPts.map((p, i) => {
        const el = elements[i]
        const isDom = el === dominantElement
        return (
          <circle key={i} cx={p.x} cy={p.y} r={isDom ? 4 : 2.5}
            fill={ELEMENT_COLORS[el]}
            style={{ filter: isDom ? `drop-shadow(0 0 5px ${ELEMENT_COLORS[el]})` : 'none' }} />
        )
      })}
      {/* Labels */}
      {outerPts.map((p, i) => {
        const el = elements[i]
        const offset = 12
        const lx = cx + (R + offset) * Math.cos(angles[i])
        const ly = cy + (R + offset) * Math.sin(angles[i])
        const isDom = el === dominantElement
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize={isDom ? 11 : 9}
            fill={isDom ? ELEMENT_COLORS[el] : 'rgba(200,216,232,0.35)'}
            style={{ filter: isDom ? `drop-shadow(0 0 4px ${ELEMENT_COLORS[el]})` : 'none' }}>
            {el}
          </text>
        )
      })}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3} fill={ELEMENT_COLORS[dominantElement]}
        style={{ filter: `drop-shadow(0 0 6px ${ELEMENT_COLORS[dominantElement]})` }} />
    </svg>
  )
}

// Pillars display: vertical columns
function PillarsDisplay({ pillars }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: 'rgba(0,245,255,0.5)', letterSpacing: '0.2em', marginBottom: 8, textTransform: 'uppercase' }}>
        Four Pillars · 命式
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {pillars.map((p, i) => (
          <div key={i} style={{
            flex: 1,
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(0,245,255,0.08)',
            borderRadius: 2,
            padding: '8px 4px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 8, color: 'rgba(0,245,255,0.4)', letterSpacing: '0.1em', marginBottom: 6 }}>
              {p.label}
            </div>
            <div style={{
              fontSize: 18, fontWeight: 800,
              color: ELEMENT_COLORS[p.stemElement],
              textShadow: `0 0 8px ${ELEMENT_COLORS[p.stemElement]}`,
              lineHeight: 1,
            }}>
              {p.stem}
            </div>
            <div style={{ fontSize: 8, color: `${ELEMENT_COLORS[p.stemElement]}88`, marginBottom: 2 }}>
              {p.stemElement}
            </div>
            <div style={{
              fontSize: 16, fontWeight: 700,
              color: ELEMENT_COLORS[p.branchElement],
              opacity: 0.85,
              lineHeight: 1,
            }}>
              {p.branch}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(200,216,232,0.3)', marginTop: 2 }}>
              {p.animal}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FourPillarsCard({ data }) {
  const color = ELEMENT_COLORS[data.dominantElement] || '#ffd700'
  return (
    <div className="card" style={{ '--accent': color }}>
      <div className="card-top-line" style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
      <div className="card-header">
        <WuxingRadar elementCount={data.elementCount} dominantElement={data.dominantElement} />
        <div className="card-meta">
          <div className="card-category">Four Pillars · 四柱推命</div>
          <div className="card-name" style={{ color, textShadow: `0 0 15px ${color}` }}>
            {data.dayMaster}日主
          </div>
          <div className="card-sub">{data.dayMasterElement}の気質</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <span className="tag" style={{ color, borderColor: `${color}44`, background: `${color}12` }}>
              主元素: {data.dominantElement}
            </span>
            <span className="tag" style={{ color: 'rgba(200,216,232,0.45)', borderColor: 'rgba(200,216,232,0.1)' }}>
              {ELEMENT_SYMBOLS[data.dominantElement]}
            </span>
          </div>
          <p className="card-trait" style={{ marginTop: 8 }}>{data.trait}</p>
        </div>
      </div>
      <div className="card-divider" />
      <PillarsDisplay pillars={data.pillars} />
    </div>
  )
}
