// Game Position Generator - Creates randomized mid-game chess positions
// Board: [row][col] where [0][0]=a8, [7][7]=h1
// Black (enemy): ♚♛♜♝♞♟ | White (player): ♔♕♖♗♘♙

const GAME_TYPE = 'checkmate'; // Full game until checkmate or stalemate

// ================== POSITION TEMPLATES ==================
// These are realistic mid-game positions with interesting play
const POSITION_TEMPLATES = [
  // Template 1: Open game, both sides developed
  {
    name: "Open Center",
    description: "An open position with active pieces",
    hint: "Control the center and attack weak points!",
    minStage: 1,
    board: [
      ['♜', null, null, '♛', null, '♜', '♚', null],
      ['♟', '♟', null, null, '♟', '♟', '♟', '♟'],
      [null, null, '♞', '♟', null, '♞', null, null],
      [null, null, '♝', null, null, null, null, null],
      [null, null, '♗', '♙', null, null, null, null],
      [null, null, '♘', null, null, '♘', null, null],
      ['♙', '♙', '♙', null, '♙', '♙', '♙', '♙'],
      ['♖', null, null, '♕', null, '♖', '♔', null]
    ]
  },
  // Template 2: Kingside attack
  {
    name: "Kingside Storm",
    description: "Your pieces are aimed at the enemy King!",
    hint: "Look for sacrifices and forcing moves!",
    minStage: 2,
    board: [
      ['♜', null, null, '♛', null, '♜', '♚', null],
      ['♟', '♟', '♟', null, null, '♟', '♟', '♟'],
      [null, null, null, '♟', null, null, null, null],
      [null, null, null, null, '♟', null, '♗', null],
      [null, null, null, null, '♙', null, null, null],
      [null, null, '♘', null, null, '♘', null, null],
      ['♙', '♙', '♙', null, null, '♙', '♙', '♙'],
      ['♖', null, null, '♕', null, '♖', '♔', null]
    ]
  },
  // Template 3: Queenside majority
  {
    name: "Queenside Push",
    description: "Use your queenside pawns to create threats!",
    hint: "Advance your pawns and open lines for your Rooks!",
    minStage: 1,
    board: [
      ['♜', null, null, null, '♛', null, '♚', null],
      [null, '♟', '♟', '♜', null, '♟', '♟', '♟'],
      ['♟', null, null, '♟', null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['♙', null, null, null, null, null, null, null],
      [null, '♙', null, '♙', null, '♘', null, null],
      [null, null, '♙', null, '♙', '♙', '♙', '♙'],
      ['♖', null, null, '♕', null, '♖', '♔', null]
    ]
  },
  // Template 4: Active Rooks
  {
    name: "Rook Power",
    description: "Your Rooks dominate the open files!",
    hint: "Double your Rooks and invade on the 7th rank!",
    minStage: 2,
    board: [
      [null, null, null, null, '♜', null, '♚', null],
      ['♟', '♟', null, '♜', null, '♟', '♟', '♟'],
      [null, null, '♟', null, null, null, null, null],
      [null, null, null, null, '♟', null, null, null],
      [null, null, null, null, '♙', null, null, null],
      [null, null, '♙', null, null, null, null, null],
      ['♙', '♙', null, '♖', null, '♙', '♙', '♙'],
      [null, null, null, '♖', null, null, '♔', null]
    ]
  },
  // Template 5: Knight outpost
  {
    name: "Knight Fortress",
    description: "Your Knight has a powerful outpost!",
    hint: "Use your Knight to support the attack!",
    minStage: 1,
    board: [
      ['♜', null, null, '♛', null, '♜', '♚', null],
      ['♟', '♟', null, null, '♟', '♟', '♟', '♟'],
      [null, null, null, '♟', null, null, null, null],
      [null, null, null, '♘', null, null, null, null],
      [null, null, null, null, '♙', null, null, null],
      [null, null, '♙', null, null, null, null, null],
      ['♙', '♙', null, null, null, '♙', '♙', '♙'],
      ['♖', null, null, '♕', null, '♖', '♔', null]
    ]
  },
  // Template 6: Bishop pair
  {
    name: "Bishop Dominance",
    description: "Your Bishops control key diagonals!",
    hint: "Keep the position open for your Bishops!",
    minStage: 2,
    board: [
      ['♜', null, null, '♛', null, '♜', '♚', null],
      ['♟', '♟', null, null, null, '♟', '♟', '♟'],
      [null, null, '♟', '♟', null, null, null, null],
      [null, null, null, null, '♟', null, '♗', null],
      [null, null, '♗', null, '♙', null, null, null],
      [null, null, null, null, null, null, null, null],
      ['♙', '♙', '♙', null, null, '♙', '♙', '♙'],
      ['♖', null, null, '♕', null, '♖', '♔', null]
    ]
  },
  // Template 7: Pawn storm
  {
    name: "Pawn Avalanche",
    description: "Your pawns are ready to march!",
    hint: "Push your pawns forward with support!",
    minStage: 3,
    board: [
      ['♜', null, null, '♛', null, '♜', '♚', null],
      ['♟', '♟', null, null, null, null, '♟', '♟'],
      [null, null, '♟', null, '♟', '♟', null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, '♙', '♙', '♙', null, null],
      [null, null, '♙', null, null, null, '♙', null],
      ['♙', '♙', null, null, null, null, null, '♙'],
      ['♖', null, null, '♕', '♖', null, '♔', null]
    ]
  },
  // Template 8: Queen infiltration
  {
    name: "Queen Raid",
    description: "Your Queen is deep in enemy territory!",
    hint: "Coordinate your Queen with other pieces!",
    minStage: 3,
    board: [
      ['♜', null, null, null, null, '♜', '♚', null],
      ['♟', '♟', '♕', null, null, '♟', '♟', '♟'],
      [null, null, '♟', '♟', null, null, null, null],
      [null, null, null, null, '♛', null, null, null],
      [null, null, null, null, '♙', null, null, null],
      [null, null, '♙', null, null, '♘', null, null],
      ['♙', '♙', null, null, null, '♙', '♙', '♙'],
      ['♖', null, null, null, null, '♖', '♔', null]
    ]
  },
  // Template 9: Tactical chaos
  {
    name: "Complications",
    description: "A sharp position with many possibilities!",
    hint: "Calculate carefully - tactics are everywhere!",
    minStage: 3,
    board: [
      ['♜', null, null, null, null, null, '♚', null],
      [null, '♟', null, '♛', null, '♟', '♟', '♟'],
      ['♟', null, '♜', '♟', null, null, null, null],
      [null, null, null, '♘', '♟', null, '♗', null],
      [null, null, '♙', null, null, null, null, null],
      [null, '♙', null, null, '♙', '♘', null, null],
      ['♙', null, null, '♕', null, '♙', '♙', '♙'],
      ['♖', null, null, null, null, '♖', '♔', null]
    ]
  },
  // Template 10: Endgame transition
  {
    name: "Simplify to Win",
    description: "You have the advantage - convert it!",
    hint: "Trade pieces and push your passed pawn!",
    minStage: 4,
    board: [
      [null, null, null, null, '♜', null, '♚', null],
      ['♟', '♟', null, null, null, null, '♟', '♟'],
      [null, null, null, null, null, '♟', null, null],
      ['♙', null, null, null, null, null, null, null],
      [null, null, null, null, '♙', null, null, null],
      [null, '♙', null, null, null, null, null, null],
      [null, null, null, null, '♖', '♙', '♙', '♙'],
      [null, null, null, null, null, null, '♔', null]
    ]
  },
  // Template 11: Piece activity
  {
    name: "Active Army",
    description: "All your pieces are ready for battle!",
    hint: "Coordinate your pieces for maximum effect!",
    minStage: 2,
    board: [
      ['♜', null, null, null, null, '♜', '♚', null],
      ['♟', '♟', '♟', null, null, '♟', '♟', '♟'],
      [null, null, '♞', '♛', null, null, null, null],
      [null, null, null, '♟', null, null, null, null],
      [null, null, '♗', '♙', null, null, null, null],
      [null, null, '♘', null, null, '♕', null, null],
      ['♙', '♙', '♙', null, '♙', '♙', '♙', '♙'],
      ['♖', null, null, null, null, '♖', '♔', null]
    ]
  },
  // Template 12: Weak back rank
  {
    name: "Back Rank Danger",
    description: "The enemy King looks vulnerable!",
    hint: "Look for back rank threats!",
    minStage: 3,
    board: [
      ['♜', null, null, null, null, '♜', '♚', null],
      ['♟', '♟', null, null, null, '♟', '♟', '♟'],
      [null, null, '♟', null, null, null, null, null],
      [null, null, null, null, '♟', null, null, null],
      [null, null, null, null, '♙', null, null, null],
      [null, null, '♙', '♕', null, null, null, null],
      ['♙', '♙', null, null, null, '♙', '♙', '♙'],
      [null, null, null, '♖', null, '♖', '♔', null]
    ]
  },
  // Template 13: Semi-open files
  {
    name: "File Control",
    description: "Control the open files!",
    hint: "Put your Rooks on open and semi-open files!",
    minStage: 2,
    board: [
      ['♜', null, null, '♛', '♚', null, null, '♜'],
      ['♟', '♟', '♟', null, null, '♟', '♟', '♟'],
      [null, null, null, '♟', null, null, null, null],
      [null, null, null, null, '♟', null, '♝', null],
      [null, null, null, '♙', '♙', null, null, null],
      [null, null, null, null, null, '♘', null, null],
      ['♙', '♙', '♙', null, null, '♙', '♙', '♙'],
      ['♖', null, null, null, '♔', null, null, '♖']
    ]
  },
  // Template 14: Opposite castling
  {
    name: "Race to Attack",
    description: "Both Kings on opposite sides - attack first!",
    hint: "Launch a pawn storm against the enemy King!",
    minStage: 4,
    board: [
      [null, null, '♚', '♜', null, null, null, '♜'],
      ['♟', '♟', '♟', null, null, '♟', '♟', '♟'],
      [null, null, '♞', '♟', null, null, null, null],
      [null, null, null, null, null, null, '♗', null],
      [null, null, null, null, '♙', null, null, null],
      ['♙', '♙', null, null, null, '♘', null, null],
      [null, null, '♙', '♙', null, '♙', '♙', '♙'],
      ['♖', null, null, null, null, '♖', '♔', null]
    ]
  },
  // Template 15: Material advantage
  {
    name: "Convert the Lead",
    description: "You have extra material - use it!",
    hint: "Trade pieces and simplify when ahead!",
    minStage: 4,
    board: [
      ['♜', null, null, null, '♚', null, null, null],
      ['♟', '♟', null, null, null, '♟', '♟', '♟'],
      [null, null, '♟', null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, '♗', null, '♙', null, null, null],
      [null, null, null, null, null, '♘', null, null],
      ['♙', '♙', '♙', '♕', null, '♙', '♙', '♙'],
      ['♖', null, null, null, null, '♖', '♔', null]
    ]
  }
];

// ================== POSITION VARIATION ==================
// Apply random variations to make each game unique
function applyVariations(board) {
  const newBoard = board.map(row => [...row]);
  
  // Small random pawn movements (50% chance per eligible pawn)
  for (let row = 2; row <= 5; row++) {
    for (let col = 0; col < 8; col++) {
      if (Math.random() > 0.5) continue;
      
      const piece = newBoard[row][col];
      if (piece === '♙' && row > 1 && !newBoard[row-1][col]) {
        // Move white pawn forward
        if (Math.random() > 0.7) {
          newBoard[row-1][col] = piece;
          newBoard[row][col] = null;
        }
      } else if (piece === '♟' && row < 6 && !newBoard[row+1][col]) {
        // Move black pawn forward
        if (Math.random() > 0.7) {
          newBoard[row+1][col] = piece;
          newBoard[row][col] = null;
        }
      }
    }
  }
  
  // Occasionally remove a piece (10% chance for minor pieces)
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = newBoard[row][col];
      if (!piece) continue;
      
      // Only remove minor pieces sometimes
      if ('♞♝♘♗'.includes(piece) && Math.random() < 0.1) {
        newBoard[row][col] = null;
      }
    }
  }
  
  return newBoard;
}

