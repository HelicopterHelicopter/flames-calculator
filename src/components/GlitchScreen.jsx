import { useState, useEffect } from 'react'
import './GlitchScreen.css'

function GlitchScreen({ onGlitchComplete }) {
  const [glitchPhase, setGlitchPhase] = useState('starting')
  const [glitchText, setGlitchText] = useState('')

  const matrixText = "There is a glitch in the matrix. Fate has something special in mind."
  const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~"

  useEffect(() => {
    const phases = [
      { phase: 'starting', duration: 300 },
      { phase: 'scrambling', duration: 1200 },
      { phase: 'revealing', duration: 2000 },
      { phase: 'complete', duration: 1000 }
    ]

    let currentPhaseIndex = 0
    
    const runPhase = () => {
      if (currentPhaseIndex >= phases.length) {
        onGlitchComplete()
        return
      }

      const currentPhase = phases[currentPhaseIndex]
      setGlitchPhase(currentPhase.phase)

      if (currentPhase.phase === 'scrambling') {
        // Scramble effect
        let scrambleCount = 0
        const scrambleInterval = setInterval(() => {
          let scrambled = ''
          for (let i = 0; i < matrixText.length; i++) {
            if (matrixText[i] === ' ') {
              scrambled += ' '
            } else {
              scrambled += glitchChars[Math.floor(Math.random() * glitchChars.length)]
            }
          }
          setGlitchText(scrambled)
          scrambleCount++
          
          if (scrambleCount > 20) {
            clearInterval(scrambleInterval)
          }
        }, 100)
      } else if (currentPhase.phase === 'revealing') {
        // Reveal text letter by letter with guaranteed completion
        let revealIndex = 0
        const totalRevealTime = 1500 // 1.5 seconds for reveal
        const intervalTime = totalRevealTime / matrixText.length
        
        const revealInterval = setInterval(() => {
          let revealed = ''
          for (let i = 0; i < matrixText.length; i++) {
            if (i <= revealIndex) {
              revealed += matrixText[i]
            } else if (matrixText[i] === ' ') {
              revealed += ' '
            } else {
              revealed += glitchChars[Math.floor(Math.random() * glitchChars.length)]
            }
          }
          setGlitchText(revealed)
          revealIndex++
          
          if (revealIndex >= matrixText.length) {
            clearInterval(revealInterval)
            setGlitchText(matrixText)
          }
        }, intervalTime)
        
        // Failsafe: ensure full text is shown after 1.6 seconds
        setTimeout(() => {
          setGlitchText(matrixText)
        }, 1600)
      } else if (currentPhase.phase === 'complete') {
        // Ensure the complete text is shown
        setGlitchText(matrixText)
      }

      setTimeout(() => {
        currentPhaseIndex++
        runPhase()
      }, currentPhase.duration)
    }

    runPhase()
  }, [onGlitchComplete])

  return (
    <div className={`glitch-screen ${glitchPhase}`}>
      <div className="glitch-container">
        <div className="glitch-bg"></div>
        <div className="matrix-rain">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="rain-column" style={{
              left: `${i * 5}%`,
              animationDelay: `${Math.random() * 2}s`
            }}>
              {[...Array(10)].map((_, j) => (
                <span key={j} className="rain-char">
                  {glitchChars[Math.floor(Math.random() * glitchChars.length)]}
                </span>
              ))}
            </div>
          ))}
        </div>
        
        <div className="glitch-message">
          <div className="glitch-text" data-text={glitchText}>
            {glitchText}
          </div>
        </div>

        <div className="scan-lines"></div>
        <div className="glitch-overlay"></div>
      </div>
    </div>
  )
}

export default GlitchScreen
