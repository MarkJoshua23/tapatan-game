import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import CoinToss from './CoinToss';

interface GameUIProps {
  mode?: 'singleplayer' | 'multiplayer';
}

const GameUI: React.FC<GameUIProps> = ({ mode = 'singleplayer' }) => {
  const state = useGameStore();
  const resetGame = useGameStore(state => state.resetGame);
  const startGame = useGameStore(state => state.startGame);

  const handleReset = () => {
    resetGame();
  };

  // Determine game status message
 let statusMessage = '';
  if (state.phase === 'COIN_TOSS') {
    statusMessage = 'Who goes first?';
  } else if (state.winner) {
    if (state.winner === 'DRAW') {
      statusMessage = "It's a draw!";
    } else {
      statusMessage = state.winner === 'X' ? (mode === 'multiplayer' ? 'Player X wins!' : 'You win!') : (mode === 'multiplayer' ? 'Player O wins!' : 'AI wins!');
    }
 } else if (state.phase === 'PLACING') {
    statusMessage = state.currentPlayer === 'X' ? (mode === 'multiplayer' ? 'Player X\'s turn' : 'Your turn (place a piece)') : (mode === 'multiplayer' ? 'Player O\'s turn' : 'AI thinking...');
  } else if (state.phase === 'MOVING') {
    if (state.selectedCell !== null) {
      statusMessage = state.currentPlayer === 'X' ? (mode === 'multiplayer' ? 'Player X\'s turn (move selected piece)' : 'Your turn (move selected piece)') : (mode === 'multiplayer' ? 'Player O\'s turn' : 'AI thinking...');
    } else {
      statusMessage = state.currentPlayer === 'X' ? (mode === 'multiplayer' ? 'Player X\'s turn (select a piece to move)' : 'Your turn (select a piece to move)') : (mode === 'multiplayer' ? 'Player O\'s turn' : 'AI thinking...');
    }
 }
 
 // Get difficulty for singleplayer mode
 let difficultyText = '';
 if (mode === 'singleplayer') {
   const urlParams = new URLSearchParams(window.location.search);
   const difficulty = urlParams.get('difficulty') || 'medium';
   const difficultyNames: Record<string, string> = {
     'easy': 'Easy',
     'medium': 'Medium',
     'hard': 'Hard'
   };
   difficultyText = `Difficulty: ${difficultyNames[difficulty] || 'Medium'}`;
 }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-5">
      
      {state.phase !== 'COIN_TOSS' && (
        <div className="w-full flex justify-between items-center mb-2">
          <div className="text-lg font-semibold flex items-center">
            <span className="w-4 h-4 rounded-full bg-blue-600 mr-2"></span>
            {mode === 'multiplayer' ? 'Player 1' : 'Player'}
          </div>
          <div className="text-lg font-semibold flex items-center">
            <span className="w-4 h-4 rounded-full bg-red-600 mr-2"></span>
            {mode === 'multiplayer' ? 'Player 2' : 'AI'}
          </div>
        </div>
      )}
      
      {/* Display difficulty for singleplayer mode */}
      {mode === 'singleplayer' && state.phase !== 'COIN_TOSS' && !state.winner && (
        <div className="w-full text-center py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{difficultyText}</h3>
        </div>
      )}
      
      {state.phase === 'COIN_TOSS' ? (
        <CoinToss onResult={(result) => startGame(result)} />
      ) : state.winner ? (
        <div className="w-full text-center py-5 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg transform scale-105 transition-transform duration-300">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 drop-shadow-md">{statusMessage}</h2>
        </div>
      ) : (
        <div className="w-full text-center py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-gray-80 dark:text-gray-200">{statusMessage}</h2>
        </div>
      )}
      
      <div className="w-full flex justify-center mt-2">
        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium shadow-sm"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameUI;