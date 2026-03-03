// Perks - GAME-CHANGING abilities that fundamentally alter chess
// These are NOT subtle - they should feel POWERFUL

const PERKS = {
  // ============== LEGENDARY PERKS (Game-Breaking) ==============
  
  queenArmy: {
    id: 'queenArmy',
    name: 'Army of Queens',
    icon: '👸',
    description: 'ALL your pawns are replaced with QUEENS at game start',
    price: 50,
    rarity: 'legendary',
    pieceType: 'global',
    effect: 'pawnsToQueens'
  },
  
  mindControl: {
    id: 'mindControl',
    name: 'Mind Control',
    icon: '🧠',
    description: 'Once per game, move ANY enemy piece as if it were yours',
    price: 45,
    rarity: 'legendary',
    pieceType: 'global',
    effect: 'controlEnemy',
    uses: 1
  },
  
  timeStop: {
    id: 'timeStop',
    name: 'Time Stop',
    icon: '⏱️',
    description: 'Take 3 TURNS IN A ROW once per game',
    price: 40,
    rarity: 'legendary',
    pieceType: 'global',
    effect: 'tripleTurn',
    uses: 1
  },
  
  resurrection: {
    id: 'resurrection',
    name: 'Resurrection',
    icon: '💀',
    description: 'Your captured pieces RESPAWN after 2 enemy turns',
    price: 45,
    rarity: 'legendary',
    pieceType: 'global',
    effect: 'respawnPieces'
  },

  // ============== EPIC PERKS (Very Powerful) ==============
  
  queenWrath: {
    id: 'queenWrath',
    name: "Queen's Wrath",
    icon: '👑',
    description: 'Queen captures DESTROY ALL adjacent enemies (3x3 explosion)',
    price: 30,
    rarity: 'epic',
    pieceType: 'queen',
    effect: 'aoeCapture'
  },
  
  knightFork: {
    id: 'knightFork',
    name: 'Fork Master',
    icon: '⚔️',
    description: 'Knights INSTANTLY CAPTURE ALL pieces they threaten when landing',
    price: 25,
    rarity: 'epic',
    pieceType: 'knight',
    effect: 'captureAllThreats'
  },
  
  piercingRook: {
    id: 'piercingRook',
    name: 'Death Ray Rook',
    icon: '💥',
    description: 'Rooks capture EVERYTHING in their path - no stopping!',
    price: 28,
    rarity: 'epic',
    pieceType: 'rook',
    effect: 'pierceCapture'
  },
  
  executioner: {
    id: 'executioner',
    name: 'Executioner',
    icon: '🪓',
    description: 'ANY capture also destroys a RANDOM enemy piece',
    price: 30,
    rarity: 'epic',
    pieceType: 'global',
    effect: 'bonusKill'
  },
  
  cloneArmy: {
    id: 'cloneArmy',
    name: 'Clone Army',
    icon: '👥',
    description: 'Start each game with 2 EXTRA KNIGHTS',
    price: 25,
    rarity: 'epic',
    pieceType: 'global',
    effect: 'extraKnights'
  },
  
  vampiric: {
    id: 'vampiric',
    name: 'Vampiric',
    icon: '🧛',
    description: 'Capturing a piece REVIVES one of your captured pieces',
    price: 28,
    rarity: 'epic',
    pieceType: 'global',
    effect: 'vampiricCapture'
  },
  
  secondChance: {
    id: 'secondChance',
    name: 'Phoenix',
    icon: '🔥',
    description: 'Survive being CHECKMATED once - escape and continue!',
    price: 25,
    rarity: 'epic',
    pieceType: 'global',
    effect: 'extraLife',
    uses: 1
  },

  // ============== RARE PERKS (Strong) ==============
  
  doubleJump: {
    id: 'doubleJump',
    name: 'Double Jump',
    icon: '🐴',
    description: 'Knights move TWICE per turn - two L-shapes!',
    price: 18,
    rarity: 'rare',
    pieceType: 'knight',
    effect: 'doubleTurn'
  },
  
  ghostBishop: {
    id: 'ghostBishop',
    name: 'Ghost Bishop',
    icon: '👻',
    description: 'Bishops PHASE THROUGH all pieces - nothing blocks them!',
    price: 18,
    rarity: 'rare',
    pieceType: 'bishop',
    effect: 'phaseThrough'
  },
  
  fortifiedRook: {
    id: 'fortifiedRook',
    name: 'Invincible Tower',
    icon: '🏰',
    description: 'Rooks CANNOT BE CAPTURED - they are immortal!',
    price: 22,
    rarity: 'rare',
    pieceType: 'rook',
    effect: 'invincible'
  },
  
  pawnStorm: {
    id: 'pawnStorm',
    name: 'Pawn Storm',
    icon: '🌊',
    description: 'Pawns can move UP TO 3 SQUARES forward and capture forward too!',
    price: 15,
    rarity: 'rare',
    pieceType: 'pawn',
    effect: 'superPawn'
  },
  
  royalGuard: {
    id: 'royalGuard',
    name: 'Royal Guard',
    icon: '🛡️',
    description: 'Your King CANNOT BE PUT IN CHECK (immune to check!)',
    price: 20,
    rarity: 'rare',
    pieceType: 'king',
    effect: 'checkImmune'
  },
  
  kingCommander: {
    id: 'kingCommander',
    name: 'Warrior King',
    icon: '⚔️',
    description: 'King moves like a QUEEN - full power!',
    price: 22,
    rarity: 'rare',
    pieceType: 'king',
    effect: 'kingQueen'
  },
  
  chainLightning: {
    id: 'chainLightning',
    name: 'Chain Lightning',
    icon: '⚡',
    description: 'Captures CHAIN to adjacent enemies (up to 3 total kills)',
    price: 20,
    rarity: 'rare',
    pieceType: 'global',
    effect: 'chainCapture'
  },
  
  sniper: {
    id: 'sniper',
    name: 'Sniper',
    icon: '🎯',
    description: 'Once per turn, any piece can capture ANY enemy on the board',
    price: 25,
    rarity: 'rare',
    pieceType: 'global',
    effect: 'rangedKill',
    uses: 3
  },
  
  materialBonus: {
    id: 'materialBonus',
    name: 'Blood Money',
    icon: '💰',
    description: '+5⭐ for EACH piece you capture (huge gold boost!)',
    price: 18,
    rarity: 'rare',
    pieceType: 'global',
    effect: 'captureBonus',
    value: 5
  },

  // ============== UNCOMMON PERKS (Solid) ==============
  
  knightTeleport: {
    id: 'knightTeleport',
    name: 'Blink Strike',
    icon: '✨',
    description: 'Knights can TELEPORT to ANY square (2 uses per game)',
    price: 14,
    rarity: 'uncommon',
    pieceType: 'knight',
    effect: 'teleportOnce',
    uses: 2
  },
  
  holyBishop: {
    id: 'holyBishop',
    name: 'Holy Bishop',
    icon: '💫',
    description: 'Bishops can ALSO move like Knights - hybrid piece!',
    price: 15,
    rarity: 'uncommon',
    pieceType: 'bishop',
    effect: 'bishopKnight'
  },
  
  rookCharge: {
    id: 'rookCharge',
    name: 'Battering Ram',
    icon: '🐏',
    description: 'Rooks PUSH pieces they hit - shove enemies into corners!',
    price: 12,
    rarity: 'uncommon',
    pieceType: 'rook',
    effect: 'pushBack'
  },
  
  promotionAny: {
    id: 'promotionAny',
    name: 'Super Promotion',
    icon: '⬆️',
    description: 'Pawns can promote on ROW 6 (two rows early!)',
    price: 14,
    rarity: 'uncommon',
    pieceType: 'pawn',
    effect: 'earlyPromotion'
  },
  
  kingSwap: {
    id: 'kingSwap',
    name: 'Royal Escape',
    icon: '🔄',
    description: 'King can SWAP places with any friendly piece (3 uses)',
    price: 12,
    rarity: 'uncommon',
    pieceType: 'king',
    effect: 'swapOnce',
    uses: 3
  },
  
  comboMaster: {
    id: 'comboMaster',
    name: 'Combo Master',
    icon: '🔥',
    description: 'Combo multiplier is DOUBLED - insane bonus gold!',
    price: 15,
    rarity: 'uncommon',
    pieceType: 'global',
    effect: 'doubleCombo'
  },
  
  speedDemon: {
    id: 'speedDemon',
    name: 'Speed Demon',
    icon: '💨',
    description: '+20⭐ if you win in under 10 moves',
    price: 10,
    rarity: 'uncommon',
    pieceType: 'global',
    effect: 'speedBonus',
    value: 20
  },
  
  timeMaster: {
    id: 'timeMaster',
    name: 'Time Master',
    icon: '⏰',
    description: '+2 UNDOS per game - fix your mistakes!',
    price: 10,
    rarity: 'uncommon',
    pieceType: 'global',
    effect: 'extraUndo',
    value: 2
  },

  // ============== COMMON PERKS (Basic but useful) ==============
  
  pawnRush: {
    id: 'pawnRush',
    name: 'Pawn Rush',
    icon: '🏃',
    description: 'Pawns can ALWAYS move 2 squares (not just from start)',
    price: 6,
    rarity: 'common',
    pieceType: 'pawn',
    effect: 'alwaysDouble'
  },
  
  pawnSidestep: {
    id: 'pawnSidestep',
    name: 'Sidestep',
    icon: '↔️',
    description: 'Pawns can move SIDEWAYS - dodge and reposition!',
    price: 7,
    rarity: 'common',
    pieceType: 'pawn',
    effect: 'sideways'
  },
  
  pawnRetreat: {
    id: 'pawnRetreat',
    name: 'Tactical Retreat',
    icon: '🔙',
    description: 'Pawns can move BACKWARDS - never get stuck!',
    price: 8,
    rarity: 'common',
    pieceType: 'pawn',
    effect: 'backwards'
  },
  
  goldBonus: {
    id: 'goldBonus',
    name: 'Star Collector',
    icon: '🌟',
    description: '+10⭐ bonus for every game won',
    price: 8,
    rarity: 'common',
    pieceType: 'global',
    effect: 'bonusReward',
    value: 10
  },
  
  startingGold: {
    id: 'startingGold',
    name: 'Trust Fund',
    icon: '💎',
    description: 'Instantly gain 15⭐ when purchased!',
    price: 5,
    rarity: 'common',
    pieceType: 'global',
    effect: 'instantGold',
    value: 15
  },
  
  scavenger: {
    id: 'scavenger',
    name: 'Scavenger',
    icon: '🦅',
    description: '+3⭐ every time enemy loses a piece (even to AI mistakes)',
    price: 8,
    rarity: 'common',
    pieceType: 'global',
    effect: 'scavenge',
    value: 3
  }
};

