// Chess Roguelike - Main Game Logic
// A roguelike chess puzzle game with rule-breaking perks

// ================ SOUND SYSTEM ================
const SoundFX = {
  ctx: null,
  enabled: true,
  
  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio not supported');
      this.enabled = false;
    }
  },
  
  play(type) {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const now = this.ctx.currentTime;
    
    switch(type) {
      case 'move':
        this.playTone(220, 0.08, 'sine', 0.3);
        this.playTone(330, 0.08, 'sine', 0.2, 0.05);
        break;
        
      case 'capture':
        this.playTone(180, 0.1, 'sawtooth', 0.4);
        this.playTone(120, 0.15, 'sawtooth', 0.3, 0.05);
        this.playNoise(0.1, 0.3);
        break;
        
      case 'check':
        this.playTone(440, 0.1, 'square', 0.3);
        this.playTone(550, 0.1, 'square', 0.3, 0.1);
        this.playTone(440, 0.15, 'square', 0.2, 0.2);
        break;
        
      case 'checkmate':
        this.playTone(523, 0.15, 'sine', 0.4);
        this.playTone(659, 0.15, 'sine', 0.4, 0.15);
        this.playTone(784, 0.15, 'sine', 0.4, 0.3);
        this.playTone(1047, 0.3, 'sine', 0.5, 0.45);
        break;
        
      case 'fail':
        this.playTone(300, 0.2, 'sawtooth', 0.4);
        this.playTone(200, 0.3, 'sawtooth', 0.3, 0.15);
        this.playTone(150, 0.4, 'sawtooth', 0.2, 0.35);
        break;
        
      case 'select':
        this.playTone(600, 0.05, 'sine', 0.2);
        break;
        
      case 'deselect':
        this.playTone(400, 0.05, 'sine', 0.15);
        break;
        
      case 'buy':
        this.playTone(400, 0.1, 'sine', 0.3);
        this.playTone(500, 0.1, 'sine', 0.3, 0.08);
        this.playTone(600, 0.1, 'sine', 0.3, 0.16);
        this.playTone(800, 0.15, 'sine', 0.4, 0.24);
        break;
        
      case 'coin':
        this.playTone(1200, 0.05, 'sine', 0.2);
        this.playTone(1600, 0.1, 'sine', 0.3, 0.05);
        break;
        
      case 'click':
        this.playTone(800, 0.03, 'sine', 0.15);
        break;
        
      case 'start':
        this.playTone(330, 0.1, 'sine', 0.3);
        this.playTone(440, 0.1, 'sine', 0.3, 0.1);
        this.playTone(550, 0.1, 'sine', 0.3, 0.2);
        this.playTone(660, 0.2, 'sine', 0.4, 0.3);
        break;
        
      case 'promote':
        this.playTone(523, 0.1, 'sine', 0.3);
        this.playTone(659, 0.1, 'sine', 0.3, 0.1);
        this.playTone(784, 0.1, 'sine', 0.3, 0.2);
        this.playTone(1047, 0.2, 'triangle', 0.5, 0.3);
        break;
        
      case 'undo':
        this.playTone(500, 0.08, 'sine', 0.2);
        this.playTone(400, 0.08, 'sine', 0.2, 0.06);
        break;
        
      case 'enemy':
        this.playTone(150, 0.1, 'triangle', 0.25);
        this.playTone(180, 0.08, 'triangle', 0.2, 0.08);
        break;
        
      case 'combo':
        this.playTone(440, 0.08, 'sine', 0.3);
        this.playTone(554, 0.08, 'sine', 0.3, 0.06);
        this.playTone(659, 0.12, 'sine', 0.4, 0.12);
        break;
        
      case 'bigCapture':
        this.playTone(200, 0.15, 'sawtooth', 0.5);
        this.playTone(100, 0.2, 'sawtooth', 0.4, 0.1);
        this.playNoise(0.15, 0.4);
        this.playTone(300, 0.1, 'square', 0.2, 0.2);
        break;
        
      case 'boss':
        this.playTone(100, 0.3, 'sawtooth', 0.4);
        this.playTone(150, 0.2, 'sawtooth', 0.3, 0.15);
        this.playTone(80, 0.4, 'sawtooth', 0.5, 0.3);
        break;
        
      case 'event':
        this.playTone(523, 0.1, 'sine', 0.3);
        this.playTone(659, 0.1, 'sine', 0.3, 0.1);
        this.playTone(523, 0.1, 'sine', 0.3, 0.2);
        break;
        
      case 'danger':
        this.playTone(200, 0.15, 'square', 0.3);
        this.playTone(180, 0.15, 'square', 0.3, 0.15);
        break;
    }
  },
  
  playTone(freq, duration, type = 'sine', volume = 0.3, delay = 0) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + delay + 0.01);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + delay + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration + 0.01);
  },
  
  playNoise(duration, volume = 0.2) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    
    source.buffer = buffer;
    gain.gain.value = volume;
    
    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
  }
};

// Initialize sound on first user interaction
document.addEventListener('click', () => {
  if (!SoundFX.ctx) SoundFX.init();
}, { once: true });

// ================ VISUAL EFFECTS SYSTEM ================
const VFX = {
  screenShake(intensity = 'normal') {
    const board = document.getElementById('board');
    board.classList.remove('shake', 'shake-big');
    void board.offsetWidth; // Force reflow
    board.classList.add(intensity === 'big' ? 'shake-big' : 'shake');
    setTimeout(() => board.classList.remove('shake', 'shake-big'), 500);
  },
  
  hitPause() {
    const container = document.getElementById('game-container');
    container.classList.add('hit-pause');
    setTimeout(() => container.classList.remove('hit-pause'), 80);
  },
  
  setDanger(active) {
    const vignette = document.getElementById('danger-vignette');
    const board = document.getElementById('board');
    if (active) {
      vignette.classList.add('active');
      board.classList.add('in-danger');
    } else {
      vignette.classList.remove('active');
      board.classList.remove('in-danger');
    }
  },
  
  spawnParticles(x, y, color, count = 10) {
    const container = document.getElementById('particles');
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const distance = 50 + Math.random() * 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      particle.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        background: ${color};
        --tx: ${tx}px;
        --ty: ${ty}px;
        box-shadow: 0 0 10px ${color};
      `;
      container.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  },
  
  floatingText(x, y, text, type = 'capture') {
    const el = document.createElement('div');
    el.className = `floating-text ${type}`;
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  },
  
  updateComboDisplay(combo, multiplier) {
    const display = document.getElementById('combo-display');
    const countEl = document.getElementById('combo-count');
    const multEl = document.getElementById('combo-multiplier');
    
    if (combo > 0) {
      display.classList.add('active');
      countEl.textContent = combo;
      countEl.style.animation = 'none';
      void countEl.offsetWidth;
      countEl.style.animation = 'comboPulse 0.3s ease-out';
      multEl.textContent = `×${multiplier.toFixed(1)}`;
    } else {
      display.classList.remove('active');
    }
  },
  
  animatePieceMove(fromRow, fromCol, toRow, toCol, callback) {
    const board = document.getElementById('board');
    const squareSize = board.offsetWidth / 8;
    const fromIdx = fromRow * 8 + fromCol;
    const toIdx = toRow * 8 + toCol;
    const fromSquare = board.children[fromIdx];
    const toSquare = board.children[toIdx];
    const piece = fromSquare?.querySelector('.piece');
    
    if (!piece || !fromSquare || !toSquare) {
      if (callback) callback();
      return;
    }
    
    const fromRect = fromSquare.getBoundingClientRect();
    const toRect = toSquare.getBoundingClientRect();
    
    const clone = piece.cloneNode(true);
    clone.classList.add('moving');
    clone.style.cssText = `
      position: fixed;
      left: ${fromRect.left + fromRect.width/2}px;
      top: ${fromRect.top + fromRect.height/2}px;
      transform: translate(-50%, -50%);
      font-size: ${piece.offsetHeight * 0.9}px;
      z-index: 1000;
      transition: all 0.2s ease-out;
    `;
    document.body.appendChild(clone);
    piece.style.visibility = 'hidden';
    
    requestAnimationFrame(() => {
      clone.style.left = `${toRect.left + toRect.width/2}px`;
      clone.style.top = `${toRect.top + toRect.height/2}px`;
    });
    
    setTimeout(() => {
      clone.remove();
      if (callback) callback();
    }, 200);
  },
  
  setTheme(stage) {
    const container = document.getElementById('game-container');
    container.classList.remove('theme-forest', 'theme-castle', 'theme-volcano', 'theme-void');
    
    if (stage <= 4) container.classList.add('theme-forest');
    else if (stage <= 8) container.classList.add('theme-castle');
    else if (stage <= 12) container.classList.add('theme-volcano');
    else container.classList.add('theme-void');
  },
  
  // Trail effect for piercing rook
  piercingTrail(fromRow, fromCol, toRow, toCol) {
    const board = document.getElementById('board');
    const squareSize = board.offsetWidth / 8;
    const boardRect = board.getBoundingClientRect();
    
    const dr = toRow > fromRow ? 1 : (toRow < fromRow ? -1 : 0);
    const dc = toCol > fromCol ? 1 : (toCol < fromCol ? -1 : 0);
    
    let r = fromRow, c = fromCol;
    let delay = 0;
    while (r !== toRow || c !== toCol) {
      r += dr; c += dc;
      const x = boardRect.left + (c + 0.5) * squareSize;
      const y = boardRect.top + (r + 0.5) * squareSize;
      setTimeout(() => {
        this.spawnParticles(x, y, '#ff4444', 5);
        this.createTrailMark(x, y, '#ff0000');
      }, delay);
      delay += 50;
    }
  },
  
  // Trail mark effect
  createTrailMark(x, y, color) {
    const el = document.createElement('div');
    el.className = 'trail-mark';
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, ${color} 0%, transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 100;
      animation: trailFade 0.5s ease-out forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 500);
  },
  
  // Teleport effect
  teleportEffect(fromX, fromY, toX, toY) {
    // Disappear particles at origin
    this.spawnParticles(fromX, fromY, '#a855f7', 15);
    // Appear particles at destination
    setTimeout(() => {
      this.spawnParticles(toX, toY, '#a855f7', 15);
      this.createPortalRing(toX, toY);
    }, 100);
  },
  
  // Portal ring effect
  createPortalRing(x, y) {
    const el = document.createElement('div');
    el.className = 'portal-ring';
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 60px;
      height: 60px;
      border: 3px solid #a855f7;
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      z-index: 100;
      animation: portalExpand 0.5s ease-out forwards;
      box-shadow: 0 0 20px #a855f7, inset 0 0 20px rgba(168, 85, 247, 0.3);
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 500);
  },
  
  // Chain lightning effect
  chainLightning(fromX, fromY, targets) {
    targets.forEach((target, i) => {
      setTimeout(() => {
        this.drawLightning(fromX, fromY, target.x, target.y);
        this.spawnParticles(target.x, target.y, '#ffff00', 10);
        fromX = target.x;
        fromY = target.y;
      }, i * 100);
    });
  },
  
  // Draw lightning bolt between two points
  drawLightning(x1, y1, x2, y2) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 150;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    
    // Jagged line
    const segments = 5;
    const dx = (x2 - x1) / segments;
    const dy = (y2 - y1) / segments;
    for (let i = 1; i < segments; i++) {
      const jitterX = (Math.random() - 0.5) * 20;
      const jitterY = (Math.random() - 0.5) * 20;
      ctx.lineTo(x1 + dx * i + jitterX, y1 + dy * i + jitterY);
    }
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    setTimeout(() => canvas.remove(), 200);
  },
  
  // AOE explosion effect
  aoeExplosion(x, y, radius = 80) {
    const el = document.createElement('div');
    el.className = 'aoe-explosion';
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${radius * 2}px;
      height: ${radius * 2}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 0, 255, 0.8) 0%, rgba(255, 0, 255, 0.3) 50%, transparent 70%);
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      z-index: 100;
      animation: aoeExpand 0.4s ease-out forwards;
    `;
    document.body.appendChild(el);
    this.spawnParticles(x, y, '#ff00ff', 20);
    setTimeout(() => el.remove(), 400);
  },
  
  // Fork attack visual
  forkAttack(centerX, centerY, targets) {
    targets.forEach((target, i) => {
      setTimeout(() => {
        this.createSlashMark(centerX, centerY, target.x, target.y);
        this.spawnParticles(target.x, target.y, '#ff4757', 8);
      }, i * 80);
    });
  },
  
  // Slash mark for fork/attacks
  createSlashMark(x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed;
      left: ${x1}px;
      top: ${y1}px;
      width: ${Math.hypot(x2 - x1, y2 - y1)}px;
      height: 4px;
      background: linear-gradient(90deg, transparent, #ff4757, transparent);
      transform-origin: left center;
      transform: rotate(${angle}rad);
      pointer-events: none;
      z-index: 100;
      animation: slashFade 0.3s ease-out forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 300);
  }
};