// ================== POSITION VALIDATION ==================
function isSquareAttacked(board, targetRow, targetCol, attackerColor) {
  const isBlackPiece = (p) => p && '♚♛♜♝♞♟'.includes(p);
  const isWhitePiece = (p) => p && '♔♕♖♗♘♙'.includes(p);
  const isAttacker = attackerColor === 'black' ? isBlackPiece : isWhitePiece;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece || !isAttacker(piece)) continue;
      
      // Pawn attacks
      if (piece === '♟' || piece === '♙') {
        const dir = isBlackPiece(piece) ? 1 : -1;
        if (row + dir === targetRow && (col - 1 === targetCol || col + 1 === targetCol)) {
          return true;
        }
        continue;
      }
      
      // Knight attacks
      if (piece === '♞' || piece === '♘') {
        const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        for (const [dr, dc] of knightMoves) {
          if (row + dr === targetRow && col + dc === targetCol) return true;
        }
        continue;
      }
      
      // King attacks
      if (piece === '♚' || piece === '♔') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            if (row + dr === targetRow && col + dc === targetCol) return true;
          }
        }
        continue;
      }
      
      // Sliding pieces
      const dirs = [];
      if (piece === '♝' || piece === '♗' || piece === '♛' || piece === '♕') {
        dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
      }
      if (piece === '♜' || piece === '♖' || piece === '♛' || piece === '♕') {
        dirs.push([-1,0],[1,0],[0,-1],[0,1]);
      }
      
      for (const [dr, dc] of dirs) {
        let r = row + dr, c = col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
          if (r === targetRow && c === targetCol) return true;
          if (board[r][c]) break;
          r += dr; c += dc;
        }
      }
    }
  }
  
  return false;
}

