import { useState } from 'react'
import './DateInput.css'

const currentYear = new Date().getFullYear()
const MIN_YEAR = 1924
const MAX_YEAR = currentYear

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

export default function DateInput({ date, onChange, onDivine }) {
  const [inputMode, setInputMode] = useState('slider') // 'slider' | 'text'

  const maxDay = daysInMonth(date.year, date.month)
  const safeDay = Math.min(date.day, maxDay)

  const update = (field, value) => {
    const next = { ...date, [field]: Number(value) }
    // Clamp day when month/year changes
    const md = daysInMonth(next.year, next.month)
    if (next.day > md) next.day = md
    onChange(next)
  }

  const handleTextDate = (e) => {
    const val = e.target.value
    if (!val) return
    const [y, m, d] = val.split('-').map(Number)
    if (y && m && d) {
      onChange({ year: y, month: m, day: d })
    }
  }

  const textValue = `${date.year}-${String(date.month).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`

  return (
    <div className="date-input glass">
      <div className="di-header">
        <span className="di-label">生年月日</span>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${inputMode === 'slider' ? 'active' : ''}`}
            onClick={() => setInputMode('slider')}
          >
            スライダー
          </button>
          <button
            className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            直接入力
          </button>
        </div>
      </div>

      {inputMode === 'text' ? (
        <div className="text-input-row">
          <input
            type="date"
            className="date-picker"
            value={textValue}
            min={`${MIN_YEAR}-01-01`}
            max={`${MAX_YEAR}-12-31`}
            onChange={handleTextDate}
          />
        </div>
      ) : (
        <div className="sliders">
          <SliderRow
            label="年"
            value={date.year}
            min={MIN_YEAR}
            max={MAX_YEAR}
            display={`${date.year}年`}
            onChange={v => update('year', v)}
          />
          <SliderRow
            label="月"
            value={date.month}
            min={1}
            max={12}
            display={`${date.month}月`}
            onChange={v => update('month', v)}
          />
          <SliderRow
            label="日"
            value={safeDay}
            min={1}
            max={maxDay}
            display={`${safeDay}日`}
            onChange={v => update('day', v)}
          />
        </div>
      )}

      <div className="di-preview">
        <span className="di-date-display">
          {date.year}年{date.month}月{safeDay}日
        </span>
      </div>

      <button className="divine-btn" onClick={onDivine}>
        <span className="divine-btn-icon">✦</span>
        <span>占う</span>
        <span className="divine-btn-icon">✦</span>
      </button>
    </div>
  )
}

function SliderRow({ label, value, min, max, display, onChange }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="slider-row">
      <div className="slider-meta">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{display}</span>
      </div>
      <div className="slider-track-wrap">
        <input
          type="range"
          className="slider"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ '--pct': `${pct}%` }}
        />
      </div>
    </div>
  )
}