// ================ ENEMY CHARACTERS ================
const ENEMIES = [
  { name: 'Pawn Pusher', title: 'Novice', avatar: '🤓', aggression: 0.3 },
  { name: 'Knight Rider', title: 'Cavalier', avatar: '🐴', aggression: 0.4 },
  { name: 'Bishop Blessed', title: 'Priest', avatar: '⛪', aggression: 0.5 },
  { name: 'Rook Crusher', title: 'Siege Master', avatar: '🏰', aggression: 0.6 },
  { name: 'Queen Slayer', title: 'Assassin', avatar: '🗡️', aggression: 0.7 },
  { name: 'Grandmaster Gray', title: 'Legend', avatar: '🧙', aggression: 0.8 },
  { name: 'The Shadow King', title: 'Dark Lord', avatar: '👑', aggression: 0.9 },
  { name: 'Magnus the Eternal', title: 'World Champion', avatar: '🏆', aggression: 1.0 },
];

const BOSS_ENEMIES = [
  { name: 'The Twin Towers', title: 'BOSS - Rook Specialist', avatar: '🗼', aggression: 0.8, special: 'Extra Rooks' },
  { name: 'Knight Commander', title: 'BOSS - Knight Master', avatar: '⚔️', aggression: 0.85, special: 'Knights move twice' },
  { name: 'Dark Bishop', title: 'BOSS - Diagonal Death', avatar: '💀', aggression: 0.9, special: 'Bishops pierce' },
  { name: 'The Immortal Queen', title: 'BOSS - Ultimate', avatar: '👸', aggression: 1.0, special: 'Queen respawns once' },
];

function getEnemyForStage(stage) {
  const isBoss = stage % 5 === 0;
  if (isBoss) {
    const bossIdx = Math.floor((stage / 5) - 1) % BOSS_ENEMIES.length;
    return { ...BOSS_ENEMIES[bossIdx], isBoss: true };
  }
  const idx = Math.min(Math.floor((stage - 1) / 2), ENEMIES.length - 1);
  return { ...ENEMIES[idx], isBoss: false };
}

// ================ RANDOM EVENTS ================
const EVENTS = [
  {
    id: 'merchant',
    icon: '🧳',
    title: 'Traveling Merchant',
    description: 'A mysterious merchant appears with a special offer...',
    choices: [
      { text: 'Buy a random perk', effect: '+Random Perk', cost: '-15⭐', action: (gs) => {
        if (gs.gold >= 15) {
          gs.gold -= 15;
          const available = Object.values(PERKS).filter(p => !gs.perks.some(gp => gp.id === p.id));
          if (available.length > 0) {
            const perk = available[Math.floor(Math.random() * available.length)];
            gs.perks.push({ ...perk });
            showMessage(`Got: ${perk.name}!`, 'success');
          }
          return true;
        }
        showMessage('Not enough gold!', 'error');
        return false;
      }},
      { text: 'Decline and leave', effect: 'Nothing happens', cost: '', action: () => true }
    ]
  },
  {
    id: 'blessing',
    icon: '✨',
    title: 'Divine Blessing',
    description: 'A warm light envelops you, offering strength...',
    choices: [
      { text: 'Accept the blessing', effect: '+5⭐', cost: '', action: (gs) => {
        gs.gold += 5;
        SoundFX.play('coin');
        return true;
      }},
      { text: 'Refuse (gain pride)', effect: '+10⭐ next win', cost: '', action: (gs) => {
        gs.nextWinBonus = (gs.nextWinBonus || 0) + 10;
        return true;
      }}
    ]
  },
  {
    id: 'gamble',
    icon: '🎰',
    title: 'The Gambler',
    description: 'A shadowy figure offers you a wager...',
    choices: [
      { text: 'Risk it all!', effect: 'Double or nothing', cost: 'All gold at stake', action: (gs) => {
        if (gs.gold > 0) {
          if (Math.random() > 0.5) {
            gs.gold *= 2;
            showMessage('JACKPOT! Gold doubled!', 'success');
            SoundFX.play('checkmate');
          } else {
            gs.gold = 0;
            showMessage('Lost everything...', 'error');
            SoundFX.play('fail');
          }
        }
        return true;
      }},
      { text: 'Walk away', effect: 'Keep your gold', cost: '', action: () => true }
    ]
  },
  {
    id: 'sacrifice',
    icon: '🔮',
    title: 'The Dark Altar',
    description: 'An ancient altar pulses with power. It demands sacrifice...',
    choices: [
      { text: 'Sacrifice a perk', effect: '+25⭐', cost: 'Lose random perk', action: (gs) => {
        if (gs.perks.length > 0) {
          const idx = Math.floor(Math.random() * gs.perks.length);
          const lost = gs.perks.splice(idx, 1)[0];
          gs.gold += 25;
          showMessage(`Lost ${lost.name}, gained 25⭐!`, 'warning');
          return true;
        }
        showMessage('No perks to sacrifice!', 'error');
        return false;
      }},
      { text: 'Leave this cursed place', effect: 'Nothing happens', cost: '', action: () => true }
    ]
  },
  {
    id: 'training',
    icon: '📚',
    title: 'Chess Master\'s Library',
    description: 'Ancient chess manuscripts offer their wisdom...',
    choices: [
      { text: 'Study the texts', effect: '+1 Undo next game', cost: '', action: (gs) => {
        gs.bonusUndos = (gs.bonusUndos || 0) + 1;
        showMessage('Knowledge gained!', 'success');
        return true;
      }},
      { text: 'Take a rare book', effect: '+8⭐', cost: '', action: (gs) => {
        gs.gold += 8;
        SoundFX.play('coin');
        return true;
      }}
    ]
  }
];

function triggerRandomEvent() {
  const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  showEvent(event);
}

function showEvent(event) {
  SoundFX.play('event');
  document.getElementById('event-icon').textContent = event.icon;
  document.getElementById('event-title').textContent = event.title;
  document.getElementById('event-description').textContent = event.description;
  
  const choicesEl = document.getElementById('event-choices');
  choicesEl.innerHTML = '';
  
  event.choices.forEach(choice => {
    const btn = document.createElement('div');
    btn.className = 'event-choice';
    btn.innerHTML = `
      <div class="event-choice-text">${choice.text}</div>
      ${choice.effect ? `<div class="event-choice-effect">${choice.effect}</div>` : ''}
      ${choice.cost ? `<div class="event-choice-cost">${choice.cost}</div>` : ''}
    `;
    btn.onclick = () => {
      if (choice.action(gameState)) {
        document.getElementById('event-overlay').style.display = 'none';
        updateUI();
        renderPerks();
        openShop();
      }
    };
    choicesEl.appendChild(btn);
  });
  
  document.getElementById('event-overlay').style.display = 'flex';
}

// ================ GAME STATE ================
let gameState = {
  stage: 1,
  gold: 0,
  perks: [],
  puzzlesSolved: 0,
  usedExtraLife: false,
  
  currentPuzzle: null,
  currentEnemy: null,
  board: [],
  movesUsed: 0,
  captureCount: 0,
  comboCount: 0,
  maxCombo: 0,
  hasPromoted: false,
  nextWinBonus: 0,
  bonusUndos: 0,
  
  selectedSquare: null,
  validMoves: [],
  lastMove: null,
  moveHistory: [],
  undosUsed: 0,
  maxUndos: 1,
  perkUses: {},
  
  isPlayerTurn: true,
  puzzleActive: false,
  gameOver: false
};

// ================ UTILITY FUNCTIONS ================
function isPieceColor(piece, color) {
  if (!piece) return false;
  const white = '♔♕♖♗♘♙';
  return color === 'white' ? white.includes(piece) : !white.includes(piece);
}

function getPieceColorFromPiece(piece) {
  if (!piece) return null;
  return '♔♕♖♗♘♙'.includes(piece) ? 'white' : 'black';
}

function getPieceType(piece) {
  if (!piece) return null;
  if (piece === '♔' || piece === '♚') return 'king';
  if (piece === '♕' || piece === '♛') return 'queen';
  if (piece === '♖' || piece === '♜') return 'rook';
  if (piece === '♗' || piece === '♝') return 'bishop';
  if (piece === '♘' || piece === '♞') return 'knight';
  if (piece === '♙' || piece === '♟') return 'pawn';
  return null;
}

function hasPerk(perks, perkId) {
  return perks.some(p => p.id === perkId);
}

function cloneBoard(b) {
  return b.map(row => [...row]);
}

function getPerkUses(perkId) {
  const perk = gameState.perks.find(p => p.id === perkId);
  if (!perk || !perk.uses) return 0;
  return perk.uses - (gameState.perkUses[perkId] || 0);
}

function usePerk(perkId) {
  if (!gameState.perkUses[perkId]) gameState.perkUses[perkId] = 0;
  gameState.perkUses[perkId]++;
}

