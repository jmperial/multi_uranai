import './Card.css'

const ELEMENT_COLORS = {
  '火': { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#fca5a5' },
  '土': { bg: 'rgba(161, 110, 46, 0.15)', border: 'rgba(161, 110, 46, 0.3)', text: '#fcd34d' },
  '風': { bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.3)', text: '#a5b4fc' },
  '水': { bg: 'rgba(14, 165, 233, 0.15)', border: 'rgba(14, 165, 233, 0.3)', text: '#7dd3fc' },
}

export default function ZodiacCard({ data }) {
  const color = ELEMENT_COLORS[data.element] || ELEMENT_COLORS['風']

  return (
    <div className="card glass zodiac-card" style={{ '--accent': color.text }}>
      <div className="card-header">
        <div className="card-icon zodiac-symbol">{data.symbol}</div>
        <div className="card-title-block">
          <div className="card-category">Western Astrology · 星座</div>
          <div className="card-title">{data.name}</div>
          <div className="card-subtitle">{data.english}</div>
        </div>
      </div>

      <div className="card-body">
        <div className="tag-row">
          <span className="tag" style={{ background: color.bg, borderColor: color.border, color: color.text }}>
            {data.element}のサイン
          </span>
          <span className="tag">支配星: {data.ruling}</span>
        </div>
        <div className="card-divider" />
        <p className="card-trait">{data.trait}</p>
      </div>
    </div>
  )
}
