# Zustand Refactoring Plan

## Overview
Refactor the current React Context + useReducer implementation to use Zustand for state management in the Tapatan game.

## Benefits of Using Zustand
1. **Reduced Boilerplate**: Eliminate the need for Context Providers and complex reducer logic
2. **Better Performance**: Fine-grained reactivity with automatic memoization
3. **Simplified Testing**: Direct access to store for unit testing
4. **DevTools Integration**: Built-in support for Redux DevTools
5. **Middleware Support**: Easy to add logging, persistence, etc.

## Current Implementation Analysis
The current implementation uses:
- React Context API for state management
- useReducer for state transitions
- Complex provider pattern with useEffect for AI moves

## Proposed Zustand Implementation

### 1. Create Game Store
```typescript
// src/stores/gameStore.ts
import { create } from 'zustand';
import { GameStatus, Player, BoardState, GamePhase } from '../types/tapatan';
import { checkWinner, getGamePhase, createEmptyBoard } from '../lib/game-logic';
import { MinimaxAI } from '../components/Tapatan/MinimaxAI';

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

export const useGameStore = create<GameState>()((set, get) => ({
  // Initial state
  board: createEmptyBoard(),
  currentPlayer: 'X',
  phase: 'COIN_TOSS',
  winner: null,
  winningPattern: null,
  selectedCell: null,
  playerPieces: { X: 3, O: 3 },
  mode: 'singleplayer',
  
  // Actions
  makeMove: (index: number) => set((state) => {
    // Implementation similar to current reducer logic
  }),
  
  selectCell: (index: number) => set((state) => {
    // Implementation similar to current reducer logic
  }),
  
  resetGame: () => set({
    board: createEmptyBoard(),
    currentPlayer: 'X',
    phase: 'COIN_TOSS',
    winner: null,
    winningPattern: null,
    selectedCell: null,
    playerPieces: { X: 3, O: 3 }
  }),
  
  setCurrentPlayer: (player: 'X' | 'O') => set({ currentPlayer: player }),
  
  startGame: (firstPlayer: 'X' | 'O') => set({
    currentPlayer: firstPlayer,
    phase: 'PLACING'
  }),
  
  setMode: (mode: 'singleplayer' | 'multiplayer') => set({ mode })
}));
```

### 2. Update Components to Use Zustand
Replace `useGame()` with `useGameStore()` in all components:
- GameBoard.tsx
- GameUI.tsx
- GameCell.tsx
- Tapatan game pages (singleplayer and multiplayer)

### 3. Remove Old Context Implementation
Delete:
- src/contexts/GameStateContext.tsx
- Update imports in affected components

### 4. Update AI Integration
Modify AI move handling to work with Zustand:
- Replace useEffect-based AI moves with store-based approach
- Use get() to access current state in AI moves

## Migration Steps

### Step 1: Install Dependencies
```bash
npm install zustand
```

### Step 2: Create Game Store
Create `src/stores/gameStore.ts` with Zustand implementation

### Step 3: Update Components
Update all components to use the new store:
1. Replace `useGame()` with `useGameStore()`
2. Update action calls to use store methods
3. Remove Context Provider wrappers

### Step 4: Remove Old Context
Delete `src/contexts/GameStateContext.tsx` and update imports

### Step 5: Update Documentation
Update documentation to reflect new state management approach

## Expected Improvements

### Code Quality
- Reduced boilerplate by ~40%
- Simplified component structure
- Easier to understand data flow

### Performance
- Eliminated unnecessary re-renders
- Better memoization of computed values
- More efficient state updates

### Developer Experience
- Simpler testing with direct store access
- Better debugging with DevTools integration
- Cleaner component APIs

## Risk Assessment

### Low Risk
- No change to game logic or UI
- Backward compatibility maintained through similar API
- Incremental migration possible

### Mitigation Strategies
- Thorough testing of all game states
- Preserve existing action names and signatures where possible
- Maintain same state shape for minimal component changes

## Timeline
Estimated implementation time: 2-3 hours
1. Store creation: 1 hour
2. Component updates: 1 hour
3. Testing and debugging: 1 hour