import React from "react";
import { BoardState, Player } from "../../types/tapatan";

interface GameBoardProps {
  board: BoardState;
 onCellClick: (index: number) => void;
  selectedCell: number | null;
  possibleMoves: number[];
  disabled: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, selectedCell, possibleMoves, disabled }) => {
  // Calculate positions for the Tapatan board
  // The board layout should be:
  // (0)---(1)---(2)
  //  |\    |   / |
  // |  \  | /  |
  // (3)---(4)---(5)
  //  |  / |  \  |
 //  | /   |   \ |
  // (6)---(7)---(8)

  // Define coordinates for each position
 const positions = [
    { x: 15, y: 15 },    // Position 0 (top-left)
    { x: 50, y: 15 },    // Position 1 (top-center) 
    { x: 85, y: 15 },    // Position 2 (top-right)
    { x: 15, y: 50 },    // Position 3 (middle-left)
    { x: 50, y: 50 },    // Position 4 (center)
    { x: 85, y: 50 },    // Position 5 (middle-right)
    { x: 15, y: 85 },    // Position 6 (bottom-left)
    { x: 50, y: 85 },    // Position 7 (bottom-center)
    { x: 85, y: 85 },    // Position 8 (bottom-right)
  ];

  // Define lines between connected positions
 const lines = [
    // Horizontal lines
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 6, to: 7 },
    { from: 7, to: 8 },
    
    // Vertical lines
    { from: 0, to: 3 },
    { from: 3, to: 6 },
    { from: 1, to: 4 },
    { from: 4, to: 7 },
    { from: 2, to: 5 },
    { from: 5, to: 8 },
    
    // Diagonal lines
    { from: 0, to: 4 }, // top-left to center
    { from: 2, to: 4 }, // top-right to center
    { from: 6, to: 4 }, // bottom-left to center
    { from: 8, to: 4 }, // bottom-right to center
  ];

  // Get player color
 const getPlayerColor = (player: Player) => {
    if (player === 'X') return '#2563EB'; // blue-60
    if (player === 'O') return '#DC2626'; // red-600
    return '#0000';
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-md aspect-square p-2">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {/* Draw lines between connected positions - now with better spacing around circles */}
        {lines.map((line, index) => {
          const fromPos = positions[line.from];
          const toPos = positions[line.to];
          
          // Calculate direction vector
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          
          // Normalize and calculate offset (to avoid drawing lines through circles)
          const unitDx = dx / length;
          const unitDy = dy / length;
          
          // Offset start and end points to avoid drawing through circles
          const offset = 6; // Radius of the position circles
          const startX = fromPos.x + unitDx * offset;
          const startY = fromPos.y + unitDy * offset;
          const endX = toPos.x - unitDx * offset;
          const endY = toPos.y - unitDy * offset;
          
          return (
            <line
              key={index}
              x1={`${startX}%`}
              y1={`${startY}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke="#6B7280" // gray-500
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
        
        {/* Draw cells at positions */}
        {positions.map((pos, index) => {
          const isSelected = selectedCell === index;
          const isPossibleMove = possibleMoves.includes(index);
          const cellValue = board[index];
          
          return (
            <g
              key={index}
              onClick={() => !disabled && onCellClick(index)}
              style={{ cursor: disabled || cellValue ? 'default' : 'pointer' }}
            >
              {/* Draw the cell background circle */}
              <circle
                cx={`${pos.x}%`}
                cy={`${pos.y}%`}
                r="5.5"
                fill={isSelected ? "#FBBF24" : isPossibleMove ? "#FEF3C7" : "#F3F4F6"} // amber-40 when selected, amber-200 for possible moves, gray-100 otherwise
                stroke={isSelected ? "#F59E0B" : isPossibleMove ? "#F59E0B" : "#9CA3AF"} // amber-500 when selected or possible move, gray-40 otherwise
                strokeWidth={isSelected || isPossibleMove ? "2" : "1.5"}
              />
              
              {/* Draw the player piece if present */}
              {cellValue && (
                <circle
                  cx={`${pos.x}%`}
                  cy={`${pos.y}%`}
                  r="3.5"
                  fill={getPlayerColor(cellValue)}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GameBoard;
