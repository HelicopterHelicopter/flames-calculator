import { useState, useEffect } from 'react'
import { createShareImage } from '../utils/createShareImage'
import './ResultDisplay.css'

function ResultDisplay({ result, onReset }) {
  const [isVisible, setIsVisible] = useState(false)
  const [shareState, setShareState] = useState('idle') // 'idle' | 'generating' | 'done'

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleShareWhatsApp = async () => {
    if (shareState === 'generating') return
    setShareState('generating')

    try {
      const blob = await createShareImage(result)
      const emoji = getResultEmoji(result.finalLetter)
      const message = `🔥 *FLAMES Result* 🔥\n\n*${result.originalNames.name1}* & *${result.originalNames.name2}* are *${result.result}* ${emoji}\n\nFind out your destiny too 👇\nflames.jheels.in`

      const imageFile = new File([blob], 'flames-result.png', { type: 'image/png' })

      // Try Web Share API (works natively on mobile)
      if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        await navigator.share({
          files: [imageFile],
          title: `FLAMES – ${result.originalNames.name1} & ${result.originalNames.name2} are ${result.result}!`,
          text: message,
        })
        setShareState('done')
        setTimeout(() => setShareState('idle'), 2000)
        return
      }

      // Desktop fallback: download image + open WhatsApp with text
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'flames-result.png'
      a.click()
      URL.revokeObjectURL(url)

      const waText = encodeURIComponent(message)
      window.open(`https://wa.me/?text=${waText}`, '_blank')
      setShareState('done')
      setTimeout(() => setShareState('idle'), 2000)
    } catch {
      // User cancelled share or error occurred
      setShareState('idle')
    }
  }

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
            className="whatsapp-share-button"
            onClick={handleShareWhatsApp}
            disabled={shareState === 'generating'}
          >
            {shareState === 'generating' ? (
              <>
                <span className="wa-spinner" />
                <span>Creating image…</span>
              </>
            ) : shareState === 'done' ? (
              <>
                <span>✅</span>
                <span>Shared!</span>
              </>
            ) : (
              <>
                <svg className="wa-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Share on WhatsApp</span>
              </>
            )}
          </button>

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
