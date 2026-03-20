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
      <div className="bg-orbs">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="orb orb4" />
      </div>

      <header className="header glass">
        <div className="header-inner">
          <div className="star-decoration">✦ ✧ ✦</div>
          <h1 className="title">
            <span className="title-ja">天命占い</span>
            <span className="title-en">MULTI DIVINATION</span>
          </h1>
          <div className="star-decoration">✦ ✧ ✦</div>
        </div>
      </header>

      <main className="main">
        <DateInput date={date} onChange={setDate} onDivine={handleDivine} />

        {results && (
          <div className="results">
            <div className="results-header">
              <span className="results-date">
                {date.year}年{date.month}月{date.day}日生まれの運命
              </span>
            </div>

            <div className="cards-grid">
              <ZodiacCard data={results.zodiac} />
              <SixStarCard data={results.sixStar} />
              <NineStarCard data={results.nineStar} />
              <NumerologyCard data={results.numerology} />
              <FourPillarsCard data={results.fourPillars} />
            </div>
          </div>
        )}

        {!results && (
          <div className="welcome glass">
            <div className="welcome-icon">🌙</div>
            <p className="welcome-text">生年月日を入力して<br />あなたの運命を紐解く</p>
            <div className="welcome-stars">✦ ✧ ★ ✧ ✦</div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2024 天命占い · 占いは参考程度にお楽しみください</p>
      </footer>
    </div>
  )
}
