# Chess Roguelike

A roguelike chess game where you solve puzzles, earn stars, and buy **perks that break the rules of chess**.

## How to Play

### Core Loop
1. **Solve Puzzles** - Complete chess objectives (checkmate, capture all pieces, etc.)
2. **Earn Stars** - Each puzzle rewards you with ⭐ stars
3. **Buy Perks** - Spend stars on powerful abilities that modify how your pieces work
4. **Progress** - Each stage gets harder. How far can you go?

### Puzzle Types
- **Checkmate** - Checkmate the enemy King in N moves
- **Capture All** - Eliminate all enemy pieces (except King)
- **Capture Target** - Take out a specific piece (like the Queen)
- **Survival** - Survive N enemy turns without losing your King
- **Promotion** - Get a pawn to the end and promote it

### The Perks (Rule Breakers!)

#### Knight Perks
- 🐴 **Double Jump** - Knights move twice per turn
- ⚔️ **Fork Master** - Knights capture ALL pieces they threaten when landing
- ✨ **Blink Strike** - Teleport to any empty square (once per puzzle)

#### Rook Perks  
- 🗡️ **Piercing Rook** - Rooks capture ALL enemies in their path
- 🏰 **Fortified Tower** - Rooks cannot be captured
- 🐏 **Battering Ram** - Rooks push blocking pieces back

#### Bishop Perks
- 👻 **Ghost Bishop** - Bishops move through pieces
- 💫 **Divine Light** - Bishops can also move like a King
- 🎨 **Color Shift** - Bishops can switch diagonal colors

#### Queen Perks
- 👑 **Queen's Wrath** - Queen captures destroy adjacent enemies too
- 📜 **Royal Decree** - Queen + another piece can move (once per puzzle)

#### Pawn Perks
- 🏃 **Pawn Rush** - Pawns always move 2 squares
- ↔️ **Sidestep** - Pawns can move sideways
- 🔙 **Tactical Retreat** - Pawns can move backwards
- ⬆️ **Instant Promotion** - Pawns on rank 6/7 can promote early

#### King Perks
- 🔄 **Royal Escape** - Swap with any friendly piece (once)
- 🎖️ **Commander** - King moves 2 squares in any direction

#### Global Perks
- ⏰ **Time Master** - +1 undo per puzzle
- ⚡ **Double Time** - +2 bonus moves per puzzle
- 💖 **Second Chance** - Survive one failed puzzle
- 🌟 **Star Collector** - +5 bonus stars per puzzle
- 👁️ **Insight** - See hints for good moves

## Quick Start

```bash
open index.html
# or
npm start
```

## Controls
- **Click** a piece to select it
- **Click** a highlighted square to move
- **Undo Move** - Take back your last move (limited uses)
- **Skip Turn** - Pass your turn to the enemy

## Files
- `index.html` - Game structure
- `styles.css` - Clean, focused UI
- `game.js` - Main game logic with perk-modified rules
- `perks.js` - All perk definitions
- `puzzles.js` - Puzzle library and objectives
