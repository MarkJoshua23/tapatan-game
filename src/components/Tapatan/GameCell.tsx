import React from 'react';
import { Player } from '../../types/tapatan';

interface GameCellProps {
 value: Player;
  onClick: () => void;
  isSelected: boolean;
  disabled: boolean;
}

const GameCell: React.FC<GameCellProps> = ({ value, onClick, isSelected, disabled }) => {
  const getPlayerColor = (player: Player) => {
    if (player === 'X') return 'bg-blue-600'; // Player X is blue
    if (player === 'O') return 'bg-red-600';  // Player O is red
    return '';
  };

  return (
    <button
      className={`
        w-16 h-16 rounded-full border-4 flex items-center justify-center
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${value ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'}
        ${isSelected ? 'ring-4 ring-yellow-400' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        border-gray-300 dark:border-gray-600
      `}
      onClick={onClick}
      disabled={disabled || !!value}
      aria-label={value ? `Cell occupied by ${value}` : 'Empty cell'}
    >
      {value && (
        <div 
          className={`
            w-12 h-12 rounded-full transition-transform duration-300
            ${getPlayerColor(value)} 
            ${isSelected ? 'scale-110' : 'scale-100'}
          `}
        />
      )}
    </button>
  );
};

export default GameCell;