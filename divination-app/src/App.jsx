import { useState, useCallback } from 'react'
import DateInput from './components/DateInput'
import ZodiacCard from './components/ZodiacCard'
import FourPillarsCard from './components/FourPillarsCard'
import SixStarCard from './components/SixStarCard'
import NineStarCard from './components/NineStarCard'
import NumerologyCard from './components/NumerologyCard'
import { getZodiac, getFourPillars, getSixStar, getNineStarKi, getNumerology } from './utils/divination'
import './App.css'

const today = new Date()

export default function App() {
  const [date, setDate] = useState({
    year: today.getFullYear() - 25,
    month: today.getMonth() + 1,
    day: today.getDate(),
  })
  const [results, setResults] = useState(null)

  const handleDivine = useCallback(() => {
    const { year, month, day } = date
    setResults({
      zodiac: getZodiac(month, day),
      fourPillars: getFourPillars(year, month, day),
      sixStar: getSixStar(year, month, day),
      nineStar: getNineStarKi(year, month, day),
      numerology: getNumerology(year, month, day),
    })
  }, [date])

  return (
    <div className="app">
      <div className="bg-canvas">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      <header className="header">
        <div className="header-inner">
          <span className="title-sep">◈</span>
          <div>
            <div className="title-ja">天命占い</div>
            <div className="title-en">CELESTIAL DIVINATION ORACLE</div>
          </div>
          <span className="title-sep">◈</span>
        </div>
        <div className="header-glow" />
      </header>

      <main className="main">
        <DateInput date={date} onChange={setDate} onDivine={handleDivine} />

        {results && (
          <div className="results">
            <div className="results-header">
              <div className="results-date">
                ◈ {date.year}.{String(date.month).padStart(2,'0')}.{String(date.day).padStart(2,'0')} ◈
              </div>
            </div>
            <div className="cards-grid">
              <ZodiacCard data={results.zodiac} birthDate={date} />
              <SixStarCard data={results.sixStar} birthDate={date} />
              <NineStarCard data={results.nineStar} birthDate={date} />
              <NumerologyCard data={results.numerology} birthDate={date} />
              <FourPillarsCard data={results.fourPillars} birthDate={date} />
            </div>
          </div>
        )}

        {!results && (
          <div className="welcome">
            <span className="welcome-orb">🔮</span>
            <p className="welcome-text">生年月日を入力して<br />天命の扉を開く</p>
            <div className="welcome-hint">∿ 5種の占術で運命を解析 ∿</div>
          </div>
        )}
      </main>

      <footer className="footer">
        CELESTIAL DIVINATION ORACLE · 占いは参考程度にお楽しみください
      </footer>
    </div>
  )
}