function findKing(board, color) {
  const king = color === 'white' ? '♔' : '♚';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === king) return { row, col };
    }
  }
  return null;
}

function isInCheck(board, color) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const attacker = color === 'white' ? 'black' : 'white';
  return isSquareAttacked(board, kingPos.row, kingPos.col, attacker);
}

function isValidPosition(board) {
  const whiteKing = findKing(board, 'white');
  const blackKing = findKing(board, 'black');
  
  if (!whiteKing || !blackKing) return false;
  
  // Neither king should be in check at start
  // (This ensures a fair start - player moves first)
  if (isInCheck(board, 'white')) return false;
  if (isInCheck(board, 'black')) return false;
  
  return true;
}

// ================== GAME GENERATION ==================
function getGameForStage(stage) {
  // Filter templates by stage
  const validTemplates = POSITION_TEMPLATES.filter(t => t.minStage <= stage);
  
  // Pick random template
  const template = validTemplates[Math.floor(Math.random() * validTemplates.length)];
  
  // Apply variations
  let board = applyVariations(template.board);
  
  // Validate - if invalid, use original template
  if (!isValidPosition(board)) {
    board = template.board.map(row => [...row]);
  }
  
  // Calculate reward based on stage
  const baseReward = 10 + (stage * 5);
  
  return {
    type: GAME_TYPE,
    name: template.name,
    description: template.description,
    hint: template.hint,
    board: board,
    movesLimit: null, // No move limit for full games
    reward: baseReward,
    stage: stage
  };
}