// ================ ATTACK DETECTION ================
function getAttackSquares(board, row, col) {
  const piece = board[row][col];
  if (!piece) return [];
  
  const attacks = [];
  const type = getPieceType(piece);
  
  const addAttack = (r, c) => {
    if (r >= 0 && r < 8 && c >= 0 && c < 8) attacks.push({ row: r, col: c });
  };
  
  const addSlide = (dr, dc) => {
    for (let i = 1; i < 8; i++) {
      const nr = row + dr * i, nc = col + dc * i;
      if (nr < 0 || nr > 7 || nc < 0 || nc > 7) break;
      attacks.push({ row: nr, col: nc });
      if (board[nr][nc]) break;
    }
  };
  
  if (type === 'pawn') {
    const dir = piece === '♙' ? -1 : 1;
    addAttack(row + dir, col - 1);
    addAttack(row + dir, col + 1);
  } else if (type === 'knight') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => addAttack(row+dr, col+dc));
  } else if (type === 'bishop') {
    [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => addSlide(dr, dc));
  } else if (type === 'rook') {
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => addSlide(dr, dc));
  } else if (type === 'queen') {
    [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => addSlide(dr, dc));
  } else if (type === 'king') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) addAttack(row + dr, col + dc);
      }
    }
  }
  
  return attacks;
}

function isInCheckSimple(board, color) {
  const king = color === 'white' ? '♔' : '♚';
  let kingPos = null;
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === king) { kingPos = { row: r, col: c }; break; }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return true;
  
  const opponent = color === 'white' ? 'black' : 'white';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] && isPieceColor(board[r][c], opponent)) {
        const attacks = getAttackSquares(board, r, c);
        if (attacks.some(a => a.row === kingPos.row && a.col === kingPos.col)) return true;
      }
    }
  }
  return false;
}

// ================ MOVE GENERATION ================
function getMoves(board, row, col, forPlayer = true) {
  const piece = board[row][col];
  if (!piece) return [];
  
  const color = getPieceColorFromPiece(piece);
  const type = getPieceType(piece);
  const moves = [];
  const perks = forPlayer ? gameState.perks : [];
  
  const addMove = (r, c, special = null) => {
    if (r < 0 || r > 7 || c < 0 || c > 7) return false;
    const target = board[r][c];
    if (target && isPieceColor(target, color)) return false;
    if (target === '♔' || target === '♚') return false; // Can't capture kings
    moves.push({ row: r, col: c, special });
    return !target;
  };
  
  const addSlide = (dr, dc, pierce = false) => {
    const captured = [];
    for (let i = 1; i < 8; i++) {
      const nr = row + dr * i, nc = col + dc * i;
      if (nr < 0 || nr > 7 || nc < 0 || nc > 7) break;
      const target = board[nr][nc];
      
      if (target) {
        if (isPieceColor(target, color)) break;
        if (target === '♔' || target === '♚') break;
        moves.push({ row: nr, col: nc, special: pierce ? 'pierce' : null, captured: [...captured, {row: nr, col: nc}] });
        if (pierce) { captured.push({row: nr, col: nc}); continue; }
        break;
      }
      moves.push({ row: nr, col: nc });
    }
  };

  // PAWN
  if (type === 'pawn') {
    const dir = piece === '♙' ? -1 : 1;
    const startRow = piece === '♙' ? 6 : 1;
    const canDouble = row === startRow || hasPerk(perks, 'pawnRush');
    const hasSuperPawn = hasPerk(perks, 'superPawn');
    
    // Forward movement
    if (!board[row + dir]?.[col]) {
      addMove(row + dir, col);
      if (canDouble && !board[row + 2 * dir]?.[col]) addMove(row + 2 * dir, col);
      // Super pawn: move up to 3 squares
      if (hasSuperPawn && !board[row + 3 * dir]?.[col] && row + 3 * dir >= 0 && row + 3 * dir <= 7) {
        addMove(row + 3 * dir, col, 'superPawn');
      }
    }
    
    // Diagonal captures
    [-1, 1].forEach(dc => {
      const nr = row + dir, nc = col + dc;
      const target = board[nr]?.[nc];
      if (nc >= 0 && nc <= 7 && target && !isPieceColor(target, color) && target !== '♔' && target !== '♚') {
        addMove(nr, nc);
      }
    });
    
    // Super pawn: can also capture FORWARD
    if (hasSuperPawn) {
      const forwardTarget = board[row + dir]?.[col];
      if (forwardTarget && !isPieceColor(forwardTarget, color) && forwardTarget !== '♔' && forwardTarget !== '♚') {
        addMove(row + dir, col, 'superPawnCapture');
      }
    }
    
    if (hasPerk(perks, 'pawnSidestep')) {
      if (col > 0 && !board[row][col - 1]) addMove(row, col - 1, 'sidestep');
      if (col < 7 && !board[row][col + 1]) addMove(row, col + 1, 'sidestep');
    }
    if (hasPerk(perks, 'pawnRetreat') && !board[row - dir]?.[col]) {
      addMove(row - dir, col, 'retreat');
    }
    
    // Early promotion check (row 6 for white, row 1 for black) 
    if (hasPerk(perks, 'earlyPromotion')) {
      const promoRow = piece === '♙' ? 1 : 6;
      if (row === promoRow + dir) {
        // Mark moves to promotion row
        moves.forEach(m => { if (m.row === promoRow) m.earlyPromo = true; });
      }
    }
  }
  
  // KNIGHT
  if (type === 'knight') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => addMove(row+dr, col+dc));
    
    if (hasPerk(perks, 'knightTeleport') && getPerkUses('knightTeleport') > 0) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (!board[r][c]) moves.push({ row: r, col: c, special: 'teleport', perkUsed: 'knightTeleport' });
        }
      }
    }
  }
  
  // BISHOP
  if (type === 'bishop') {
    const canPhase = hasPerk(perks, 'ghostBishop');
    if (canPhase) {
      [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc]) => {
        for (let i = 1; i < 8; i++) {
          const nr = row + dr * i, nc = col + dc * i;
          if (nr < 0 || nr > 7 || nc < 0 || nc > 7) break;
          const target = board[nr][nc];
          if (target && isPieceColor(target, color)) continue;
          if (target === '♔' || target === '♚') continue;
          moves.push({ row: nr, col: nc, special: target ? 'phase' : null });
        }
      });
    } else {
      [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc]) => addSlide(dr, dc));
    }
    
    // Holy Bishop: also moves like Knight!
    if (hasPerk(perks, 'bishopKnight')) {
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => addMove(row+dr, col+dc, 'knightMove'));
    }
  }
  
  // ROOK
  if (type === 'rook') {
    const canPierce = hasPerk(perks, 'piercingRook');
    [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr,dc]) => addSlide(dr, dc, canPierce));
  }
  
  // QUEEN
  if (type === 'queen') {
    [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc]) => addSlide(dr, dc));
  }
  
  // KING
  if (type === 'king') {
    // Warrior King: moves like a QUEEN!
    if (hasPerk(perks, 'kingQueen')) {
      [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc]) => addSlide(dr, dc));
    } else {
      // Normal or Commander king
      const range = 1;
      for (let dr = -range; dr <= range; dr++) {
        for (let dc = -range; dc <= range; dc++) {
          if (dr === 0 && dc === 0) continue;
          addMove(row + dr, col + dc);
        }
      }
    }
    
    if (hasPerk(perks, 'kingSwap') && getPerkUses('kingSwap') > 0) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const target = board[r][c];
          if (target && isPieceColor(target, color) && target !== piece) {
            moves.push({ row: r, col: c, special: 'swap', perkUsed: 'kingSwap' });
          }
        }
      }
    }
  }
  
  // Filter moves that leave king in check
  // ROYAL GUARD: King is immune to check!
  if (forPlayer) {
    if (hasPerk(perks, 'royalGuard')) {
      // No need to filter - king can't be checked!
      return moves;
    }
    return moves.filter(move => {
      const testBoard = cloneBoard(board);
      if (move.special === 'swap') {
        const temp = testBoard[move.row][move.col];
        testBoard[move.row][move.col] = testBoard[row][col];
        testBoard[row][col] = temp;
      } else {
        testBoard[move.row][move.col] = piece;
        testBoard[row][col] = null;
      }
      return !isInCheckSimple(testBoard, color);
    });
  }
  
  return moves;
}

// ================ HELPER FUNCTIONS ================
function findKing(board, color) {
  const king = color === 'white' ? '♔' : '♚';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === king) return { row, col };
    }
  }
  return null;
}

// ================ COMBO SYSTEM ================
function getComboMultiplier(combo) {
  if (combo <= 1) return 1.0;
  if (combo === 2) return 1.5;
  if (combo === 3) return 2.0;
  if (combo === 4) return 2.5;
  if (combo >= 5) return 3.0 + (combo - 5) * 0.5;
  return 1.0;
}

// ================ GAME ACTIONS ================
function handleSquareClick(row, col) {
  if (!gameState.puzzleActive || !gameState.isPlayerTurn) return;
  
  const piece = gameState.board[row][col];
  const canMindControl = hasPerk(gameState.perks, 'mindControl') && getPerkUses('mindControl') > 0;
  
  if (gameState.selectedSquare) {
    const move = gameState.validMoves.find(m => m.row === row && m.col === col);
    if (move) {
      // Execute mind control move
      if (gameState.mindControlActive) {
        executeMindControlMove(gameState.selectedSquare.row, gameState.selectedSquare.col, move);
        return;
      }
      executeMove(gameState.selectedSquare.row, gameState.selectedSquare.col, move);
      return;
    }
    
    if (piece && isPieceColor(piece, 'white') && !gameState.mindControlActive) {
      selectPiece(row, col);
      return;
    }
    
    // Can select enemy pieces with Mind Control!
    if (piece && isPieceColor(piece, 'black') && canMindControl && !gameState.mindControlActive) {
      selectEnemyPiece(row, col);
      return;
    }
    
    gameState.selectedSquare = null;
    gameState.validMoves = [];
    gameState.mindControlActive = false;
    SoundFX.play('deselect');
    renderBoard();
    return;
  }
  
  if (piece && isPieceColor(piece, 'white')) {
    selectPiece(row, col);
  } else if (piece && isPieceColor(piece, 'black') && canMindControl) {
    // Mind Control: select enemy piece!
    selectEnemyPiece(row, col);
  }
}

// MIND CONTROL: Select an enemy piece to control!
function selectEnemyPiece(row, col) {
  gameState.selectedSquare = { row, col };
  gameState.mindControlActive = true;
  // Get moves for enemy piece (but they're playing for us!)
  const piece = gameState.board[row][col];
  const moves = getBasicMovesForAI(gameState.board, row, col);
  // Filter to only safe squares (not capturing our pieces, not capturing king)
  gameState.validMoves = moves.filter(m => {
    const target = gameState.board[m.row][m.col];
    if (target && isPieceColor(target, 'white')) return false; // Can't capture our pieces with mind control
    if (target === '♔') return false;
    return true;
  });
  SoundFX.play('select');
  showMessage('🧠 MIND CONTROL! Move this enemy piece!', 'warning');
  renderBoard();
}

function executeMindControlMove(fromRow, fromCol, move) {
  const piece = gameState.board[fromRow][fromCol];
  usePerk('mindControl');
  
  // Execute the move
  const captured = gameState.board[move.row][move.col];
  gameState.board[move.row][move.col] = piece;
  gameState.board[fromRow][fromCol] = null;
  
  if (captured) {
    gameState.captureCount++;
    VFX.screenShake('big');
    SoundFX.play('bigCapture');
    showMessage('🧠 Mind Control: Enemy destroys their own!', 'success');
  } else {
    SoundFX.play('move');
  }
  
  gameState.selectedSquare = null;
  gameState.validMoves = [];
  gameState.mindControlActive = false;
  gameState.movesUsed++;
  
  updateUI();
  renderBoard();
  
  // Check win/lose after mind control
  if (checkPuzzleComplete(gameState)) {
    VFX.screenShake('big');
    setTimeout(() => completePuzzle(false), 600);
    return;
  }
  
  // AI turn
  gameState.isPlayerTurn = false;
  setTimeout(makeAIMove, 500);
}

function selectPiece(row, col) {
  gameState.selectedSquare = { row, col };
  gameState.validMoves = getMoves(gameState.board, row, col, true);
  
  // SNIPER PERK: Can capture ANY enemy piece on the board!
  if (hasPerk(gameState.perks, 'sniper') && getPerkUses('sniper') > 0) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const target = gameState.board[r][c];
        if (target && isPieceColor(target, 'black') && target !== '♚') {
          // Don't add duplicates
          if (!gameState.validMoves.find(m => m.row === r && m.col === c)) {
            gameState.validMoves.push({ row: r, col: c, special: 'sniper', perkUsed: 'sniper' });
          }
        }
      }
    }
  }
  
  SoundFX.play('select');
  renderBoard();
  
  // Add selection animation
  const squares = document.querySelectorAll('.square');
  const idx = row * 8 + col;
  if (squares[idx]) {
    squares[idx].classList.add('just-selected');
    setTimeout(() => squares[idx].classList.remove('just-selected'), 200);
  }
}

function executeMove(fromRow, fromCol, move) {
  const piece = gameState.board[fromRow][fromCol];
  const type = getPieceType(piece);
  const captured = gameState.board[move.row][move.col];
  
  // Save for undo
  gameState.moveHistory.push({
    board: cloneBoard(gameState.board),
    movesUsed: gameState.movesUsed,
    perkUses: { ...gameState.perkUses },
    hasPromoted: gameState.hasPromoted,
    comboCount: gameState.comboCount
  });
  
  if (move.perkUsed) usePerk(move.perkUsed);
  
  // Get screen coordinates for VFX
  const board = document.getElementById('board');
  const squareSize = board.offsetWidth / 8;
  const boardRect = board.getBoundingClientRect();
  const targetX = boardRect.left + (move.col + 0.5) * squareSize;
  const targetY = boardRect.top + (move.row + 0.5) * squareSize;
  
  // Animate piece movement
  VFX.animatePieceMove(fromRow, fromCol, move.row, move.col, () => {});
  
  // Execute move
  let captureThisMove = 0;
  
  if (move.special === 'swap') {
    const target = gameState.board[move.row][move.col];
    gameState.board[move.row][move.col] = piece;
    gameState.board[fromRow][fromCol] = target;
  } else if (move.special === 'sniper') {
    // SNIPER: Ranged kill - piece doesn't move, target is destroyed!
    const target = gameState.board[move.row][move.col];
    gameState.board[move.row][move.col] = null;
    captureThisMove = 1;
    gameState.captureCount++;
    VFX.screenShake('big');
    VFX.spawnParticles(targetX, targetY, '#ff0000', 25);
    VFX.floatingText(targetX, targetY, '🎯 SNIPED!', 'combo');
    SoundFX.play('bigCapture');
    showMessage(`🎯 Sniper kill! ${getPerkUses('sniper')} shots remaining`, 'success');
  } else if (move.special === 'pierce' && move.captured) {
    move.captured.forEach(c => gameState.board[c.row][c.col] = null);
    captureThisMove = move.captured.length;
    gameState.captureCount += captureThisMove;
    gameState.board[move.row][move.col] = piece;
    gameState.board[fromRow][fromCol] = null;
    
    // PIERCING ROOK: Trail effect through all captured pieces!
    VFX.piercingTrail(fromRow, fromCol, move.row, move.col);
    VFX.screenShake('big');
    VFX.hitPause();
    VFX.floatingText(targetX, targetY - 20, `💥 PIERCE x${captureThisMove}!`, 'combo');
    SoundFX.play('bigCapture');
  } else if (move.special === 'teleport') {
    // TELEPORT: Visual effect
    const fromX = boardRect.left + (fromCol + 0.5) * squareSize;
    const fromY = boardRect.top + (fromRow + 0.5) * squareSize;
    VFX.teleportEffect(fromX, fromY, targetX, targetY);
    gameState.board[move.row][move.col] = piece;
    gameState.board[fromRow][fromCol] = null;
    VFX.floatingText(targetX, targetY, '✨ TELEPORT!', 'combo');
    SoundFX.play('promote');
  } else {
    gameState.board[move.row][move.col] = piece;
    gameState.board[fromRow][fromCol] = null;
    
    // Queen's Wrath AOE - EXPLOSION EFFECT!
    if (captured && type === 'queen' && hasPerk(gameState.perks, 'queenWrath')) {
      let aoeCaptures = 0;
      const targets = [];
      [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc]) => {
        const nr = move.row + dr, nc = move.col + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const adj = gameState.board[nr][nc];
          if (adj && isPieceColor(adj, 'black') && adj !== '♚') {
            gameState.board[nr][nc] = null;
            aoeCaptures++;
            targets.push({
              x: boardRect.left + (nc + 0.5) * squareSize,
              y: boardRect.top + (nr + 0.5) * squareSize
            });
          }
        }
      });
      if (aoeCaptures > 0) {
        captureThisMove += aoeCaptures;
        gameState.captureCount += aoeCaptures;
        VFX.aoeExplosion(targetX, targetY, squareSize * 1.5);
        VFX.screenShake('big');
        targets.forEach((t, i) => setTimeout(() => VFX.spawnParticles(t.x, t.y, '#ff00ff', 10), i * 50));
        VFX.floatingText(targetX, targetY - 30, `👑 WRATH! +${aoeCaptures}`, 'combo');
        SoundFX.play('bigCapture');
      }
    }
    
    // Knight Fork Master - SLASH ATTACK EFFECT!
    if (type === 'knight' && hasPerk(gameState.perks, 'knightFork')) {
      let forkCaptures = 0;
      const forkTargets = [];
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => {
        const tr = move.row + dr, tc = move.col + dc;
        if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
          const target = gameState.board[tr][tc];
          if (target && isPieceColor(target, 'black') && target !== '♚') {
            gameState.board[tr][tc] = null;
            forkCaptures++;
            forkTargets.push({
              x: boardRect.left + (tc + 0.5) * squareSize,
              y: boardRect.top + (tr + 0.5) * squareSize
            });
          }
        }
      });
      if (forkCaptures > 0) {
        captureThisMove += forkCaptures;
        gameState.captureCount += forkCaptures;
        VFX.forkAttack(targetX, targetY, forkTargets);
        VFX.screenShake('big');
        VFX.floatingText(targetX, targetY - 30, `⚔️ FORK! +${forkCaptures}`, 'combo');
        SoundFX.play('bigCapture');
      }
    }
    
    // CHAIN LIGHTNING: Visual chain effect!
    if (captured && hasPerk(gameState.perks, 'chainLightning')) {
      let chainKills = 0;
      const chainTargets = [];
      const visited = new Set();
      const queue = [[move.row, move.col]];
      visited.add(`${move.row},${move.col}`);
      
      while (queue.length > 0 && chainKills < 2) { // Max 2 chain kills
        const [cr, cc] = queue.shift();
        [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => {
          const nr = cr + dr, nc = cc + dc;
          const key = `${nr},${nc}`;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && !visited.has(key)) {
            visited.add(key);
            const adj = gameState.board[nr][nc];
            if (adj && isPieceColor(adj, 'black') && adj !== '♚') {
              gameState.board[nr][nc] = null;
              chainKills++;
              chainTargets.push({
                x: boardRect.left + (nc + 0.5) * squareSize,
                y: boardRect.top + (nr + 0.5) * squareSize
              });
              queue.push([nr, nc]);
            }
          }
        });
      }
      if (chainKills > 0) {
        captureThisMove += chainKills;
        gameState.captureCount += chainKills;
        VFX.chainLightning(targetX, targetY, chainTargets);
        VFX.screenShake('big');
        VFX.floatingText(targetX, targetY - 30, `⚡CHAIN! +${chainKills}`, 'combo');
        SoundFX.play('bigCapture');
      }
    }
    
    // EXECUTIONER: Random bonus kill on any capture!
    if (captured && hasPerk(gameState.perks, 'executioner')) {
      const enemies = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = gameState.board[r][c];
          if (p && isPieceColor(p, 'black') && p !== '♚') {
            enemies.push({r, c});
          }
        }
      }
      if (enemies.length > 0) {
        const victim = enemies[Math.floor(Math.random() * enemies.length)];
        gameState.board[victim.r][victim.c] = null;
        captureThisMove++;
        gameState.captureCount++;
        VFX.screenShake('big');
        const victimX = boardRect.left + (victim.c + 0.5) * squareSize;
        const victimY = boardRect.top + (victim.r + 0.5) * squareSize;
        VFX.spawnParticles(victimX, victimY, '#ff0000', 20);
        VFX.floatingText(victimX, victimY, '🪓EXECUTED!', 'combo');
        SoundFX.play('bigCapture');
      }
    }
    
    // VAMPIRIC: Revive a captured piece!
    if (captured && hasPerk(gameState.perks, 'vampiric') && gameState.capturedPieces && gameState.capturedPieces.length > 0) {
      const pieceToRevive = gameState.capturedPieces.pop();
      // Find empty square on back ranks
      let placed = false;
      for (let r = 7; r >= 5 && !placed; r--) {
        for (let c = 0; c < 8 && !placed; c++) {
          if (!gameState.board[r][c]) {
            gameState.board[r][c] = pieceToRevive;
            placed = true;
            VFX.spawnParticles(boardRect.left + (c + 0.5) * squareSize, boardRect.top + (r + 0.5) * squareSize, '#9b59b6', 15);
            VFX.floatingText(boardRect.left + (c + 0.5) * squareSize, boardRect.top + (r + 0.5) * squareSize, '🧛REVIVED!', 'combo');
          }
        }
      }
    }
    
    // Track captured piece for vampiric
    if (captured && captured !== '♚') {
      if (!gameState.capturedPieces) gameState.capturedPieces = [];
      // Convert enemy piece to player piece
      const pieceMap = {'♟':'♙', '♞':'♘', '♝':'♗', '♜':'♖', '♛':'♕'};
      if (pieceMap[captured]) {
        gameState.capturedPieces.push(pieceMap[captured]);
      }
    }
  }
  
  // Handle single capture
  if (captured && captureThisMove === 0) {
    captureThisMove = 1;
    gameState.captureCount++;
  }
  
  // COMBO SYSTEM
  if (captureThisMove > 0) {
    gameState.comboCount += captureThisMove;
    if (gameState.comboCount > gameState.maxCombo) {
      gameState.maxCombo = gameState.comboCount;
    }
    
    const multiplier = getComboMultiplier(gameState.comboCount);
    VFX.updateComboDisplay(gameState.comboCount, multiplier);
    
    // Visual feedback based on combo size
    if (gameState.comboCount >= 5) {
      SoundFX.play('bigCapture');
      VFX.screenShake('big');
      VFX.floatingText(targetX, targetY - 50, `${gameState.comboCount}x COMBO!`, 'combo');
    } else if (gameState.comboCount >= 3) {
      SoundFX.play('combo');
      VFX.screenShake();
    } else {
      SoundFX.play('capture');
      VFX.screenShake();
    }
    
    VFX.hitPause();
    VFX.spawnParticles(targetX, targetY, captureThisMove > 1 ? '#ff9f43' : '#ff4757', 8 + captureThisMove * 4);
    VFX.floatingText(targetX, targetY, `+${captureThisMove}`, 'capture');
  } else {
    // Reset combo on non-capture move
    if (gameState.comboCount > 0) {
      VFX.updateComboDisplay(0, 1);
    }
    gameState.comboCount = 0;
    SoundFX.play('move');
  }
  
  // Pawn promotion (normal or early promotion perk)
  const canEarlyPromote = hasPerk(gameState.perks, 'earlyPromotion') && move.row <= 1;
  if (piece === '♙' && (move.row === 0 || canEarlyPromote)) {
    gameState.board[move.row][move.col] = '♕';
    gameState.hasPromoted = true;
    SoundFX.play('promote');
    VFX.screenShake('big');
    VFX.spawnParticles(targetX, targetY, '#ffd700', 30);
    if (canEarlyPromote && move.row > 0) {
      showMessage('⬆️ EARLY PROMOTION! 👑', 'success');
    } else {
      showMessage('Pawn promoted to Queen! 👑', 'success');
    }
  }
  
  gameState.movesUsed++;
  gameState.lastMove = { fromRow, fromCol, toRow: move.row, toCol: move.col, isPlayer: true };
  gameState.selectedSquare = null;
  gameState.validMoves = [];
  
  updateUI();
  renderBoard();
  
  // Check if player King is in danger
  const playerInDanger = isInCheckSimple(gameState.board, 'white');
  VFX.setDanger(playerInDanger);
  
  // Play check sound if enemy king is in check
  if (isInCheckSimple(gameState.board, 'black')) {
    SoundFX.play('check');
    showMessage('CHECK! ♚', 'warning');
  }
  
  // Check win conditions
  if (checkPuzzleComplete(gameState)) {
    VFX.screenShake('big');
    setTimeout(() => completePuzzle(false), 600);
    return;
  }
  
  // Check stalemate (enemy has no legal moves but not in check)
  const stalemateResult = checkStalemate(gameState);
  if (stalemateResult === 'black') {
    setTimeout(() => completePuzzle(true), 600);
    return;
  }
  
  if (checkPuzzleFailed(gameState)) {
    setTimeout(() => failPuzzle(), 600);
    return;
  }
  
  // Double jump
  if (type === 'knight' && hasPerk(gameState.perks, 'doubleJump') && !gameState.usedDoubleJump) {
    gameState.usedDoubleJump = true;
    showMessage('Knight can move again! 🐴', 'info');
    selectPiece(move.row, move.col);
    return;
  }
  
  // TIME STOP: Take extra turns!
  if (gameState.extraTurns > 0) {
    gameState.extraTurns--;
    gameState.usedDoubleJump = false;
    showMessage(`⏱️ TIME STOP! ${gameState.extraTurns + 1} extra turns remaining!`, 'success');
    return; // Player gets another turn
  }
  
  // AI turn
  gameState.isPlayerTurn = false;
  gameState.usedDoubleJump = false;
  updateTurnIndicator();
  setTimeout(() => makeAIMove(), 600);
}

