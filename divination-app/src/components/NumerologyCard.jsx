import './Card.css'

export default function NumerologyCard({ data }) {
  return (
    <div className="card glass numerology-card">
      <div className="card-header">
        <div className="card-icon" style={{ background: 'rgba(251, 113, 133, 0.15)', borderColor: 'rgba(251, 113, 133, 0.3)', width: '54px', height: '54px', borderRadius: '16px' }}>
          <span className="num-big">{data.number}</span>
        </div>
        <div className="card-title-block">
          <div className="card-category">Numerology · 数秘術</div>
          <div className="card-title">{data.title}</div>
          {data.isMaster && (
            <div style={{ marginTop: '4px' }}>
              <span className="master-badge">✦ マスターナンバー</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-body">
        <p className="card-trait">{data.desc}</p>
      </div>
    </div>
  )
}