// Legacy alias for compatibility
function getPuzzleForStage(stage) {
  return getGameForStage(stage);
}

// ================== GAME STATE CHECKS ==================
function checkPuzzleComplete(gameState) {
  // Win condition: enemy King is in checkmate
  return isCheckmate(gameState.board, 'black');
}

function checkPuzzleFailed(gameState) {
  // Lose condition: player King is in checkmate
  return isCheckmate(gameState.board, 'white');
}

function checkStalemate(gameState) {
  // Check if either side is in stalemate
  if (isStalemate(gameState.board, 'black')) return 'black';
  if (isStalemate(gameState.board, 'white')) return 'white';
  return null;
}

function getProgressText(gameState) {
  if (isInCheck(gameState.board, 'black')) {
    return "Enemy King in CHECK!";
  }
  if (isInCheck(gameState.board, 'white')) {
    return "Your King is in CHECK!";
  }
  return "Checkmate the enemy King!";
}

// ================== CHESS LOGIC HELPERS ==================
function getBasicMovesForPiece(board, row, col) {
  const moves = [];
  const piece = board[row][col];
  if (!piece) return moves;
  
  const isWhite = '♔♕♖♗♘♙'.includes(piece);
  const isFriendly = (p) => p && ('♔♕♖♗♘♙'.includes(p) === isWhite);
  
  const addMove = (r, c) => {
    if (r >= 0 && r < 8 && c >= 0 && c < 8 && !isFriendly(board[r][c])) {
      moves.push({ row: r, col: c });
    }
  };
  
  const addSlide = (dr, dc) => {
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (isFriendly(board[r][c])) break;
      moves.push({ row: r, col: c });
      if (board[r][c]) break;
      r += dr; c += dc;
    }
  };
  
  if (piece === '♔' || piece === '♚') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) addMove(row + dr, col + dc);
      }
    }
  }
  
  if (piece === '♕' || piece === '♛') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) addSlide(dr, dc);
      }
    }
  }
  
  if (piece === '♖' || piece === '♜') {
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => addSlide(dr, dc));
  }
  
  if (piece === '♗' || piece === '♝') {
    [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => addSlide(dr, dc));
  }
  
  if (piece === '♘' || piece === '♞') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => {
      addMove(row + dr, col + dc);
    });
  }
  
  if (piece === '♙') {
    if (row > 0 && !board[row-1][col]) {
      moves.push({ row: row-1, col });
      if (row === 6 && !board[row-2][col]) moves.push({ row: row-2, col });
    }
    if (row > 0 && col > 0 && board[row-1][col-1] && !isFriendly(board[row-1][col-1])) {
      moves.push({ row: row-1, col: col-1 });
    }
    if (row > 0 && col < 7 && board[row-1][col+1] && !isFriendly(board[row-1][col+1])) {
      moves.push({ row: row-1, col: col+1 });
    }
  }
  
  if (piece === '♟') {
    if (row < 7 && !board[row+1][col]) {
      moves.push({ row: row+1, col });
      if (row === 1 && !board[row+2][col]) moves.push({ row: row+2, col });
    }
    if (row < 7 && col > 0 && board[row+1][col-1] && !isFriendly(board[row+1][col-1])) {
      moves.push({ row: row+1, col: col-1 });
    }
    if (row < 7 && col < 7 && board[row+1][col+1] && !isFriendly(board[row+1][col+1])) {
      moves.push({ row: row+1, col: col+1 });
    }
  }
  
  return moves;
}

function hasLegalMoves(board, color) {
  const pieces = color === 'white' ? '♔♕♖♗♘♙' : '♚♛♜♝♞♟';
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece || !pieces.includes(piece)) continue;
      
      const moves = getBasicMovesForPiece(board, row, col);
      
      for (const move of moves) {
        const testBoard = board.map(r => [...r]);
        testBoard[move.row][move.col] = piece;
        testBoard[row][col] = null;
        
        if (!isInCheck(testBoard, color)) return true;
      }
    }
  }
  
  return false;
}

function isCheckmate(board, color) {
  if (!isInCheck(board, color)) return false;
  return !hasLegalMoves(board, color);
}

function isStalemate(board, color) {
  if (isInCheck(board, color)) return false;
  return !hasLegalMoves(board, color);
}

// ================== DEPRECATED (kept for compatibility) ==================
function countPieces(board, color) {
  const pieces = color === 'black' ? '♚♛♜♝♞♟' : '♔♕♖♗♘♙';
  let count = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] && pieces.includes(board[row][col])) count++;
    }
  }
  return count;
}

function boardContains(board, piece) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === piece) return true;
    }
  }
  return false;
}
