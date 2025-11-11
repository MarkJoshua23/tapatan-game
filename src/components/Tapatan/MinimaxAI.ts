import { BoardState, Player, GamePhase } from '../../types/tapatan';
import { checkWinner, getGamePhase, getPossibleMoves } from '../../lib/game-logic';

const DIFFICULTY_SETTINGS = {
  easy: { depthLimit: 1, name: "Easy" },
  medium: { depthLimit: 2, name: "Medium" },
  hard: { depthLimit: 6, name: "Hard" }
};

export class MinimaxAI {
  private player: Player;
  private difficulty: keyof typeof DIFFICULTY_SETTINGS;
  
  constructor(player: Player, difficulty: keyof typeof DIFFICULTY_SETTINGS = 'medium') {
    this.player = player;
    this.difficulty = difficulty;
  }

  // Main method to get the best move for the AI
  public getBestMove(board: BoardState, phase: GamePhase): { from: number | null, to: number } {
    const moves = getPossibleMoves(board, this.player, phase);
    
    if (moves.length === 0) {
      // No valid moves, return a default move
      return { from: null, to: -1 };
    }
    
    if (moves.length === 1) {
      // Only one possible move
      return moves[0];
    }
    
    let bestMove = moves[0];
    let bestValue = -Infinity;
    
    for (const move of moves) {
      // Make the move temporarily
      const newBoard = [...board] as BoardState;
      if (phase === 'PLACING') {
        newBoard[move.to] = this.player;
      } else if (phase === 'MOVING' && move.from !== null) {
        newBoard[move.from] = null;
        newBoard[move.to] = this.player;
      }
      
      // Evaluate the resulting board
      const value = this.minimax(newBoard, 0, false, -Infinity, Infinity, getGamePhase(newBoard));
      
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }
    
    return bestMove;
  }

  private minimax(
    board: BoardState,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    currentPhase: GamePhase
  ): number {
    // Check if game is over
    const winner = checkWinner(board);
    if (winner.winner === this.player) {
      return 10000 - depth; // Prefer faster wins
    } else if (winner.winner !== null) {
      return -10000 + depth; // Prefer slower losses
    }
    
    // Check for draw
    if (currentPhase === 'MOVING' && board.every(cell => cell !== null)) {
      return 0;
    }
    
    // Depth limit reached based on difficulty
    const depthLimit = DIFFICULTY_SETTINGS[this.difficulty].depthLimit;
    if (depth >= depthLimit) {
      return this.evaluateBoard(board);
    }
    
    const player = isMaximizing ? this.player : (this.player === 'X' ? 'O' : 'X');
    const moves = getPossibleMoves(board, player, currentPhase);
    
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const newBoard = [...board] as BoardState;
        if (currentPhase === 'PLACING') {
          newBoard[move.to] = player;
        } else if (currentPhase === 'MOVING' && move.from !== null) {
          newBoard[move.from] = null;
          newBoard[move.to] = player;
        }
        
        const evaluation = this.minimax(
          newBoard,
          depth + 1,
          false,
          alpha,
          beta,
          getGamePhase(newBoard)
        );
        
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const newBoard = [...board] as BoardState;
        if (currentPhase === 'PLACING') {
          newBoard[move.to] = player;
        } else if (currentPhase === 'MOVING' && move.from !== null) {
          newBoard[move.from] = null;
          newBoard[move.to] = player;
        }
        
        const evaluation = this.minimax(
          newBoard,
          depth + 1,
          true,
          alpha,
          beta,
          getGamePhase(newBoard)
        );
        
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      return minEval;
    }
  }

  private evaluateBoard(board: BoardState): number {
    // More sophisticated evaluation: count potential winning lines and immediate threats
    let score = 0;
    
    // Check all possible winning lines
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const line = [board[a], board[b], board[c]];
      
      // Count how many pieces each player has in this line
      const aiPieces = line.filter(cell => cell === this.player).length;
      const opponentPieces = line.filter(cell => cell !== null && cell !== this.player).length;
      const emptySpaces = line.filter(cell => cell === null).length;
      
      // If the line is completely blocked, skip it
      if (aiPieces > 0 && opponentPieces > 0) {
        // Blocked line, no points
        continue;
      }
      
      // If the AI has pieces in this line
      if (aiPieces > 0) {
        if (aiPieces === 3) {
          // Winning line, highest priority
          score += 1000;
        } else if (aiPieces === 2 && emptySpaces === 1) {
          // Two in a row with one empty space - almost winning
          score += 100;
        } else if (aiPieces === 1 && emptySpaces === 2) {
          // One piece with two empty spaces - potential line
          score += 10;
        }
      }
      
      // If the opponent has pieces in this line
      if (opponentPieces > 0) {
        if (opponentPieces === 3) {
          // Opponent has already won (shouldn't happen in minimax, but just in case)
          score -= 1000;
        } else if (opponentPieces === 2 && emptySpaces === 1) {
          // Opponent has two in a row - must block!
          score -= 500; // Very high negative score to prioritize blocking
        } else if (opponentPieces === 1 && emptySpaces === 2) {
          // Opponent has one piece with two empty spaces
          score -= 5;
        }
      }
    }
    
    // Center control bonus
    if (board[4] === this.player) {
      score += 15;
    } else if (board[4] !== null && board[4] !== this.player) {
      score -= 15;
    }
    
    return score;
  }
  
  // Get difficulty name for display
  public getDifficultyName(): string {
    return DIFFICULTY_SETTINGS[this.difficulty].name;
  }
}