// Activate Time Stop perk
function activateTimeStop() {
  if (!hasPerk(gameState.perks, 'timeStop') || getPerkUses('timeStop') <= 0) {
    showMessage('Time Stop not available!', 'error');
    return;
  }
  usePerk('timeStop');
  gameState.extraTurns = 2; // Will give 3 total turns (current + 2 extra)
  SoundFX.play('bigCapture');
  VFX.screenShake('big');
  showMessage('⏱️ TIME STOP ACTIVATED! Take 3 turns in a row!', 'success');
}

// ================ AI ================
function makeAIMove() {
  if (!gameState.puzzleActive) return;
  
  // Check if AI is checkmated (player wins)
  if (isCheckmateOrStalemate(gameState.board, 'black')) {
    if (isInCheckSimple(gameState.board, 'black')) {
      // Checkmate - player wins!
      completePuzzle(false);
      return;
    } else {
      // Stalemate - player advances but loses gold
      completePuzzle(true);
      return;
    }
  }
  
  // Get all legal AI moves
  const allMoves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = gameState.board[r][c];
      if (piece && isPieceColor(piece, 'black')) {
        const rawMoves = getBasicMovesForAI(gameState.board, r, c);
        rawMoves.forEach(move => {
          const testBoard = cloneBoard(gameState.board);
          testBoard[move.row][move.col] = piece;
          testBoard[r][c] = null;
          if (!isInCheckSimple(testBoard, 'black')) {
            allMoves.push({ fromRow: r, fromCol: c, ...move, piece });
          }
        });
      }
    }
  }
  
  if (allMoves.length === 0) {
    gameState.isPlayerTurn = true;
    updateTurnIndicator();
    return;
  }
  
  // Score moves based on enemy aggression
  const aggression = gameState.currentEnemy?.aggression || 0.5;
  const scored = allMoves.map(m => {
    // Base randomness (lower with higher aggression = more predictable/optimal play)
    let score = Math.random() * (4 - aggression * 3);
    
    const target = gameState.board[m.row][m.col];
    if (target && target !== '♔') {
      const values = { '♙': 1, '♘': 3, '♗': 3, '♖': 5, '♕': 9 };
      // Higher aggression = more likely to take high-value pieces
      score += (values[target] || 0) * (8 + aggression * 5);
    }
    
    const testBoard = cloneBoard(gameState.board);
    testBoard[m.row][m.col] = m.piece;
    testBoard[m.fromRow][m.fromCol] = null;
    
    // Higher aggression = more likely to give check
    if (isInCheckSimple(testBoard, 'white')) {
      score += 10 + aggression * 10;
    }
    
    // Bonus for center control (stronger enemies value this more)
    if (aggression > 0.5) {
      const centerDist = Math.abs(m.row - 3.5) + Math.abs(m.col - 3.5);
      score += (7 - centerDist) * aggression;
    }
    
    // Boss-specific: More aggressive towards player king
    if (gameState.currentEnemy?.isBoss) {
      const playerKing = findKing(testBoard, 'white');
      if (playerKing) {
        const kingDist = Math.abs(m.row - playerKing.row) + Math.abs(m.col - playerKing.col);
        score += (14 - kingDist) * 0.5;
      }
    }
    
    return { ...m, score };
  });
  
  scored.sort((a, b) => b.score - a.score);
  
  // Higher aggression = more likely to pick the best move
  // Lower aggression = might pick second or third best
  let choiceIdx = 0;
  if (aggression < 0.7 && scored.length > 1 && Math.random() > aggression) {
    choiceIdx = Math.floor(Math.random() * Math.min(3, scored.length));
  }
  const chosen = scored[choiceIdx];
  
  // Execute
  const captured = gameState.board[chosen.row][chosen.col];
  gameState.board[chosen.row][chosen.col] = chosen.piece;
  gameState.board[chosen.fromRow][chosen.fromCol] = null;
  
  // Get screen coords for VFX
  const board = document.getElementById('board');
  const boardRect = board.getBoundingClientRect();
  const squareSize = board.offsetWidth / 8;
  const targetX = boardRect.left + (chosen.col + 0.5) * squareSize;
  const targetY = boardRect.top + (chosen.row + 0.5) * squareSize;
  
  if (chosen.piece === '♟' && chosen.row === 7) {
    gameState.board[chosen.row][chosen.col] = '♛';
    VFX.spawnParticles(targetX, targetY, '#ff4757', 20);
  }
  
  gameState.lastMove = { fromRow: chosen.fromRow, fromCol: chosen.fromCol, toRow: chosen.row, toCol: chosen.col, isPlayer: false };
  
  // Reset player combo on enemy turn
  if (gameState.comboCount > 0) {
    VFX.updateComboDisplay(0, 1);
    gameState.comboCount = 0;
  }
  
  // Play AI move sound and VFX
  if (captured) {
    SoundFX.play('capture');
    VFX.screenShake();
    VFX.spawnParticles(targetX, targetY, '#ff4757', 12);
    VFX.floatingText(targetX, targetY, '-1', 'capture');
    
    // RESURRECTION PERK: Track captured piece for respawn
    if (hasPerk(gameState.perks, 'resurrection') && captured !== '♔') {
      if (!gameState.turnsUntilRespawn) gameState.turnsUntilRespawn = {};
      gameState.turnsUntilRespawn[captured] = 2; // Respawn in 2 turns
      showMessage(`💀 ${captured} will resurrect in 2 turns!`, 'info');
    }
  } else {
    SoundFX.play('enemy');
  }
  
  renderBoard();
  
  // Check player state
  const playerInCheck = isInCheckSimple(gameState.board, 'white');
  VFX.setDanger(playerInCheck);
  
  if (isCheckmateOrStalemate(gameState.board, 'white')) {
    if (playerInCheck) {
      SoundFX.play('danger');
      VFX.screenShake('big');
      showMessage('💀 CHECKMATE! You lose.', 'error');
      setTimeout(() => failPuzzle(), 1000);
      return;
    } else {
      showMessage('Stalemate!', 'error');
      setTimeout(() => failPuzzle(), 1000);
      return;
    }
  }
  
  if (playerInCheck) {
    SoundFX.play('danger');
    VFX.screenShake();
    showMessage('⚠️ CHECK!', 'warning');
  }
  
  gameState.isPlayerTurn = true;
  updateTurnIndicator();
  
  // RESURRECTION PERK: Respawn captured pieces after 2 enemy turns
  if (hasPerk(gameState.perks, 'resurrection') && gameState.turnsUntilRespawn) {
    const toRespawn = [];
    for (const [piece, turns] of Object.entries(gameState.turnsUntilRespawn)) {
      gameState.turnsUntilRespawn[piece] = turns - 1;
      if (gameState.turnsUntilRespawn[piece] <= 0) {
        toRespawn.push(piece);
        delete gameState.turnsUntilRespawn[piece];
      }
    }
    
    // Respawn pieces on back ranks
    toRespawn.forEach(piece => {
      for (let r = 7; r >= 5; r--) {
        for (let c = 0; c < 8; c++) {
          if (!gameState.board[r][c]) {
            gameState.board[r][c] = piece;
            const board = document.getElementById('board');
            const squareSize = board.offsetWidth / 8;
            const boardRect = board.getBoundingClientRect();
            VFX.spawnParticles(boardRect.left + (c + 0.5) * squareSize, boardRect.top + (r + 0.5) * squareSize, '#00ff88', 20);
            showMessage(`💀 ${piece} RESURRECTED!`, 'success');
            renderBoard();
            return;
          }
        }
      }
    });
  }
  
  if (checkPuzzleFailed(gameState)) {
    setTimeout(() => failPuzzle(), 500);
  }
}

