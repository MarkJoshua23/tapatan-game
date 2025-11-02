export type Player = 'X' | 'O' | null;
export type BoardState = Player[];
export type GamePhase = 'PLACING' | 'MOVING' | 'GAME_OVER';
export type GameStatus = {
  board: BoardState;
  currentPlayer: 'X' | 'O';
  phase: GamePhase;
  winner: 'X' | 'O' | 'DRAW' | null;
  selectedCell: number | null;
  playerPieces: { X: number; O: number };
};