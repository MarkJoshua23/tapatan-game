'use client';


import React, { Suspense, useEffect } from 'react';
import GameBoard from '../../components/Tapatan/GameBoard';
import GameUI from '../../components/Tapatan/GameUI';
import { useGameStore } from '../../stores/gameStore';
import { BOARD_CONNECTIONS } from '../../lib/game-logic';
import { MinimaxAI } from '../../components/Tapatan/MinimaxAI';

const TapatanGamePage: React.FC = () => {
  const state = useGameStore();
  const makeMove = useGameStore(state => state.makeMove);
  const selectCell = useGameStore(state => state.selectCell);
  const resetGame = useGameStore(state => state.resetGame);
  const setMode = useGameStore(state => state.setMode);

  // Set the mode to singleplayer
  useEffect(() => {
    setMode('singleplayer');
  }, [setMode]);

  const handleCellClick = (index: number) => {
    // Don't allow moves if it's AI's turn or game is over
    if (state.currentPlayer !== 'X' || state.winner || state.phase === 'GAME_OVER') {
      return;
    }

    if (state.phase === 'PLACING') {
      // Placing phase - just place the piece
      makeMove(index);
    } else if (state.phase === 'MOVING') {
      // Moving phase
      if (state.selectedCell === null) {
        // No piece selected yet, check if clicked on player's piece
        if (state.board[index] === state.currentPlayer) {
          selectCell(index);
        }
      } else {
        // A piece is already selected
        if (state.selectedCell === index) {
          // Clicked on the same piece, deselect it
          selectCell(-1); // Use -1 to indicate no selection
        } else if (state.board[index] === state.currentPlayer) {
          // Clicked on another one of player's pieces, switch selection
          selectCell(index);
        } else {
          // Try to move the selected piece to this position
          makeMove(index);
        }
      }
    }
  };

  // Calculate possible moves when a piece is selected
  const possibleMoves = state.selectedCell !== null && state.phase === 'MOVING'
    ? BOARD_CONNECTIONS[state.selectedCell].filter(index => state.board[index] === null)
    : [];

  // Handle AI moves in singleplayer mode
  useEffect(() => {
    if (state.currentPlayer === 'O' && state.phase !== 'GAME_OVER' && state.mode === 'singleplayer') {
      const timer = setTimeout(() => {
        const ai = new MinimaxAI('O');
        const aiMove = ai.getBestMove(state.board, state.phase);
        
        if (aiMove.to !== -1) {
          if (state.phase === 'PLACING') {
            makeMove(aiMove.to);
          } else if (state.phase === 'MOVING' && aiMove.from !== null) {
            // First select the piece to move
            selectCell(aiMove.from);
            
            // Then make the move after a short delay to simulate "thinking"
            setTimeout(() => {
              makeMove(aiMove.to);
            }, 300);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [state, makeMove, selectCell]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">Tapatan</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Traditional Filipino Three-in-a-Row Game</p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6 mb-6">
          <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
            <GameUI mode="singleplayer" />
          </Suspense>
          
          <div className="my-6 flex justify-center">
            <GameBoard
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

export default TapatanGamePage;