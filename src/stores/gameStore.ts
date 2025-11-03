import { create } from 'zustand';
import { GameStatus, Player, BoardState, GamePhase } from '../types/tapatan';
import { checkWinner, getGamePhase, createEmptyBoard, BOARD_CONNECTIONS } from '../lib/game-logic';

interface GameState {
  // State properties
  board: BoardState;
  currentPlayer: 'X' | 'O';
  phase: GamePhase;
  winner: 'X' | 'O' | 'DRAW' | null;
  winningPattern: number[] | null;
  selectedCell: number | null;
  playerPieces: { X: number; O: number };
  
  // Game mode
  mode: 'singleplayer' | 'multiplayer';
  
  // Actions
  makeMove: (index: number) => void;
  selectCell: (index: number) => void;
  resetGame: () => void;
  setCurrentPlayer: (player: 'X' | 'O') => void;
  startGame: (firstPlayer: 'X' | 'O') => void;
  setMode: (mode: 'singleplayer' | 'multiplayer') => void;
}

// Initial game state
const initialGameState: Omit<GameStatus, 'mode'> = {
  board: createEmptyBoard(),
  currentPlayer: 'X', // Will be determined by coin toss
  phase: 'COIN_TOSS', // New phase for coin toss
  winner: null,
  winningPattern: null,
  selectedCell: null,
  playerPieces: { X: 3, O: 3 }, // Each player starts with 3 pieces
};

export const useGameStore = create<GameState>()((set, get) => ({
  // Initial state
  ...initialGameState,
  mode: 'singleplayer',
  
  // Actions
  makeMove: (index: number) => set((state) => {
    const { board, currentPlayer, phase, selectedCell, playerPieces } = state;
    
    // Create a copy of the board
    let newBoard = [...board] as BoardState;
    let newPhase = phase;
    let newCurrentPlayer = state.currentPlayer;
    let newSelectedCell = null;
    let newPlayerPieces = { ...playerPieces };
    let newWinner = state.winner;
    let newWinningPattern = state.winningPattern;

    if (phase === 'PLACING') {
      // Place a piece on the board
      if (board[index] === null) {
        newBoard[index] = currentPlayer;
        
        // Update piece count
        newPlayerPieces[currentPlayer] = playerPieces[currentPlayer] - 1;
        
        // Check if we need to switch to moving phase
        const placedPieces = newBoard.filter(cell => cell !== null).length;
        if (placedPieces >= 6) {
          newPhase = 'MOVING';
        }
        
        // Check for winner after the move
        const winnerResult = checkWinner(newBoard);
        newWinner = winnerResult.winner;
        newWinningPattern = winnerResult.winningPattern;
        
        // Switch player if no winner
        if (!newWinner) {
          newCurrentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
      }
    } else if (phase === 'MOVING') {
      if (selectedCell !== null && board[selectedCell] === currentPlayer) {
        // We have a selected piece, now trying to move it
        const connectedPositions = BOARD_CONNECTIONS[selectedCell];
        if (connectedPositions.includes(index) && board[index] === null) {
          // Valid move: move from selected cell to clicked cell
          newBoard[selectedCell] = null;
          newBoard[index] = currentPlayer;
          newSelectedCell = null;
          
          // Check for winner after the move
          const winnerResult = checkWinner(newBoard);
          newWinner = winnerResult.winner;
          newWinningPattern = winnerResult.winningPattern;
          
          // Switch player if no winner
          if (!newWinner) {
            newCurrentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          }
        } else if (board[index] === currentPlayer) {
          // Clicked on another of our pieces, switch selection
          newSelectedCell = index;
        } else {
          // Clicked on an invalid position, keep selection
          newSelectedCell = selectedCell;
        }
      } else if (board[index] === currentPlayer) {
        // No piece was selected, but clicked on own piece - select it
        newSelectedCell = index;
      }
    }

    // If game is over, set phase to GAME_OVER
    if (newWinner) {
      newPhase = 'GAME_OVER';
    }

    return {
      board: newBoard,
      currentPlayer: newCurrentPlayer,
      phase: newPhase,
      winner: newWinner,
      winningPattern: newWinningPattern,
      selectedCell: newSelectedCell,
      playerPieces: newPlayerPieces,
    };
  }),
  
  selectCell: (index: number) => set((state) => {
    if (index === -1) {
      // Deselect any selected piece
      return {
        selectedCell: null,
      };
    } else if (state.phase === 'MOVING' && state.board[index] === state.currentPlayer) {
      return {
        selectedCell: index,
      };
    }
    return state;
  }),
  
  resetGame: () => set({
    ...initialGameState,
    board: createEmptyBoard(),
  }),
  
  setCurrentPlayer: (player: 'X' | 'O') => set({ currentPlayer: player }),
  
  startGame: (firstPlayer: 'X' | 'O') => set({
    currentPlayer: firstPlayer,
    phase: 'PLACING',
  }),
  
  setMode: (mode: 'singleplayer' | 'multiplayer') => set({ mode }),
}));