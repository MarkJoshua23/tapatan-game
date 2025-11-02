'use client';

import React from 'react';
import { GameProvider } from '../../../contexts/GameStateContext';
import GameBoard from '../../../components/Tapatan/GameBoard';
import GameUI from '../../../components/Tapatan/GameUI';
import { useGame } from '../../../contexts/GameStateContext';
import { BOARD_CONNECTIONS } from '../../../lib/game-logic';

const MultiplayerGameContent: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleCellClick = (index: number) => {
    // Don't allow moves if game is over
    if (state.winner || state.phase === 'GAME_OVER') {
      return;
    }

    if (state.phase === 'COIN_TOSS') {
      // In coin toss phase, just let it complete
      return;
    }

    if (state.phase === 'PLACING') {
      // Placing phase - just place the piece
      dispatch({ type: 'MAKE_MOVE', payload: { index } });
    } else if (state.phase === 'MOVING') {
      // Moving phase
      if (state.selectedCell === null) {
        // No piece selected yet, check if clicked on current player's piece
        if (state.board[index] === state.currentPlayer) {
          dispatch({ type: 'SELECT_CELL', payload: { index } });
        }
      } else {
        // A piece is already selected
        if (state.selectedCell === index) {
          // Clicked on the same piece, deselect it
          dispatch({ type: 'SELECT_CELL', payload: { index: -1 } }); // Use -1 to indicate no selection
        } else if (state.board[index] === state.currentPlayer) {
          // Clicked on another one of current player's pieces, switch selection
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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-10 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">Tapatan</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Multiplayer - Pass and Play</p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6 mb-6">
          <GameUI mode="multiplayer" />
          
          <div className="my-6 flex justify-center">
            <GameBoard 
              board={state.board}
              onCellClick={handleCellClick}
              selectedCell={state.selectedCell}
              possibleMoves={possibleMoves}
              disabled={!!state.winner || state.phase === 'GAME_OVER'}
            />
          </div>
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 text-xs md:text-sm px-4">
          <p>Pass and Play mode: Two players take turns on the same device. Players alternate placing pieces, then moving them to form three in a row.</p>
        </div>
      </div>
    </div>
  );
};

const MultiplayerGamePage: React.FC = () => {
  return (
    <GameProvider mode="multiplayer">
      <MultiplayerGameContent />
    </GameProvider>
  );
};

export default MultiplayerGamePage;