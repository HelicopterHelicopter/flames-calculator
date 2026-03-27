import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { playFlamesGame, validateNames } from './flamesLogic'
import NameInput from './components/NameInput'
import GameSteps from './components/GameSteps'
import ResultDisplay from './components/ResultDisplay'
import GlitchScreen from './components/GlitchScreen'
import './App.css'

function App() {
  const [gameState, setGameState] = useState({
    name1: '',
    name2: '',
    gameResult: null,
    currentStep: 0,
    isPlaying: false,
    errors: [],
    showGlitch: false
  });

  const handleNameChange = (name1, name2) => {
    setGameState(prev => ({
      ...prev,
      name1,
      name2,
      errors: []
    }));
  };

  const handlePlayGame = () => {
    const validation = validateNames(gameState.name1, gameState.name2);
    
    if (!validation.isValid) {
      setGameState(prev => ({
        ...prev,
        errors: validation.errors
      }));
      return;
    }

    try {
      const result = playFlamesGame(gameState.name1, gameState.name2);
      
      // Always start with normal game flow, even for special soulmates
      setGameState(prev => ({
        ...prev,
        gameResult: result,
        currentStep: 0,
        isPlaying: true,
        errors: []
      }));
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        errors: [error.message]
      }));
    }
  };

  const handleReset = () => {
    setGameState({
      name1: '',
      name2: '',
      gameResult: null,
      currentStep: 0,
      isPlaying: false,
      errors: [],
      showGlitch: false
    });
  };

  const handleGlitchComplete = () => {
    setGameState(prev => ({
      ...prev,
      showGlitch: false,
      currentStep: 999 // Skip to result display
    }));
  };

  const handleStepComplete = () => {
    if (gameState.gameResult && gameState.currentStep < getTotalSteps(gameState.gameResult)) {
      const nextStep = gameState.currentStep + 1;
      const totalSteps = getTotalSteps(gameState.gameResult);
      
      // Check if this is a special soulmates case and we've reached the final step
      if (gameState.gameResult.isSpecialSoulmates && nextStep >= totalSteps) {
        // Trigger glitch screen instead of showing result
        setGameState(prev => ({
          ...prev,
          showGlitch: true
        }));
      } else {
        // Normal step progression
        setGameState(prev => ({
          ...prev,
          currentStep: nextStep
        }));
      }
    }
  };

  const getTotalSteps = (result) => {
    if (!result) return 0;
    // For special soulmates, we still show the normal steps but use fake elimination steps
    if (result.isSpecialSoulmates) {
      // Show 4 base steps + some fake elimination rounds for the effect
      return 4 + 3; // Fake 3 elimination rounds for dramatic effect
    }
    // Normal case: Steps: 1. Names, 2. Common Letters, 3. Remaining Count, 4. FLAMES Elimination, 5. Result
    return 4 + (result.eliminationSteps ? result.eliminationSteps.length : 0);
  };

  return (
    <div className="app">
      {gameState.showGlitch && (
        <GlitchScreen onGlitchComplete={handleGlitchComplete} />
      )}
      
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">
            <span className="flame-letter">F</span>
            <span className="flame-letter">L</span>
            <span className="flame-letter">A</span>
            <span className="flame-letter">M</span>
            <span className="flame-letter">E</span>
            <span className="flame-letter">S</span>
          </h1>
          <p className="app-subtitle">Discover Your Relationship Destiny</p>
        </header>

        <main className="app-main">
          {!gameState.isPlaying ? (
            <NameInput
              name1={gameState.name1}
              name2={gameState.name2}
              errors={gameState.errors}
              onNameChange={handleNameChange}
              onPlayGame={handlePlayGame}
            />
          ) : (
            <div className="game-container">
              {gameState.currentStep < getTotalSteps(gameState.gameResult) ? (
                <GameSteps
                  gameResult={gameState.gameResult}
                  currentStep={gameState.currentStep}
                  onStepComplete={handleStepComplete}
                />
              ) : (
                <ResultDisplay
                  result={gameState.gameResult}
                  onReset={handleReset}
                />
              )}
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>Enter two names and discover what the universe has in store for your relationship!</p>
        </footer>
      </div>
      <Analytics />
    </div>
  )
}

export default App