function getBasicMovesForAI(board, row, col) {
  const piece = board[row][col];
  if (!piece) return [];
  
  const color = '♔♕♖♗♘♙'.includes(piece) ? 'white' : 'black';
  const moves = [];
  
  const addMove = (r, c) => {
    if (r < 0 || r > 7 || c < 0 || c > 7) return false;
    const target = board[r][c];
    if (target && isPieceColor(target, color)) return false;
    if (target === '♔' || target === '♚') return false;
    moves.push({ row: r, col: c });
    return !target;
  };
  
  if (piece === '♟') {
    if (row < 7 && !board[row+1][col]) {
      moves.push({ row: row+1, col });
      if (row === 1 && !board[row+2][col]) moves.push({ row: row+2, col });
    }
    if (row < 7 && col > 0 && board[row+1][col-1] && isPieceColor(board[row+1][col-1], 'white') && board[row+1][col-1] !== '♔') {
      moves.push({ row: row+1, col: col-1 });
    }
    if (row < 7 && col < 7 && board[row+1][col+1] && isPieceColor(board[row+1][col+1], 'white') && board[row+1][col+1] !== '♔') {
      moves.push({ row: row+1, col: col+1 });
    }
  }
  
  if (piece === '♞') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => addMove(row+dr, col+dc));
  }
  
  if (piece === '♝') {
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc]) => {
      for (let i = 1; i < 8; i++) if (!addMove(row+dr*i, col+dc*i)) break;
    });
  }
  
  if (piece === '♜') {
    [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr,dc]) => {
      for (let i = 1; i < 8; i++) if (!addMove(row+dr*i, col+dc*i)) break;
    });
  }
  
  if (piece === '♛') {
    [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc]) => {
      for (let i = 1; i < 8; i++) if (!addMove(row+dr*i, col+dc*i)) break;
    });
  }
  
  if (piece === '♚') {
    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc]) => addMove(row+dr, col+dc));
  }
  
  return moves;
}

function isCheckmateOrStalemate(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && isPieceColor(piece, color)) {
        const moves = color === 'white' ? getMoves(board, r, c, true) : getBasicMovesForAI(board, r, c);
        for (const move of moves) {
          const testBoard = cloneBoard(board);
          testBoard[move.row][move.col] = piece;
          testBoard[r][c] = null;
          if (!isInCheckSimple(testBoard, color)) return false;
        }
      }
    }
  }
  return true;
}

// ================ GAME FLOW ================
function startPuzzle() {
  const puzzle = getPuzzleForStage(gameState.stage);
  const enemy = getEnemyForStage(gameState.stage);
  
  gameState.currentPuzzle = puzzle;
  gameState.currentEnemy = enemy;
  gameState.board = puzzle.board.map(row => [...row]);
  gameState.movesUsed = 0;
  gameState.captureCount = 0;
  gameState.comboCount = 0;
  gameState.maxCombo = 0;
  gameState.hasPromoted = false;
  gameState.selectedSquare = null;
  gameState.validMoves = [];
  gameState.lastMove = null;
  gameState.moveHistory = [];
  gameState.undosUsed = 0;
  gameState.perkUses = {};
  gameState.isPlayerTurn = true;
  gameState.puzzleActive = true;
  gameState.usedDoubleJump = false;
  gameState.capturedPieces = []; // For resurrection/vampiric
  gameState.turnsUntilRespawn = {}; // For resurrection tracking
  gameState.extraTurns = 0; // For time stop
  
  // ===== APPLY GAME-CHANGING PERKS =====
  
  // Queen Army: Replace all pawns with queens!
  if (hasPerk(gameState.perks, 'queenArmy')) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (gameState.board[r][c] === '♙') {
          gameState.board[r][c] = '♕';
        }
      }
    }
    showMessage('👸 ARMY OF QUEENS ACTIVATED!', 'success');
  }
  
  // Clone Army: Add 2 extra knights
  if (hasPerk(gameState.perks, 'cloneArmy')) {
    // Find empty squares on back ranks for knights
    const emptySquares = [];
    for (let c = 0; c < 8; c++) {
      if (!gameState.board[7][c]) emptySquares.push([7, c]);
      if (!gameState.board[6][c]) emptySquares.push([6, c]);
    }
    for (let i = 0; i < Math.min(2, emptySquares.length); i++) {
      const [r, c] = emptySquares[i];
      gameState.board[r][c] = '♘';
    }
    showMessage('👥 Clone Knights deployed!', 'success');
  }
  
  // Validate
  if (isInCheckSimple(gameState.board, 'white') || isInCheckSimple(gameState.board, 'black')) {
    console.warn('Invalid puzzle, getting fallback');
    setTimeout(() => startPuzzle(), 100);
    return;
  }
  
  // Perks & bonus undos from events
  const undoBonus = gameState.perks.filter(p => p.effect === 'extraUndo').reduce((sum, p) => sum + (p.value || 1), 0);
  gameState.maxUndos = 1 + undoBonus + (gameState.bonusUndos || 0);
  gameState.bonusUndos = 0; // Reset bonus
  
  // Apply visual theme
  VFX.setTheme(gameState.stage);
  VFX.setDanger(false);
  VFX.updateComboDisplay(0, 1);
  
  // Show/hide boss indicator
  const bossIndicator = document.getElementById('boss-indicator');
  if (enemy.isBoss) {
    bossIndicator.style.display = 'block';
    SoundFX.play('boss');
    VFX.screenShake('big');
  } else {
    bossIndicator.style.display = 'none';
  }
  
  // Update enemy display
  const enemyDisplay = document.getElementById('enemy-display');
  enemyDisplay.style.display = 'flex';
  document.getElementById('enemy-avatar').textContent = enemy.avatar;
  document.getElementById('enemy-name').textContent = enemy.name;
  document.getElementById('enemy-title').textContent = enemy.isBoss ? `⚔️ ${enemy.title}` : enemy.title;
  
  updateUI();
  updateTurnIndicator();
  renderBoard();
  renderPerks();
  
  const stageMsg = enemy.isBoss ? `⚔️ BOSS: ${enemy.name}!` : `VS ${enemy.name}`;
  showMessage(stageMsg, enemy.isBoss ? 'error' : 'info');
  const hintsEl = document.getElementById('hints-text');
  if (hintsEl) hintsEl.textContent = puzzle.hint || '';
  document.getElementById('undo-move').disabled = true;
}

function completePuzzle(isStalemate = false) {
  gameState.puzzleActive = false;
  gameState.puzzlesSolved++;
  VFX.setDanger(false);
  VFX.updateComboDisplay(0, 1);
  
  if (isStalemate) {
    // Stalemate: advance but lose all gold
    SoundFX.play('undo');
    gameState.gold = 0;
    document.getElementById('reward-amount').textContent = `Gold reset to 0 ⭐`;
    document.getElementById('complete-title').textContent = '⚖️ STALEMATE!';
    document.getElementById('complete-overlay').style.display = 'flex';
  } else {
    // Checkmate win: earn reward
    let baseReward = gameState.currentPuzzle.reward;
    let reward = baseReward;
    let bonusText = [];
    
    // Boss bonus
    if (gameState.currentEnemy?.isBoss) {
      const bossBonus = Math.floor(baseReward * 0.5);
      reward += bossBonus;
      bonusText.push(`+${bossBonus} Boss Defeated!`);
    }
    
    // Combo bonus (max combo * 2)
    if (gameState.maxCombo >= 3) {
      const comboBonus = gameState.maxCombo * 2;
      reward += comboBonus;
      bonusText.push(`+${comboBonus} (${gameState.maxCombo}x Combo)`);
    }
    
    // Event bonus
    if (gameState.nextWinBonus > 0) {
      reward += gameState.nextWinBonus;
      bonusText.push(`+${gameState.nextWinBonus} Pride Bonus`);
      gameState.nextWinBonus = 0;
    }
    
    // Base bonus reward perk
    const bonusReward = gameState.perks.filter(p => p.effect === 'bonusReward').reduce((sum, p) => sum + (p.value || 0), 0);
    if (bonusReward > 0) {
      reward += bonusReward;
      bonusText.push(`+${bonusReward} Star Collector`);
    }
    
    // Capture bonus perk
    const captureBonus = gameState.perks.filter(p => p.effect === 'captureBonus').reduce((sum, p) => sum + (p.value || 0), 0);
    if (captureBonus > 0 && gameState.captureCount > 0) {
      const captureReward = captureBonus * gameState.captureCount;
      reward += captureReward;
      bonusText.push(`+${captureReward} (${gameState.captureCount} captures)`);
    }
    
    // Speed bonus perk (now requires under 10 moves!)
    const speedBonus = gameState.perks.filter(p => p.effect === 'speedBonus').reduce((sum, p) => sum + (p.value || 0), 0);
    if (speedBonus > 0 && gameState.movesUsed <= 10) {
      reward += speedBonus;
      bonusText.push(`+${speedBonus} Speed Demon! (${gameState.movesUsed} moves)`);
    }
    
    // Double Combo perk: multiply combo bonuses!
    if (hasPerk(gameState.perks, 'comboMaster') && gameState.maxCombo >= 2) {
      const doubleComboBonus = gameState.maxCombo * 2;
      reward += doubleComboBonus;
      bonusText.push(`+${doubleComboBonus} Combo Master!`);
    }
    
    // Scavenger bonus (always active)
    const scavengerPerk = gameState.perks.find(p => p.effect === 'scavenge');
    if (scavengerPerk && gameState.captureCount > 0) {
      const scavengeBonus = scavengerPerk.value * gameState.captureCount;
      reward += scavengeBonus;
      bonusText.push(`+${scavengeBonus} Scavenger`);
    }
    
    // Perfect win bonus (no pieces lost)
    const startingPieces = 16; // Rough estimate
    const currentPieces = countPlayerPieces(gameState.board);
    if (currentPieces >= 8) { // Kept most pieces
      const perfectBonus = 5;
      reward += perfectBonus;
      bonusText.push(`+${perfectBonus} Flawless!`);
    }
    
    gameState.gold += reward;
    
    SoundFX.play('checkmate');
    VFX.screenShake('big');
    
    const isBoss = gameState.currentEnemy?.isBoss;
    let rewardDisplay = `+${reward} ⭐`;
    if (bonusText.length > 0) {
      rewardDisplay += `<br><small style="display:block;margin-top:8px;line-height:1.6">${bonusText.join('<br>')}</small>`;
    }
    document.getElementById('reward-amount').innerHTML = rewardDisplay;
    document.getElementById('complete-title').textContent = isBoss ? '👑 BOSS DEFEATED!' : '♚ CHECKMATE!';
    document.getElementById('complete-overlay').style.display = 'flex';
    
    confetti();
  }
}