// Get perks by rarity
function getPerksByRarity(rarity) {
  return Object.values(PERKS).filter(p => p.rarity === rarity);
}

// Get random perks for shop (weighted by rarity)
function getShopPerks(ownedPerkIds = [], count = 3) {
  const available = Object.values(PERKS).filter(p => !ownedPerkIds.includes(p.id));
  const selected = [];
  
  // Weight by rarity - legendaries are rare but possible!
  const weights = { common: 35, uncommon: 30, rare: 20, epic: 10, legendary: 5 };
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const weighted = [];
    available.forEach(perk => {
      const w = weights[perk.rarity] || 10;
      for (let j = 0; j < w; j++) {
        weighted.push(perk);
      }
    });
    
    if (weighted.length === 0) break;
    
    const choice = weighted[Math.floor(Math.random() * weighted.length)];
    selected.push(choice);
    available.splice(available.indexOf(choice), 1);
  }
  
  return selected;
}

// Get piece type from unicode
function getPieceType(piece) {
  if ('♟♙'.includes(piece)) return 'pawn';
  if ('♞♘'.includes(piece)) return 'knight';
  if ('♝♗'.includes(piece)) return 'bishop';
  if ('♜♖'.includes(piece)) return 'rook';
  if ('♛♕'.includes(piece)) return 'queen';
  if ('♚♔'.includes(piece)) return 'king';
  return null;
}

// Check if player has a perk
function hasPerk(perks, perkId) {
  return perks.some(p => p.id === perkId);
}

// Get perks for a specific piece type
function getPerksForPiece(perks, pieceType) {
  return perks.filter(p => p.pieceType === pieceType || p.pieceType === 'global');
}
