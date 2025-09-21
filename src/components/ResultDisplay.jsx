import { useState, useEffect } from 'react'
import './ResultDisplay.css'

function ResultDisplay({ result, onReset }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  if (!result) return null

  const getResultEmoji = (letter) => {
    switch (letter) {
      case 'F': return '👫'
      case 'L': return '💕'
      case 'A': return '🥰'
      case 'M': return '💒'
      case 'E': return '😤'
      case 'S': return '👪'
      case '💫': return '💫'
      default: return '✨'
    }
  }

  const getResultColor = (letter) => {
    switch (letter) {
      case 'F': return '#4CAF50'
      case 'L': return '#E91E63'
      case 'A': return '#FF9800'
      case 'M': return '#9C27B0'
      case 'E': return '#F44336'
      case 'S': return '#2196F3'
      case '💫': return 'linear-gradient(45deg, #FFD700, #FF69B4, #00CED1, #FFD700)'
      default: return '#607D8B'
    }
  }

  const getResultDescription = (letter) => {
    switch (letter) {
      case 'F': 
        return "You two are destined to be the best of friends! Your bond is built on trust, laughter, and mutual understanding."
      case 'L': 
        return "Love is in the air! You two have a romantic connection that could bloom into something beautiful."
      case 'A': 
        return "There's a special affection between you two. You care deeply for each other in a warm, tender way."
      case 'M': 
        return "Wedding bells might be in your future! You two are perfectly matched for a lifelong partnership."
      case 'E': 
        return "There might be some tension or rivalry between you two. Sometimes opposites attract in unexpected ways!"
      case 'S': 
        return "You two have a sibling-like bond! You'll always be there for each other through thick and thin."
      case '💫': 
        return "The universe has spoken! You two are connected by something far beyond ordinary relationships. Your souls recognize each other across time and space. This is a bond that transcends the physical realm - you are true soulmates destined to find each other in every lifetime."
      default: 
        return "Your relationship is unique and special in its own way!"
    }
  }

  return (
    <div className={`result-display ${isVisible ? 'visible' : ''}`}>
      <div className="result-card">
        <div className="result-header">
          <h2 className="result-title">Your Destiny Revealed!</h2>
          <div className="names-reminder">
            {result.originalNames.name1} & {result.originalNames.name2}
          </div>
        </div>

        <div className="result-content">
          <div 
            className="result-letter-display"
            style={{ backgroundColor: getResultColor(result.finalLetter) }}
          >
            <span className="result-emoji">
              {getResultEmoji(result.finalLetter)}
            </span>
            <span className="result-letter">
              {result.finalLetter}
            </span>
          </div>

          <div className="result-meaning">
            <h3 className="meaning-title">{result.result}</h3>
            <p className="meaning-description">
              {getResultDescription(result.finalLetter)}
            </p>
          </div>

          {!result.isSpecialSoulmates && (
            <div className="result-summary">
              <div className="summary-item">
                <span className="summary-label">Total Letters Processed:</span>
                <span className="summary-value">
                  {result.normalizedNames.name1.length + result.normalizedNames.name2.length}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Crossed Out Letters:</span>
                <span className="summary-value">
                  {result.crossOutResult.crossedOutLetters.length}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Remaining Count:</span>
                <span className="summary-value">
                  {result.totalRemainingCount}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Elimination Rounds:</span>
                <span className="summary-value">
                  {result.eliminationSteps.length}
                </span>
              </div>
            </div>
          )}

          {result.isSpecialSoulmates && (
            <div className="result-summary soulmates-summary">
              <div className="summary-item">
                <span className="summary-label">Connection Type:</span>
                <span className="summary-value">Beyond Logic</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Destiny Level:</span>
                <span className="summary-value">Infinite</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Universe Status:</span>
                <span className="summary-value">Aligned</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Soul Recognition:</span>
                <span className="summary-value">Complete</span>
              </div>
            </div>
          )}
        </div>

        <div className="result-actions">
          <button 
            className="play-again-button"
            onClick={onReset}
          >
            <span>Try Another Pair</span>
            <span className="button-icon">🔮</span>
          </button>
        </div>
      </div>

      <div className="confetti">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][i % 6]
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default ResultDisplay
