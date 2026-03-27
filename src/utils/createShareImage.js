const FLAMES_COLORS = {
  F: '#4CAF50',
  L: '#E91E63',
  A: '#FF9800',
  M: '#9C27B0',
  E: '#F44336',
  S: '#2196F3',
  '💫': null, // handled separately as gradient
}

const FLAMES_EMOJIS = {
  F: '👫',
  L: '💕',
  A: '🥰',
  M: '💒',
  E: '😤',
  S: '👪',
  '💫': '💫',
}

/**
 * Draws rounded rectangle path on a canvas context.
 */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/**
 * Wraps text to fit within maxWidth, returns array of lines.
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

/**
 * Creates a PNG Blob of a FLAMES result share card.
 * @param {object} result - the game result object
 * @returns {Promise<Blob>}
 */
export async function createShareImage(result) {
  const W = 640
  const H = 760
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const letter = result.finalLetter
  const isSoulmates = result.isSpecialSoulmates
  const accentColor = isSoulmates ? '#FF69B4' : (FLAMES_COLORS[letter] || '#667eea')
  const emoji = FLAMES_EMOJIS[letter] || '✨'

  // ── Background gradient ──────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H)
  if (isSoulmates) {
    bg.addColorStop(0, '#1a0533')
    bg.addColorStop(0.5, '#2d0a4e')
    bg.addColorStop(1, '#0a1a3a')
  } else {
    bg.addColorStop(0, '#0f0c29')
    bg.addColorStop(0.5, '#302b63')
    bg.addColorStop(1, '#24243e')
  }
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Subtle star-like dots
  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  for (let i = 0; i < 60; i++) {
    const sx = (Math.sin(i * 137.5) * 0.5 + 0.5) * W
    const sy = (Math.cos(i * 97.3) * 0.5 + 0.5) * H
    const sr = Math.abs(Math.sin(i * 53.7)) * 2 + 0.5
    ctx.beginPath()
    ctx.arc(sx, sy, sr, 0, Math.PI * 2)
    ctx.fill()
  }

  // ── Card ────────────────────────────────────────────────────────────────
  const cardX = 32
  const cardY = 32
  const cardW = W - 64
  const cardH = H - 64
  ctx.save()
  roundRect(ctx, cardX, cardY, cardW, cardH, 24)
  ctx.fillStyle = 'rgba(255,255,255,0.96)'
  ctx.fill()
  ctx.restore()

  // Card top accent stripe
  const stripeGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY)
  if (isSoulmates) {
    stripeGrad.addColorStop(0, '#FFD700')
    stripeGrad.addColorStop(0.5, '#FF69B4')
    stripeGrad.addColorStop(1, '#00CED1')
  } else {
    stripeGrad.addColorStop(0, '#667eea')
    stripeGrad.addColorStop(1, '#764ba2')
  }
  ctx.save()
  roundRect(ctx, cardX, cardY, cardW, 8, 4)
  ctx.fillStyle = stripeGrad
  ctx.fill()
  ctx.restore()

  // ── App title ────────────────────────────────────────────────────────────
  const flamesLetters = ['F', 'L', 'A', 'M', 'E', 'S']
  const flamesColors = { F: '#4CAF50', L: '#E91E63', A: '#FF9800', M: '#9C27B0', E: '#F44336', S: '#2196F3' }
  ctx.font = 'bold 42px system-ui, -apple-system, sans-serif'
  const titleLetterW = 42
  const totalW = flamesLetters.length * titleLetterW
  let tx = W / 2 - totalW / 2
  const ty = cardY + 56
  flamesLetters.forEach(l => {
    ctx.fillStyle = isSoulmates ? '#FFD700' : (flamesColors[l] || '#667eea')
    ctx.fillText(l, tx, ty)
    tx += titleLetterW
  })

  // ── Names ────────────────────────────────────────────────────────────────
  ctx.textAlign = 'center'
  ctx.font = '600 22px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#555'
  const namesText = `${result.originalNames.name1} & ${result.originalNames.name2}`
  ctx.fillText(namesText, W / 2, cardY + 100)

  // ── Result circle ────────────────────────────────────────────────────────
  const cx = W / 2
  const cy = cardY + 240
  const radius = 80

  // Circle background
  if (isSoulmates) {
    const circleGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
    circleGrad.addColorStop(0, '#FFD700')
    circleGrad.addColorStop(0.5, '#FF69B4')
    circleGrad.addColorStop(1, '#00CED1')
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fillStyle = circleGrad
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fillStyle = accentColor
    ctx.fill()
  }

  // Glow ring
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2)
  ctx.strokeStyle = isSoulmates ? 'rgba(255,215,0,0.4)' : `${accentColor}55`
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.restore()

  // Emoji inside circle
  ctx.font = '52px Apple Color Emoji, Segoe UI Emoji, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, cx, cy - 16)

  // Letter inside circle
  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.3)'
  ctx.shadowBlur = 4
  ctx.fillText(letter, cx, cy + 40)
  ctx.shadowBlur = 0

  // ── Result title ─────────────────────────────────────────────────────────
  ctx.textBaseline = 'alphabetic'
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#333'
  ctx.fillText(result.result, W / 2, cardY + 370)

  // ── Description ──────────────────────────────────────────────────────────
  ctx.font = '18px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#666'
  const descLines = wrapText(ctx, getDescription(letter), cardW - 80)
  descLines.slice(0, 3).forEach((line, i) => {
    ctx.fillText(line, W / 2, cardY + 410 + i * 28)
  })

  // ── Stats row ─────────────────────────────────────────────────────────────
  if (!isSoulmates) {
    const statsY = cardY + 540
    const stats = [
      { label: 'Letters', value: String(result.normalizedNames.name1.length + result.normalizedNames.name2.length) },
      { label: 'Crossed', value: String(result.crossOutResult.crossedOutLetters.length) },
      { label: 'Remaining', value: String(result.totalRemainingCount) },
    ]
    const statW = cardW / stats.length
    stats.forEach((stat, i) => {
      const sx = cardX + i * statW + statW / 2
      // Pill background
      ctx.save()
      roundRect(ctx, cardX + i * statW + 20, statsY - 28, statW - 40, 60, 12)
      ctx.fillStyle = 'rgba(102,126,234,0.1)'
      ctx.fill()
      ctx.restore()
      ctx.textAlign = 'center'
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#667eea'
      ctx.fillText(stat.value, sx, statsY + 8)
      ctx.font = '14px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#888'
      ctx.fillText(stat.label, sx, statsY + 28)
    })
  } else {
    // Soulmates special row
    const statsY = cardY + 560
    ctx.font = '16px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#FF69B4'
    ctx.fillText('✨ Written in the stars ✨', W / 2, statsY)
  }

  // ── Footer brand ─────────────────────────────────────────────────────────
  const footerY = cardY + cardH - 24
  ctx.font = '500 15px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#aaa'
  ctx.fillText('🔥 flames.jheels.in', W / 2, footerY)

  // ── Return blob ───────────────────────────────────────────────────────────
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/png')
  })
}

function getDescription(letter) {
  switch (letter) {
    case 'F': return 'Destined to be the best of friends! Your bond is built on trust, laughter, and mutual understanding.'
    case 'L': return 'Love is in the air! You two have a romantic connection that could bloom into something beautiful.'
    case 'A': return "There's a special affection between you two. You care deeply for each other in a warm, tender way."
    case 'M': return 'Wedding bells might be in your future! You two are perfectly matched for a lifelong partnership.'
    case 'E': return 'There might be some tension between you two. Sometimes opposites attract in unexpected ways!'
    case 'S': return "You two have a sibling-like bond! You'll always be there for each other through thick and thin."
    case '💫': return 'The universe has spoken! Connected by something far beyond ordinary relationships — true soulmates.'
    default: return 'Your relationship is unique and special in its own way!'
  }
}
