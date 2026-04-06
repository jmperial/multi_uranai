// 九星気学カード — 九宮格 (3×3 magic square) + 今日の方位エネルギー

// Lo Shu magic square layout
const LO_SHU = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
]

const STAR_COLORS = {
  1: '#1E90FF', 2: '#8B6914', 3: '#228B22', 4: '#32CD32',
  5: '#DAA520', 6: '#C0C0C0', 7: '#FF6347', 8: '#CD853F', 9: '#DC143C',
}

const STAR_SYMBOLS = {
  1: '☵', 2: '☷', 3: '☳', 4: '☴', 5: '☯', 6: '☰', 7: '☱', 8: '☶', 9: '☲',
}

const DIRECTIONS = ['南東', '南', '南西', '東', '中', '西', '北東', '北', '北西']

function MagicSquare({ activeNum, color }) {
  const size = 144
  const cellW = size / 3
  const dirPositions = [
    '南東', '南', '南西',
    '東', '中', '西',
    '北東', '北', '北西',
  ]
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      <defs>
        <filter id="nine-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {LO_SHU.map((row, ri) =>
        row.map((num, ci) => {
          const x = ci * cellW, y = ri * cellW
          const isActive = num === activeNum
          const starColor = STAR_COLORS[num]
          return (
            <g key={`${ri}-${ci}`}>
              <rect
                x={x + 1} y={y + 1}
                width={cellW - 2} height={cellW - 2}
                fill={isActive ? `${starColor}22` : 'rgba(0,0,0,0.4)'}
                stroke={isActive ? starColor : 'rgba(0,245,255,0.08)'}
                strokeWidth={isActive ? 1.5 : 0.5}
                style={{ filter: isActive ? `drop-shadow(0 0 8px ${starColor})` : 'none' }}
              />
              {/* Direction label */}
              <text x={x + cellW / 2} y={y + 8} textAnchor="middle"
                fontSize={5} fill={isActive ? `${starColor}cc` : 'rgba(200,216,232,0.15)'}>
                {dirPositions[ri * 3 + ci]}
              </text>
              {/* Symbol */}
              <text x={x + cellW / 2} y={y + cellW / 2 - 3} textAnchor="middle"
                dominantBaseline="middle" fontSize={isActive ? 16 : 12}
                fill={isActive ? starColor : 'rgba(200,216,232,0.2)'}
                style={{ filter: isActive ? `drop-shadow(0 0 6px ${starColor})` : 'none' }}>
                {STAR_SYMBOLS[num]}
              </text>
              {/* Number */}
              <text x={x + cellW / 2} y={y + cellW - 7} textAnchor="middle"
                fontSize={7} fontWeight={isActive ? '800' : '400'}
                fill={isActive ? starColor : 'rgba(200,216,232,0.2)'}>
                {num}
              </text>
            </g>
          )
        })
      )}
      {/* Grid lines */}
      {[1, 2].map(i => (
        <g key={i}>
          <line x1={i * cellW} y1={0} x2={i * cellW} y2={size}
            stroke="rgba(0,245,255,0.06)" strokeWidth={0.5} />
          <line x1={0} y1={i * cellW} x2={size} y2={i * cellW}
            stroke="rgba(0,245,255,0.06)" strokeWidth={0.5} />
        </g>
      ))}
    </svg>
  )
}

// 九星の今年の廻座 (annual position) — simplified radial display
function StarEnergy({ number, element, color }) {
  const W = 200, H = 56
  const cx = W / 2, cy = H / 2 + 4
  const R = 22
  // 9 spokes
  const spokes = Array.from({ length: 9 }, (_, i) => {
    const angle = (i / 9) * Math.PI * 2 - Math.PI / 2
    const spokeLen = i + 1 === number ? R : R * 0.55
    return { angle, spokeLen, num: i + 1 }
  })
  return (
    <div>
      <div style={{ fontSize: 9, color: 'rgba(0,245,255,0.5)', letterSpacing: '0.2em', marginBottom: 6, textTransform: 'uppercase' }}>
        Nine Star Energy
      </div>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        {/* Rings */}
        {[R * 0.4, R * 0.7, R].map((r, i) => (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke="rgba(0,245,255,0.05)" strokeWidth={0.5} />
        ))}
        {/* Spokes */}
        {spokes.map(({ angle, spokeLen, num }) => {
          const x2 = cx + spokeLen * Math.cos(angle)
          const y2 = cy + spokeLen * Math.sin(angle)
          const isActive = num === number
          const sColor = STAR_COLORS[num]
          return (
            <g key={num}>
              <line x1={cx} y1={cy} x2={x2} y2={y2}
                stroke={isActive ? sColor : 'rgba(0,245,255,0.08)'}
                strokeWidth={isActive ? 2 : 0.5} />
              <circle cx={x2} cy={y2} r={isActive ? 4 : 2}
                fill={isActive ? sColor : 'rgba(200,216,232,0.1)'}
                style={{ filter: isActive ? `drop-shadow(0 0 5px ${sColor})` : 'none' }} />
            </g>
          )
        })}
        {/* Center */}
        <circle cx={cx} cy={cy} r={6} fill={`${color}33`} stroke={color} strokeWidth={1} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
          fontSize={7} fill={color} fontWeight="800">
          {number}
        </text>
        {/* Side labels */}
        <text x={cx + R + 16} y={cy} textAnchor="middle" dominantBaseline="middle"
          fontSize={8} fill="rgba(200,216,232,0.3)">南</text>
        <text x={cx - R - 16} y={cy} textAnchor="middle" dominantBaseline="middle"
          fontSize={8} fill="rgba(200,216,232,0.3)">北</text>
        <text x={cx} y={cy - R - 10} textAnchor="middle" dominantBaseline="middle"
          fontSize={8} fill="rgba(200,216,232,0.3)">東</text>
        <text x={cx} y={cy + R + 14} textAnchor="middle" dominantBaseline="middle"
          fontSize={8} fill="rgba(200,216,232,0.3)">西</text>
      </svg>
    </div>
  )
}

export default function NineStarCard({ data }) {
  const color = data.color || '#DAA520'
  return (
    <div className="card" style={{ '--accent': color }}>
      <div className="card-top-line" style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
      <div className="card-header">
        <MagicSquare activeNum={data.number} color={color} />
        <div className="card-meta">
          <div className="card-category">Nine Star Ki · 九星気学</div>
          <div className="card-name" style={{ color, textShadow: `0 0 15px ${color}` }}>{data.name}</div>
          <div className="card-sub">本命星</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <span className="tag" style={{ color, borderColor: `${color}44`, background: `${color}12` }}>
              {STAR_SYMBOLS[data.number]} {data.element}属性
            </span>
          </div>
          <p className="card-trait" style={{ marginTop: 8 }}>{data.trait}</p>
        </div>
      </div>
      <div className="card-divider" />
      <StarEnergy number={data.number} element={data.element} color={color} />
    </div>
  )
}
