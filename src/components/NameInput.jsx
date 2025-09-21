import { useState } from 'react'
import './NameInput.css'

function NameInput({ name1, name2, errors, onNameChange, onPlayGame }) {
  const [localName1, setLocalName1] = useState(name1)
  const [localName2, setLocalName2] = useState(name2)

  const handleName1Change = (e) => {
    const value = e.target.value
    setLocalName1(value)
    onNameChange(value, localName2)
  }

  const handleName2Change = (e) => {
    const value = e.target.value
    setLocalName2(value)
    onNameChange(localName1, value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onPlayGame()
  }

  return (
    <div className="name-input-container">
      <div className="input-card">
        <h2 className="input-title">Enter Your Names</h2>
        <form onSubmit={handleSubmit} className="name-form">
          <div className="input-group">
            <label htmlFor="name1" className="input-label">
              First Person's Name
            </label>
            <input
              id="name1"
              type="text"
              value={localName1}
              onChange={handleName1Change}
              className="name-input"
              placeholder="Enter first name..."
              autoComplete="off"
            />
          </div>

          <div className="heart-divider">
            <span className="heart">💖</span>
          </div>

          <div className="input-group">
            <label htmlFor="name2" className="input-label">
              Second Person's Name
            </label>
            <input
              id="name2"
              type="text"
              value={localName2}
              onChange={handleName2Change}
              className="name-input"
              placeholder="Enter second name..."
              autoComplete="off"
            />
          </div>

          {errors.length > 0 && (
            <div className="error-container">
              {errors.map((error, index) => (
                <p key={index} className="error-message">
                  {error}
                </p>
              ))}
            </div>
          )}

          <button 
            type="submit" 
            className="play-button"
            disabled={!localName1.trim() || !localName2.trim()}
          >
            <span className="button-text">Discover Your Destiny</span>
            <span className="button-sparkles">✨</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default NameInput