function countPlayerPieces(board) {
  let count = 0;
  const whitePieces = '♔♕♖♗♘♙';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] && whitePieces.includes(board[r][c])) count++;
    }
  }
  return count;
}

function failPuzzle() {
  gameState.puzzleActive = false;
  
  if (hasPerk(gameState.perks, 'secondChance') && !gameState.usedExtraLife) {
    gameState.usedExtraLife = true;
    gameState.perks = gameState.perks.filter(p => p.id !== 'secondChance');
    SoundFX.play('coin');
    showMessage('💖 Second Chance saved you!', 'success');
    setTimeout(() => startPuzzle(), 1200);
    return;
  }
  
  SoundFX.play('fail');
  gameState.gameOver = true;
  document.getElementById('final-stage').textContent = gameState.stage;
  document.getElementById('final-puzzles').textContent = gameState.puzzlesSolved;
  document.getElementById('final-perks').textContent = gameState.perks.length;
  document.getElementById('gameover-overlay').style.display = 'flex';
}

function continueAfterPuzzle() {
  SoundFX.play('coin');
  document.getElementById('complete-overlay').style.display = 'none';
  gameState.stage++;
  
  // Trigger random event 40% of the time (not on boss kills or first few stages)
  if (gameState.stage > 2 && Math.random() < 0.4 && (gameState.stage - 1) % 5 !== 0) {
    triggerRandomEvent();
  } else {
    openShop();
  }
}

// ================ SHOP ================
function openShop() {
  document.getElementById('shop-gold').textContent = gameState.gold;
  
  const shopPerks = getShopPerks(gameState.perks.map(p => p.id), 3);
  const container = document.getElementById('shop-items');
  container.innerHTML = '';
  
  shopPerks.forEach((perk, i) => {
    const item = document.createElement('div');
    item.className = `shop-item ${perk.rarity}`;
    item.style.animationDelay = `${i * 0.1}s`;
    item.innerHTML = `
      <div class="perk-icon">${perk.icon}</div>
      <div class="perk-name">${perk.name}</div>
      <div class="perk-desc">${perk.description}</div>
      <div class="perk-price">${perk.price} ⭐</div>
    `;
    item.onclick = () => buyPerk(perk, item);
    container.appendChild(item);
  });
  
  document.getElementById('shop-overlay').style.display = 'flex';
}

function buyPerk(perk, element) {
  if (gameState.gold < perk.price || element.classList.contains('sold')) return;
  
  SoundFX.play('buy');
  gameState.gold -= perk.price;
  gameState.perks.push({ ...perk });
  element.classList.add('sold');
  element.innerHTML += '<div class="sold-badge">OWNED</div>';
  
  // INSTANT GOLD PERK: Gives gold immediately!
  if (perk.effect === 'instantGold') {
    gameState.gold += perk.value;
    VFX.spawnParticles(window.innerWidth / 2, window.innerHeight / 2, '#ffd700', 30);
    showMessage(`+${perk.value}⭐ INSTANT GOLD!`, 'success');
  }
  
  document.getElementById('shop-gold').textContent = gameState.gold;
  renderPerks();
  
  showMessage(`Acquired: ${perk.name}!`, 'success');
}

function rerollShop() {
  if (gameState.gold < 5) {
    showMessage('Not enough stars!', 'error');
    return;
  }
  SoundFX.play('coin');
  gameState.gold -= 5;
  openShop();
}

function closeShop() {
  SoundFX.play('click');
  document.getElementById('shop-overlay').style.display = 'none';
  startPuzzle();
}

// ================ UNDO ================
function undoMove() {
  if (gameState.moveHistory.length === 0 || gameState.undosUsed >= gameState.maxUndos) return;
  
  SoundFX.play('undo');
  const prev = gameState.moveHistory.pop();
  gameState.board = prev.board;
  gameState.movesUsed = prev.movesUsed;
  gameState.perkUses = prev.perkUses;
  gameState.hasPromoted = prev.hasPromoted;
  gameState.comboCount = prev.comboCount || 0;
  gameState.undosUsed++;
  
  gameState.selectedSquare = null;
  gameState.validMoves = [];
  gameState.lastMove = null;
  gameState.isPlayerTurn = true;
  
  // Update VFX
  VFX.updateComboDisplay(gameState.comboCount, getComboMultiplier(gameState.comboCount));
  VFX.setDanger(isInCheckSimple(gameState.board, 'white'));
  
  updateUI();
  updateTurnIndicator();
  renderBoard();
  showMessage('Move undone!', 'info');
}

function skipTurn() {
  if (!gameState.puzzleActive || !gameState.isPlayerTurn) return;
  
  gameState.movesUsed++;
  gameState.selectedSquare = null;
  gameState.validMoves = [];
  updateUI();
  
  if (checkPuzzleFailed(gameState)) {
    setTimeout(() => failPuzzle(), 500);
    return;
  }
  
  gameState.isPlayerTurn = false;
  updateTurnIndicator();
  setTimeout(() => makeAIMove(), 500);
}

// ================ NEW RUN ================
function startNewRun() {
  SoundFX.init();
  SoundFX.play('start');
  
  gameState = {
    stage: 1,
    gold: 0,
    perks: [],
    puzzlesSolved: 0,
    usedExtraLife: false,
    currentPuzzle: null,
    currentEnemy: null,
    board: [],
    movesUsed: 0,
    captureCount: 0,
    comboCount: 0,
    maxCombo: 0,
    hasPromoted: false,
    nextWinBonus: 0,
    bonusUndos: 0,
    selectedSquare: null,
    validMoves: [],
    lastMove: null,
    moveHistory: [],
    undosUsed: 0,
    maxUndos: 1,
    perkUses: {},
    isPlayerTurn: true,
    puzzleActive: false,
    gameOver: false,
    usedDoubleJump: false
  };
  
  // Reset VFX
  VFX.setDanger(false);
  VFX.updateComboDisplay(0, 1);
  
  document.getElementById('start-overlay').style.display = 'none';
  document.getElementById('gameover-overlay').style.display = 'none';
  document.getElementById('shop-overlay').style.display = 'none';
  document.getElementById('event-overlay').style.display = 'none';
  document.getElementById('complete-overlay').style.display = 'none';
  
  renderPerks();
  startPuzzle();
}

// ================ RENDERING ================
function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  
  // Apply board-wide perk effects
  boardEl.classList.remove('perk-queen-army', 'perk-mind-control', 'perk-time-stop', 'perk-resurrection', 'perk-legendary');
  if (hasPerk(gameState.perks, 'queenArmy')) boardEl.classList.add('perk-queen-army');
  if (hasPerk(gameState.perks, 'mindControl')) boardEl.classList.add('perk-mind-control');
  if (hasPerk(gameState.perks, 'timeStop')) boardEl.classList.add('perk-time-stop');
  if (hasPerk(gameState.perks, 'resurrection')) boardEl.classList.add('perk-resurrection');
  if (gameState.perks.some(p => p.rarity === 'legendary')) boardEl.classList.add('perk-legendary');
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      const isLight = (row + col) % 2 === 0;
      square.className = `square ${isLight ? 'light' : 'dark'}`;
      
      if (gameState.selectedSquare?.row === row && gameState.selectedSquare?.col === col) {
        square.classList.add('selected');
      }
      
      if (gameState.lastMove) {
        if ((gameState.lastMove.fromRow === row && gameState.lastMove.fromCol === col) ||
            (gameState.lastMove.toRow === row && gameState.lastMove.toCol === col)) {
          square.classList.add('last-move');
          if (!gameState.lastMove.isPlayer) square.classList.add('enemy-move');
        }
      }
      
      // Check for special move types
      const validMove = gameState.validMoves.find(m => m.row === row && m.col === col);
      if (validMove) {
        square.classList.add('valid-move');
        if (gameState.board[row][col]) square.classList.add('has-piece');
        
        // Special move indicators
        if (validMove.special === 'sniper') {
          square.classList.add('sniper-target');
        }
        if (validMove.special === 'teleport') {
          square.classList.add('teleport-target');
        }
        if (validMove.special === 'pierce') {
          square.classList.add('pierce-path');
        }
      }
      
      const piece = gameState.board[row]?.[col];
      if (piece) {
        const pieceEl = document.createElement('span');
        const pieceColor = getPieceColorFromPiece(piece);
        pieceEl.className = `piece ${pieceColor}`;
        pieceEl.textContent = piece;
        
        // Add perk visual effects to pieces
        const perkEffects = getPiecePerks(piece, row, col);
        if (perkEffects.length > 0) {
          pieceEl.classList.add('has-perk');
          perkEffects.forEach(effect => pieceEl.classList.add(`perk-${effect}`));
          
          // Add perk badge
          const badge = document.createElement('div');
          badge.className = 'perk-badge';
          badge.innerHTML = perkEffects.map(e => getPerkBadgeIcon(e)).join('');
          square.appendChild(badge);
        }
        
        // Mind control indicator for enemy pieces
        if (pieceColor === 'black' && hasPerk(gameState.perks, 'mindControl') && getPerkUses('mindControl') > 0) {
          square.classList.add('mind-controllable');
        }
        
        square.appendChild(pieceEl);
      }
      
      square.onclick = () => handleSquareClick(row, col);
      boardEl.appendChild(square);
    }
  }
}

// Get active perks for a specific piece
function getPiecePerks(piece, row, col) {
  const type = getPieceType(piece);
  const color = getPieceColorFromPiece(piece);
  const perks = gameState.perks;
  const effects = [];
  
  // Only show effects for player pieces
  if (color !== 'white') return effects;
  
  if (type === 'knight') {
    if (hasPerk(perks, 'doubleJump')) effects.push('double-jump');
    if (hasPerk(perks, 'knightFork')) effects.push('fork');
    if (hasPerk(perks, 'knightTeleport') && getPerkUses('knightTeleport') > 0) effects.push('teleport');
  }
  
  if (type === 'rook') {
    if (hasPerk(perks, 'piercingRook')) effects.push('piercing');
    if (hasPerk(perks, 'fortifiedRook')) effects.push('invincible');
    if (hasPerk(perks, 'rookCharge')) effects.push('ram');
  }
  
  if (type === 'bishop') {
    if (hasPerk(perks, 'ghostBishop')) effects.push('ghost');
    if (hasPerk(perks, 'holyBishop')) effects.push('hybrid');
  }
  
  if (type === 'queen') {
    if (hasPerk(perks, 'queenWrath')) effects.push('wrath');
  }
  
  if (type === 'pawn') {
    if (hasPerk(perks, 'pawnStorm')) effects.push('storm');
    if (hasPerk(perks, 'pawnRush')) effects.push('rush');
  }
  
  if (type === 'king') {
    if (hasPerk(perks, 'royalGuard')) effects.push('immune');
    if (hasPerk(perks, 'kingCommander')) effects.push('commander');
  }
  
  return effects;
}

