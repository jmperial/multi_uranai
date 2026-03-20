import './Card.css'

const ELEMENT_COLORS = {
  木: '#4ade80',
  火: '#f87171',
  土: '#fbbf24',
  金: '#e2e8f0',
  水: '#60a5fa',
}

export default function FourPillarsCard({ data }) {
  const maxCount = Math.max(...Object.values(data.elementCount), 1)

  return (
    <div className="card glass four-pillars-card">
      <div className="card-header">
        <div className="card-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
          ☯
        </div>
        <div className="card-title-block">
          <div className="card-category">Four Pillars · 四柱推命</div>
          <div className="card-title">{data.dayMaster}日主</div>
          <div className="card-subtitle">命式の主星 · {data.dayMasterElement}の気質</div>
        </div>
      </div>

      <div className="card-body">
        {/* Pillars grid */}
        <div className="pillars-grid">
          {data.pillars.map((p, i) => (
            <div key={i} className="pillar">
              <div className="pillar-label">{p.label}</div>
              <div className="pillar-stem" style={{ color: ELEMENT_COLORS[p.stemElement] }}>{p.stem}</div>
              <div className="pillar-branch">{p.branch}</div>
              <div className="pillar-animal">{p.animal}</div>
            </div>
          ))}
        </div>

        <div className="card-divider" />

        {/* Element balance */}
        <div className="element-bars">
          {Object.entries(data.elementCount).map(([el, count]) => (
            <div key={el} className="element-bar-row">
              <span className="element-bar-label" style={{ color: ELEMENT_COLORS[el] }}>{el}</span>
              <div className="element-bar-track">
                <div
                  className="element-bar-fill"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    background: ELEMENT_COLORS[el],
                    opacity: count === 0 ? 0.2 : 1,
                  }}
                />
              </div>
              <span className="element-bar-count">{count}</span>
            </div>
          ))}
        </div>

        <div className="card-divider" />

        <div className="tag-row">
          <span className="tag" style={{ color: ELEMENT_COLORS[data.dominantElement] }}>
            主要素: {data.dominantElement}
          </span>
        </div>
        <p className="card-trait">{data.trait}</p>
      </div>
    </div>
  )
}
