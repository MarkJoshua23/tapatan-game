'use client';

import React from 'react';
import { GameProvider } from '../../contexts/GameStateContext';
import GameBoard from '../../components/Tapatan/GameBoard';
import GameUI from '../../components/Tapatan/GameUI';
import { useGame } from '../../contexts/GameStateContext';
import { BOARD_CONNECTIONS } from '../../lib/game-logic';

const TapatanGameContent: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleCellClick = (index: number) => {
    // Don't allow moves if it's AI's turn or game is over
    if (state.currentPlayer !== 'X' || state.winner || state.phase === 'GAME_OVER') {
      return;
    }

    if (state.phase === 'PLACING') {
      // Placing phase - just place the piece
      dispatch({ type: 'MAKE_MOVE', payload: { index } });
    } else if (state.phase === 'MOVING') {
      // Moving phase
      if (state.selectedCell === null) {
        // No piece selected yet, check if clicked on player's piece
        if (state.board[index] === state.currentPlayer) {
          dispatch({ type: 'SELECT_CELL', payload: { index } });
        }
      } else {
        // A piece is already selected
        if (state.selectedCell === index) {
          // Clicked on the same piece, deselect it
          dispatch({ type: 'SELECT_CELL', payload: { index: -1 } }); // Use -1 to indicate no selection
        } else if (state.board[index] === state.currentPlayer) {
          // Clicked on another one of player's pieces, switch selection
          dispatch({ type: 'SELECT_CELL', payload: { index } });
        } else {
          // Try to move the selected piece to this position
          dispatch({ type: 'MAKE_MOVE', payload: { index } });
        }
      }
    }
  };

  // Calculate possible moves when a piece is selected
  const possibleMoves = state.selectedCell !== null && state.phase === 'MOVING'
    ? BOARD_CONNECTIONS[state.selectedCell].filter(index => state.board[index] === null)
    : [];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">Tapatan</h1>
          <p className="text-gray-60 dark:text-gray-300 text-sm md:text-base">Traditional Filipino Three-in-a-Row Game</p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6 mb-6">
          <GameUI mode="singleplayer" />
          
          <div className="my-6 flex justify-center">
            <GameBoard
              board={state.board}
              onCellClick={handleCellClick}
              selectedCell={state.selectedCell}
              possibleMoves={possibleMoves}
              winningPattern={state.winningPattern}
              disabled={state.currentPlayer !== 'X' || !!state.winner}
            />
          </div>
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 text-xs md:text-sm px-4">
          <p>Tapatan is a traditional Filipino game. Players take turns placing pieces, then moving them to form three in a row.</p>
        </div>
        
        <div className="w-full flex justify-center mt-6">
          <a
            href="/"
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium shadow-sm"
          >
            Return to Menu
          </a>
        </div>
      </div>
    </div>
  );
};

const TapatanGamePage: React.FC = () => {
  return (
    <GameProvider mode="singleplayer">
      <TapatanGameContent />
    </GameProvider>
  );
};

export default TapatanGamePage;