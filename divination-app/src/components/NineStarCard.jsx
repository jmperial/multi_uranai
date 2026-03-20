import './Card.css'

export default function NineStarCard({ data }) {
  return (
    <div className="card glass nine-star-card">
      <div className="card-header">
        <div
          className="card-icon"
          style={{ background: `${data.color}22`, borderColor: `${data.color}44` }}
        >
          <span className="num-display" style={{ color: data.color }}>{data.number}</span>
        </div>
        <div className="card-title-block">
          <div className="card-category">Nine Star Ki · 九星気学</div>
          <div className="card-title" style={{ color: data.color }}>{data.name}</div>
          <div className="card-subtitle">本命星 · {data.element}の気</div>
        </div>
      </div>

      <div className="card-body">
        <div className="tag-row">
          <span className="tag" style={{ color: data.color, borderColor: `${data.color}44`, background: `${data.color}18` }}>
            {data.element}属性
          </span>
        </div>
        <div className="card-divider" />
        <p className="card-trait">{data.trait}</p>
      </div>
    </div>
  )
}
