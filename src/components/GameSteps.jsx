import { useEffect } from 'react'
import './GameSteps.css'

function GameSteps({ gameResult, currentStep, onStepComplete }) {
  useEffect(() => {
    // Auto-advance to next step without fade animation
    const timer = setTimeout(() => {
      onStepComplete()
    }, 2000)
    return () => clearTimeout(timer)
  }, [currentStep, onStepComplete])

  if (!gameResult) return null

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderNamesStep()
      case 1:
        return renderCommonLettersStep()
      case 2:
        return renderRemainingCountStep()
      case 3:
        return renderFlamesIntroStep()
      default: {
        // FLAMES elimination steps
        const eliminationIndex = currentStep - 4
        if (eliminationIndex < gameResult.eliminationSteps.length) {
          return renderEliminationStep(eliminationIndex)
        }
        return null
      }
    }
  }

  const renderNamesStep = () => (
    <div className="step-container visible">
      <h3 className="step-title">Step 1: The Names</h3>
      <div className="names-display">
        <div className="name-card">
          <span className="name-label">First Name:</span>
          <span className="name-value">{gameResult.originalNames.name1}</span>
          <div className="normalized-name">
            ({gameResult.normalizedNames.name1})
          </div>
        </div>
        <div className="plus-sign">+</div>
        <div className="name-card">
          <span className="name-label">Second Name:</span>
          <span className="name-value">{gameResult.originalNames.name2}</span>
          <div className="normalized-name">
            ({gameResult.normalizedNames.name2})
          </div>
        </div>
      </div>
    </div>
  )

  const renderCommonLettersStep = () => {
    return (
      <div className="step-container visible">
        <h3 className="step-title">Step 2: Cross Out Common Letters</h3>
        <div className="letters-analysis">
          <div className="name-letters">
            <h4>{gameResult.normalizedNames.name1}</h4>
            <div className="letter-grid">
              {gameResult.crossOutResult.name1WithCrossedOut.map((letterObj, index) => (
                <span 
                  key={index} 
                  className={`letter ${letterObj.isCrossedOut ? 'crossed-out' : 'remaining'}`}
                >
                  {letterObj.letter}
                  {letterObj.isCrossedOut && <span className="cross">✗</span>}
                </span>
              ))}
            </div>
          </div>
          
          <div className="name-letters">
            <h4>{gameResult.normalizedNames.name2}</h4>
            <div className="letter-grid">
              {gameResult.crossOutResult.name2WithCrossedOut.map((letterObj, index) => (
                <span 
                  key={index} 
                  className={`letter ${letterObj.isCrossedOut ? 'crossed-out' : 'remaining'}`}
                >
                  {letterObj.letter}
                  {letterObj.isCrossedOut && <span className="cross">✗</span>}
                </span>
              ))}
            </div>
          </div>

          {gameResult.crossOutResult.crossedOutLetters.length > 0 && (
            <div className="common-letters-summary">
              <h4>Crossed Out Letters:</h4>
              <div className="common-letters-list">
                {gameResult.crossOutResult.crossedOutLetters.map((letter, index) => (
                  <span key={index} className="common-letter-item">
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderRemainingCountStep = () => {
    return (
      <div className="step-container visible">
        <h3 className="step-title">Step 3: Count Remaining Letters</h3>
        <div className="remaining-analysis">
          {gameResult.crossOutResult.remainingLetters.length > 0 ? (
            <div className="remaining-letters-display">
              <h4>Remaining Letters:</h4>
              <div className="remaining-letters-grid">
                {gameResult.crossOutResult.remainingLetters.map((letter, index) => (
                  <div key={index} className="remaining-letter-item">
                    <span className="letter">{letter}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="no-remaining">No remaining letters!</p>
          )}
          
          <div className="total-count">
            <span className="count-label">Total Remaining Letters:</span>
            <span className="count-value">{gameResult.totalRemainingCount}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderFlamesIntroStep = () => (
    <div className="step-container visible">
      <h3 className="step-title">Step 4: Starting FLAMES Elimination</h3>
      <div className="flames-intro">
        <div className="flames-letters">
          {['F', 'L', 'A', 'M', 'E', 'S'].map((letter) => (
            <div key={letter} className="flame-letter-card">
              <span className="letter">{letter}</span>
              <span className="meaning">
                {letter === 'F' && 'Friends'}
                {letter === 'L' && 'Lovers'}
                {letter === 'A' && 'Affection'}
                {letter === 'M' && 'Marriage'}
                {letter === 'E' && 'Enemies'}
                {letter === 'S' && 'Siblings'}
              </span>
            </div>
          ))}
        </div>
        <p className="elimination-explanation">
          We'll count through FLAMES using <strong>{gameResult.totalRemainingCount}</strong> and eliminate letters until only one remains!
        </p>
      </div>
    </div>
  )

  const renderEliminationStep = (stepIndex) => {
    const step = gameResult.eliminationSteps[stepIndex]
    
    return (
      <div className="step-container visible">
        <h3 className="step-title">
          Elimination Round {stepIndex + 1}
        </h3>
        <div className="elimination-step">
          <div className="flames-sequence">
            <div className="before-elimination">
              <h4>Before:</h4>
              <div className="letters-row">
                {step.beforeElimination.map((letter, index) => (
                  <span 
                    key={`${letter}-${index}`} 
                    className={`flame-letter ${index === step.eliminatedIndex ? 'eliminated' : ''}`}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="elimination-arrow">
              <span className="arrow">↓</span>
              <span className="count-info">Count: {step.count}</span>
              <span className="eliminated-info">Eliminated: {step.eliminatedLetter}</span>
            </div>
            
            <div className="after-elimination">
              <h4>After:</h4>
              <div className="letters-row">
                {step.afterElimination.map((letter, index) => (
                  <span 
                    key={`${letter}-${index}`} 
                    className="flame-letter remaining"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="game-steps">
      {renderStep()}
    </div>
  )
}

export default GameSteps
