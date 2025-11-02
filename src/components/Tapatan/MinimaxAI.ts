import { BoardState, Player, GamePhase } from '../../types/tapatan';
import { checkWinner, getGamePhase, getPossibleMoves, isValidMove } from '../../lib/game-logic';

const DEPTH_LIMIT = 6; // Limit depth to make moves faster

export class MinimaxAI {
  private player: Player;
  
  constructor(player: Player) {
    this.player = player;
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
      const newBoard = [...board];
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
    if (winner === this.player) {
      return 10000 - depth; // Prefer faster wins
    } else if (winner !== null) {
      return -10000 + depth; // Prefer slower losses
    }
    
    // Check for draw
    if (currentPhase === 'MOVING' && board.every(cell => cell !== null)) {
      return 0;
    }
    
    // Depth limit reached
    if (depth >= DEPTH_LIMIT) {
      return this.evaluateBoard(board);
    }
    
    const player = isMaximizing ? this.player : (this.player === 'X' ? 'O' : 'X');
    const moves = getPossibleMoves(board, player, currentPhase);
    
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const newBoard = [...board];
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
        const newBoard = [...board];
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
    // Simple evaluation: count potential winning lines
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
      
      // Count how many pieces the AI has in this line
      const aiPieces = line.filter(cell => cell === this.player).length;
      const opponentPieces = line.filter(cell => cell !== null && cell !== this.player).length;
      
      // If the line is blocked by opponent, skip it
      if (aiPieces > 0 && opponentPieces === 0) {
        // AI has pieces in this line, but not blocked by opponent
        if (aiPieces === 2) {
          score += 100; // Two in a row is good
        } else {
          score += 10; // One piece in a potential line is ok
        }
      } else if (opponentPieces > 0 && aiPieces === 0) {
        // Opponent has pieces in this line
        if (opponentPieces === 2) {
          score -= 50; // Opponent has two in a row, block them
        } else {
          score -= 5; // Opponent has one piece
        }
      }
    }
    
    return score;
  }
}