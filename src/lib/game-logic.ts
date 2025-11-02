import { BoardState, GamePhase, Player } from '../types/tapatan';

// Board connections for Tapatan game
// Board layout:
// (0)---(1)---(2)
//  |\    |   / |
//  |  \  |  /  |
// (3)---(4)---(5)
//  |  / |  \  |
//  | /   |   \ |
// (6)---(7)---(8)

export const BOARD_CONNECTIONS: number[][] = [
  [1, 3, 4],        // Position 0 connects to 1 (right), 3 (down), 4 (diagonal)
  [0, 2, 4],        // Position 1 connects to 0 (left), 2 (right), 4 (down)
  [1, 4, 5],        // Position 2 connects to 1 (left), 4 (diagonal), 5 (down)
  [0, 4, 6],        // Position 3 connects to 0 (up), 4 (right), 6 (down)
  [0, 1, 2, 3, 5, 6, 7, 8], // Position 4 (center) connects to all
  [2, 4, 8],        // Position 5 connects to 2 (up), 4 (left), 8 (down)
  [3, 4, 7],        // Position 6 connects to 3 (up), 4 (right), 7 (right)
  [6, 4, 8],        // Position 7 connects to 6 (left), 4 (up), 8 (right)
  [5, 4, 7],        // Position 8 connects to 5 (up), 4 (left), 7 (left)
];

// Check if a player has won
export function checkWinner(board: BoardState): Player {
  // Check all possible winning combinations
  const winPatterns = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal
    [2, 4, 6]  // Diagonal
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

// Check if the board is full (for placing phase)
export function isBoardFull(board: BoardState): boolean {
  return board.every(cell => cell !== null);
}

// Get valid moves for a player in moving phase
export function getValidMoves(board: BoardState, player: Player, selectedCell: number | null): number[] {
  if (selectedCell === null) return [];
  
  const playerPositions: number[] = [];
  board.forEach((cell, index) => {
    if (cell === player) {
      playerPositions.push(index);
    }
  });

  // Check if the selected cell belongs to the current player
  if (!playerPositions.includes(selectedCell)) {
    return [];
  }

  // Return all connected empty positions
  const connectedPositions = BOARD_CONNECTIONS[selectedCell];
  return connectedPositions.filter(pos => board[pos] === null);
}

// Check if a move is valid
export function isValidMove(
  board: BoardState,
  from: number | null,
  to: number,
  currentPlayer: Player,
  phase: GamePhase
): boolean {
  if (board[to] !== null) return false; // Position must be empty

  if (phase === 'PLACING') {
    // In placing phase, any empty position is valid
    return true;
  } else if (phase === 'MOVING' && from !== null) {
    // In moving phase, the destination must be connected to the source
    const connectedPositions = BOARD_CONNECTIONS[from];
    return connectedPositions.includes(to);
  }

  return false;
}

// Get possible moves for a player (used by AI)
export function getPossibleMoves(board: BoardState, player: Player, phase: GamePhase): Array<{ from: number | null, to: number }> {
  const moves: Array<{ from: number | null, to: number }> = [];
  
  if (phase === 'PLACING') {
    // Find all empty positions
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        moves.push({ from: null, to: i });
      }
    }
  } else if (phase === 'MOVING') {
    // Find all pieces of the current player
    for (let from = 0; from < board.length; from++) {
      if (board[from] === player) {
        // For each piece, find all valid moves
        const validMoves = getValidMoves(board, player, from);
        for (const to of validMoves) {
          moves.push({ from, to });
        }
      }
    }
  }
  
  return moves;
}

// Calculate game phase based on pieces placed
export function getGamePhase(board: BoardState): GamePhase {
  const placedPieces = board.filter(cell => cell !== null).length;
  
  if (placedPieces >= 6) {
    return 'MOVING';
  }
  
  return 'PLACING';
}

// Create a new empty board
export function createEmptyBoard(): BoardState {
  return Array(9).fill(null);
}