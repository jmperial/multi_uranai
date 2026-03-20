import './Card.css'

const CAUTION_PHASES = ['乱気', '停止', '陰影', '大殺界']

export default function SixStarCard({ data }) {
  const isCaution = CAUTION_PHASES.includes(data.currentFortune)

  return (
    <div className="card glass six-star-card">
      <div className="card-header">
        <div
          className="card-icon"
          style={{ background: `${data.color}22`, borderColor: `${data.color}44`, fontSize: '24px' }}
        >
          {data.symbol}
        </div>
        <div className="card-title-block">
          <div className="card-category">Six Star · 六星占術</div>
          <div className="card-title" style={{ color: data.color }}>{data.star}</div>
          <div className="card-subtitle">{data.polarity}タイプ</div>
        </div>
      </div>

      <div className="card-body">
        <p className="card-trait">{data.description}</p>
        <div className="card-divider" />
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', letterSpacing: '0.1em' }}>
            今年の運気
          </div>
          <div className={`fortune-badge ${isCaution ? 'caution' : 'good'}`}>
            <span>{isCaution ? '⚠' : '✦'}</span>
            <span>{data.currentFortune}</span>
          </div>
          <p className="card-trait" style={{ marginTop: '10px', fontSize: '13px' }}>
            {data.fortuneDescription}
          </p>
        </div>
      </div>
    </div>
  )
}