// Get badge icon for perk effect
function getPerkBadgeIcon(effect) {
  const icons = {
    'double-jump': '🐴',
    'fork': '⚔️',
    'teleport': '✨',
    'piercing': '💥',
    'invincible': '🛡️',
    'ram': '🐏',
    'ghost': '👻',
    'hybrid': '💫',
    'wrath': '👑',
    'storm': '🌊',
    'rush': '🏃',
    'immune': '🛡️',
    'commander': '⚔️'
  };
  return `<span class="badge-icon">${icons[effect] || '✨'}</span>`;
}

function renderPerks() {
  const container = document.getElementById('perks-container');
  const abilities = document.getElementById('abilities-container');
  
  if (gameState.perks.length === 0) {
    container.innerHTML = '<div class="no-perks">No perks yet</div>';
    abilities.innerHTML = '<div class="no-abilities">Complete games to unlock perks!</div>';
    return;
  }
  
  container.innerHTML = '';
  abilities.innerHTML = '';
  
  // Activatable perks (Time Stop, Mind Control)
  const activatablePerks = ['timeStop', 'mindControl'];
  
  gameState.perks.forEach(perk => {
    const perkEl = document.createElement('div');
    perkEl.className = `perk-item ${perk.rarity}`;
    perkEl.innerHTML = `<span class="perk-icon">${perk.icon}</span> ${perk.name}`;
    perkEl.title = perk.description;
    container.appendChild(perkEl);
    
    const abilityEl = document.createElement('div');
    let usesText = '';
    let remaining = 0;
    if (perk.uses) {
      remaining = perk.uses - (gameState.perkUses[perk.id] || 0);
      usesText = `<span class="uses">${remaining}/${perk.uses}</span>`;
    }
    
    // Check if this perk is activatable
    const isActivatable = activatablePerks.includes(perk.id);
    const canActivate = remaining > 0 && gameState.puzzleActive && gameState.isPlayerTurn;
    
    abilityEl.className = `ability-item ${perk.rarity} ${isActivatable && canActivate ? 'activatable' : ''} ${remaining === 0 ? 'depleted' : ''}`;
    
    abilityEl.innerHTML = `
      <div class="ability-header">
        <span class="ability-icon">${perk.icon}</span>
        <span class="ability-name">${perk.name}</span>
        ${usesText}
      </div>
      <div class="ability-desc">${perk.description}</div>
      ${isActivatable && canActivate ? '<button class="activate-btn">ACTIVATE</button>' : ''}
    `;
    
    // Add click handler for activatable perks
    if (isActivatable && canActivate) {
      const btn = abilityEl.querySelector('.activate-btn');
      if (btn) {
        btn.onclick = () => {
          if (perk.id === 'timeStop') activateTimeStop();
          if (perk.id === 'mindControl') {
            showMessage('🧠 Mind Control ready! Click an enemy piece to control it!', 'info');
          }
          renderPerks();
        };
      }
    }
    
    abilities.appendChild(abilityEl);
  });
}

function updateUI() {
  document.getElementById('stage-number').textContent = gameState.stage;
  document.getElementById('gold').textContent = gameState.gold;

  if (gameState.currentPuzzle) {
    document.getElementById('objective-text').textContent = gameState.currentPuzzle.description;
    document.getElementById('objective-progress').textContent = getProgressText(gameState);

    // Show move count (no limit in full game mode)
    document.getElementById('moves-left').textContent = gameState.movesUsed;
    document.getElementById('moves-left').className = 'moves-value';
  }

  const canUndo = gameState.moveHistory.length > 0 && gameState.undosUsed < gameState.maxUndos;
  document.getElementById('undo-move').disabled = !canUndo;

  // Update mobile info bar
  const mobileStage = document.getElementById('mobile-stage');
  const mobileGold = document.getElementById('mobile-gold');
  const mobileMoves = document.getElementById('mobile-moves');
  if (mobileStage) mobileStage.textContent = gameState.stage;
  if (mobileGold) mobileGold.textContent = gameState.gold;
  if (mobileMoves) mobileMoves.textContent = gameState.movesUsed;

  // Update active perks display
  renderActivePerks();

  // Update special mode indicator
  updateSpecialMode();
}

// Render active perks below the board
function renderActivePerks() {
  const container = document.getElementById('active-perks-display');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (gameState.perks.length === 0) return;
  
  // Show key active perks with piece-affecting abilities
  const displayPerks = gameState.perks.filter(p => {
    const effects = ['doubleTurn', 'captureAllThreats', 'teleportOnce', 'pierceCapture', 'invincible', 
                     'phaseThrough', 'bishopKnight', 'aoeCapture', 'superPawn', 'royalGuard', 'kingQueen',
                     'chainCapture', 'bonusKill', 'pawnsToQueens', 'extraKnights', 'respawnPieces'];
    return effects.includes(p.effect);
  });
  
  displayPerks.slice(0, 5).forEach(perk => {
    const badge = document.createElement('div');
    badge.className = `active-perk-badge ${perk.rarity}`;
    badge.innerHTML = `
      <span class="perk-badge-icon">${perk.icon}</span>
      <span class="perk-badge-name">${perk.name}</span>
    `;
    badge.title = perk.description;
    container.appendChild(badge);
  });
  
  if (displayPerks.length > 5) {
    const more = document.createElement('div');
    more.className = 'active-perk-badge';
    more.textContent = `+${displayPerks.length - 5} more`;
    container.appendChild(more);
  }
}

// Update special mode indicator (Time Stop, Mind Control active)
function updateSpecialMode() {
  const modeEl = document.getElementById('special-mode');
  const iconEl = document.getElementById('special-mode-icon');
  const textEl = document.getElementById('special-mode-text');
  
  if (!modeEl) return;
  
  // Check for active special modes
  if (gameState.extraTurns > 0) {
    modeEl.style.display = 'flex';
    modeEl.className = 'special-mode time-stop';
    iconEl.textContent = '⏱️';
    textEl.textContent = `TIME STOP - ${gameState.extraTurns + 1} TURNS LEFT`;
  } else if (gameState.mindControlActive) {
    modeEl.style.display = 'flex';
    modeEl.className = 'special-mode mind-control';
    iconEl.textContent = '🧠';
    textEl.textContent = 'MIND CONTROL - Click enemy piece to move!';
  } else {
    modeEl.style.display = 'none';
  }
}

function updateTurnIndicator() {
  document.getElementById('player-turn').classList.toggle('active', gameState.isPlayerTurn);
  document.getElementById('enemy-turn').classList.toggle('active', !gameState.isPlayerTurn);
}

function showMessage(text, type = 'info') {
  const el = document.getElementById('game-message');
  el.textContent = text;
  el.className = `game-message ${type}`;
  
  // Animate
  el.style.animation = 'none';
  el.offsetHeight; // Reflow
  el.style.animation = 'messagePopIn 0.3s ease';
}

// Simple confetti for celebrations
function confetti() {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);
  
  const colors = ['#f0b429', '#3fb950', '#58a6ff', '#a371f7', '#f85149'];
  for (let i = 0; i < 50; i++) {
    const conf = document.createElement('div');
    conf.style.cssText = `
      position:absolute;
      width:10px;height:10px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${Math.random()*100}%;
      top:-20px;
      animation:confettiFall ${1.5+Math.random()}s linear forwards;
      animation-delay:${Math.random()*0.5}s;
      transform:rotate(${Math.random()*360}deg);
    `;
    container.appendChild(conf);
  }
  
  setTimeout(() => container.remove(), 3000);
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
  @keyframes confettiFall {
    to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  @keyframes messagePopIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  .game-message.success { color: #3fb950; }
  .game-message.error { color: #f85149; }
  .game-message.warning { color: #f0b429; }
  .game-message.info { color: #58a6ff; }
  .just-selected { animation: selectPulse 0.2s ease; }
  @keyframes selectPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .shop-item { animation: shopItemIn 0.3s ease backwards; }
  @keyframes shopItemIn {
    from { opacity: 0; transform: translateY(20px); }
  }
  .sold-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #3fb950;
    color: #0d1117;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.9rem;
  }
`;
document.head.appendChild(style);

// ================ EVENT LISTENERS ================
document.getElementById('start-game').onclick = startNewRun;
document.getElementById('new-run').onclick = startNewRun;
document.getElementById('continue-btn').onclick = continueAfterPuzzle;
document.getElementById('skip-shop').onclick = closeShop;
document.getElementById('reroll-shop').onclick = rerollShop;
document.getElementById('undo-move').onclick = undoMove;

document.getElementById('toggle-sound').onclick = toggleSound;

function toggleSound() {
  SoundFX.enabled = !SoundFX.enabled;
  const btn = document.getElementById('toggle-sound');
  if (SoundFX.enabled) {
    btn.textContent = '🔊';
    btn.classList.remove('muted');
    SoundFX.play('click');
  } else {
    btn.textContent = '🔇';
    btn.classList.add('muted');
  }
}

// ================ MOBILE PANEL TOGGLE (OVERLAY) ================
(function initMobileToggles() {
  const toggleBar = document.getElementById('mobile-toggle-bar');
  const backdrop = document.getElementById('mobile-panel-backdrop');
  if (!toggleBar) return;

  function closeAllPanels() {
    document.getElementById('left-panel').classList.remove('mobile-visible');
    document.getElementById('right-panel').classList.remove('mobile-visible');
    const infoBtn = document.getElementById('toggle-info-btn');
    if (infoBtn) infoBtn.classList.remove('active');
    document.getElementById('toggle-abilities-btn').classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
  }

  toggleBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.mobile-toggle-btn');
    if (!btn) return;

    const panelId = btn.dataset.panel;
    const panel = document.getElementById(panelId === 'left' ? 'left-panel' : 'right-panel');
    const isVisible = panel.classList.contains('mobile-visible');

    // Close everything first
    closeAllPanels();

    // If it wasn't visible, open it
    if (!isVisible) {
      panel.classList.add('mobile-visible');
      btn.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
    }
  });

  // Tap backdrop to close panels
  if (backdrop) {
    backdrop.addEventListener('click', closeAllPanels);
  }
})();

// ================ MOBILE: PREVENT ZOOM & SCROLL ================
(function initMobileLockdown() {
  // Prevent pinch-to-zoom via gesture events (Safari)
  document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('gestureend', function(e) {
    e.preventDefault();
  }, { passive: false });

  // Prevent zoom via multi-touch on touchmove
  document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // Prevent double-tap zoom by intercepting rapid taps
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
})();

// Initialize
renderBoard();
