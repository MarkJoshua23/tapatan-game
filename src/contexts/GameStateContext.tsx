import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameStatus, Player, BoardState, GamePhase } from '../types/tapatan';
import { checkWinner, getGamePhase, createEmptyBoard, BOARD_CONNECTIONS } from '../lib/game-logic';
import { MinimaxAI } from '../components/Tapatan/MinimaxAI';

// Define action types
type GameAction =
  | { type: 'MAKE_MOVE'; payload: { index: number } }
 | { type: 'SELECT_CELL'; payload: { index: number } }
  | { type: 'RESET_GAME' }
  | { type: 'SET_CURRENT_PLAYER'; payload: { player: 'X' | 'O' } };

// Game context type
interface GameContextType {
  state: GameStatus;
  dispatch: React.Dispatch<GameAction>;
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Initial game state
const initialGameState: GameStatus = {
  board: createEmptyBoard(),
  currentPlayer: 'X', // Human player is X
  phase: 'PLACING',
  winner: null,
  selectedCell: null,
  playerPieces: { X: 3, O: 3 }, // Each player starts with 3 pieces
};

// Reducer function
const gameReducer = (state: GameStatus, action: GameAction): GameStatus => {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { index } = action.payload;
      const { board, currentPlayer, phase, selectedCell, playerPieces } = state;
      
      // Create a copy of the board
      let newBoard = [...board] as BoardState;
      let newPhase = phase;
      let newCurrentPlayer = state.currentPlayer;
      let newSelectedCell = null;
      let newPlayerPieces = { ...playerPieces };
      let newWinner = state.winner;

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
          newWinner = checkWinner(newBoard);
          
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
            newWinner = checkWinner(newBoard);
            
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
        ...state,
        board: newBoard,
        currentPlayer: newCurrentPlayer,
        phase: newPhase,
        winner: newWinner,
        selectedCell: newSelectedCell,
        playerPieces: newPlayerPieces,
      };
    }

    case 'SELECT_CELL': {
      const { index } = action.payload;
      if (index === -1) {
        // Deselect any selected piece
        return {
          ...state,
          selectedCell: null,
        };
      } else if (state.phase === 'MOVING' && state.board[index] === state.currentPlayer) {
        return {
          ...state,
          selectedCell: index,
        };
      }
      return state;
    }

    case 'SET_CURRENT_PLAYER': {
      const { player } = action.payload;
      return {
        ...state,
        currentPlayer: player,
      };
    }

    case 'RESET_GAME':
      return {
        ...initialGameState,
        board: createEmptyBoard(),
      };

    default:
      return state;
  }
};

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Handle AI move when it's the AI's turn (O player)
  React.useEffect(() => {
    if (state.currentPlayer === 'O' && state.phase !== 'GAME_OVER') {
      // Add a small delay to make the AI move feel more natural
      const timer = setTimeout(() => {
        const ai = new MinimaxAI('O');
        const aiMove = ai.getBestMove(state.board, state.phase);
        
        if (aiMove.to !== -1) {
          if (state.phase === 'PLACING') {
            dispatch({ type: 'MAKE_MOVE', payload: { index: aiMove.to } });
          } else if (state.phase === 'MOVING' && aiMove.from !== null) {
            // First select the piece to move
            dispatch({ type: 'SELECT_CELL', payload: { index: aiMove.from } });
            
            // Then make the move after a short delay to simulate "thinking"
            setTimeout(() => {
              dispatch({ type: 'MAKE_MOVE', payload: { index: aiMove.to } });
            }, 300);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
 }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};