# Tapatan Game Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Game Rules and Principles](#game-rules-and-principles)
3. [Architecture Overview](#architecture-overview)
4. [Component Structure](#component-structure)
5. [Data Flow](#data-flow)
6. [Game Logic Implementation](#game-logic-implementation)
7. [AI Implementation](#ai-implementation)
8. [UI/UX Design](#uiux-design)
9. [State Management](#state-management)
10. [Deployment](#deployment)

## Introduction

This documentation provides a comprehensive overview of the Tapatan game implementation, covering both game development principles and web development architecture. Tapatan is a traditional Filipino three-in-a-row game similar to Tic-Tac-Toe but with more complex movement mechanics.

## Game Rules and Principles

### What is Tapatan?

Tapatan is a traditional Filipino strategy board game belonging to the three-in-a-row family. It's played on a board with nine points arranged in an asterisk-like pattern with lines connecting them.

### Board Layout

The board consists of 9 positions arranged in an asterisk pattern:
```
(0)---(1)---(2)
 |\    |   / |
 |  \  |  /  |
(3)---(4)---(5)
 |  /  |  \  |
 | /   |   \ |
(6)---(7)---(8)
```

### Game Phases

1. **Placing Phase**: Players take turns placing their pieces on empty positions
2. **Moving Phase**: Players take turns moving their pieces along the lines to adjacent positions

### Game Rules

1. Each player has 3 pieces (X and O)
2. Players alternate turns
3. During placing phase, players place one piece per turn on any empty position
4. Once all 6 pieces are placed, the game enters moving phase
5. During moving phase, players move one of their pieces to an adjacent empty position
6. First player to get three pieces in a row (horizontally, vertically, or diagonally) wins
7. If no player can form three in a row and no legal moves remain, the game is a draw

### Winning Conditions

A player wins by forming three of their pieces in a continuous line:
- Horizontally: 0-1-2, 3-4-5, 6-7-8
- Vertically: 0-3-6, 1-4-7, 2-5-8
- Diagonally: 0-4-8, 2-4-6

## Architecture Overview

The Tapatan game follows a modern React architecture with TypeScript, utilizing:
- Next.js 13+ App Router
- Zustand for state management
- TypeScript for type safety
- Tailwind CSS for styling
- SVG for game board rendering

### Key Architectural Decisions

1. **Component-Based Architecture**: The game is divided into reusable, self-contained components
2. **Unidirectional Data Flow**: State flows down through props, actions flow up through callbacks
3. **Context API**: Centralized game state management using React Context
4. **Separation of Concerns**: Game logic is separated from UI components
5. **Responsive Design**: Mobile-first approach with responsive layouts

## Component Structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx              # Root layout
│   ├── tapatan/
│   │   ├── page.tsx            # Singleplayer game page
│   │   ├── multiplayer/
│   │   │   └── page.tsx        # Multiplayer game page
│   │   └── difficulty/
│   │       └── page.tsx        # Difficulty selection page
│   └── globals.css             # Global styles
├── components/
│   └── Tapatan/
│       ├── GameBoard.tsx        # SVG game board renderer
│       ├── GameCell.tsx         # Individual cell component
│       ├── GameUI.tsx           # Game controls and status display
│       ├── CoinToss.tsx         # Coin toss animation component
│       └── MinimaxAI.ts         # AI opponent implementation
├── stores/
│   └── gameStore.ts             # Zustand game state management
├── lib/
│   └── game-logic.ts            # Core game logic functions
├── types/
│   └── tapatan.ts               # TypeScript type definitions
└── docs/
    └── tapatan-game-documentation.md # This documentation
```

### Component Responsibilities

#### GameBoard.tsx
- Renders the SVG game board
- Displays pieces and board connections
- Handles cell click events
- Visualizes possible moves and winning patterns

#### GameCell.tsx
- Represents individual board positions
- Handles piece rendering
- Manages selection states

#### GameUI.tsx
- Displays game status messages
- Provides game controls (reset, new game)
- Shows player information and difficulty level

#### CoinToss.tsx
- Implements coin toss animation
- Determines first player randomly

#### MinimaxAI.ts
- Implements AI opponent using minimax algorithm
- Provides different difficulty levels

#### GameStateContext.tsx
- Manages global game state
- Handles game logic and transitions
- Coordinates AI moves

#### game-logic.ts
- Contains pure game logic functions
- Board evaluation and win condition checking
- Move validation and possible moves calculation

## Data Flow

### Unidirectional Data Flow Pattern

```
[User Interaction] → [Event Handler] → [Action Dispatch] → [State Update] → [UI Re-render]
```

### Detailed Data Flow

1. **User Interaction**: Player clicks on a board cell
2. **Event Handler**: Game page handles the click event
3. **State Update**: Calls appropriate Zustand action (makeMove or selectCell)
4. **UI Re-render**: Components re-render with new state using selector functions
5. **AI Response**: If it's AI's turn, useEffect triggers AI move after delay
6. **AI Action**: AI calls appropriate Zustand action to make its move

### State Management Flow

```
Initial State → User Action → Zustand Store → New State → Components
                                           ↑
                                    AI Effect ──────┘
```

### Component Communication

```
App/Page Components
    ↓ (props)
useGameStore Hook
    ↓ (selector functions)
GameUI (displays status)
    ↓ (store access)
GameBoard (renders board)
    ↓ (store access)
Individual board elements
```

## Game Logic Implementation

### Core Concepts

#### Game Phases
The game has distinct phases managed by the state:
- `COIN_TOSS`: Determining who moves first
- `PLACING`: Players placing pieces
- `MOVING`: Players moving pieces
- `GAME_OVER`: Game has ended

#### Board Representation
The board is represented as an array of 9 positions:
```typescript
type BoardState = Player[]; // [null, 'X', 'O', null, null, ...]
type Player = 'X' | 'O' | null;
```

#### Move Validation
Moves are validated based on:
1. Current game phase
2. Piece ownership
3. Adjacency rules
4. Empty position requirement

### Key Functions

#### checkWinner()
Checks if a player has won by examining all possible winning patterns:
```typescript
function checkWinner(board: BoardState): { winner: Player; winningPattern: number[] | null } {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningPattern: pattern };
    }
  }
  
  return { winner: null, winningPattern: null };
}
```

#### getPossibleMoves()
Calculates valid moves for a player based on current board state and phase:
```typescript
function getPossibleMoves(
  board: BoardState, 
  player: Player, 
  phase: GamePhase
): Array<{ from: number | null, to: number }> {
  // Implementation varies by phase
}
```

## AI Implementation

### Minimax Algorithm

The AI uses the minimax algorithm with alpha-beta pruning for optimal moves:

#### Core Algorithm
```typescript
private minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  currentPhase: GamePhase
): number {
  // Base cases: win/loss/draw or depth limit
  // Recursive case: evaluate all possible moves
  // Alpha-beta pruning for optimization
}
```

#### Difficulty Levels
Different difficulty levels are implemented by adjusting the search depth:
- Easy: Depth limit of 4
- Medium: Depth limit of 6
- Hard: Depth limit of 8

#### Evaluation Function
The AI evaluates board positions based on:
1. Immediate winning opportunities (+1000)
2. Two-in-a-row formations (+100)
3. Potential lines (+10)
4. Center control bonuses (+15)
5. Blocking opponent threats (-500 for two-in-a-row)
6. Preventing opponent opportunities (-5)

## UI/UX Design

### Design Principles

1. **Clean and Minimal**: Following NYT Games aesthetic with ample whitespace
2. **Responsive**: Works on mobile and desktop devices
3. **Intuitive**: Clear visual feedback for interactions
4. **Accessible**: Good contrast and readable text
5. **Consistent**: Unified design language throughout

### Visual Elements

#### Color Scheme
- Primary: Blue (#2563EB) for player X
- Secondary: Red (#DC2626) for player O
- Background: Light gray gradient
- Board: White with gray accents
- Highlights: Amber/Yellow for selections and possible moves

#### Typography
- Sans-serif font stack for readability
- Clear hierarchy with heading and body text sizes
- Bold weights for important information

#### SVG Graphics
- Vector-based board for crisp rendering
- Scalable elements that work on all devices
- Smooth animations for interactions

### UX Features

#### Visual Feedback
- Selected pieces highlighted with yellow border
- Possible moves indicated with light yellow circles
- Winning pieces highlighted with gold borders
- Hover effects on interactive elements

#### Animations
- Coin toss spinning animation
- Smooth transitions between states
- Scale effects for important notifications

#### Responsive Design
- Flexible layout that adapts to screen size
- Touch-friendly targets for mobile devices
- Appropriate spacing and sizing for all viewports

## State Management

### Zustand Implementation

The game now uses Zustand for centralized state management, which provides a simpler and more performant solution than React Context:

```typescript
import { create } from 'zustand';

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
  
  // Actions implementation
  makeMove: (index: number) => set((state) => {
    // Implementation details...
  }),
  
  selectCell: (index: number) => set((state) => {
    // Implementation details...
  }),
  
  resetGame: () => set({
    board: createEmptyBoard(),
    currentPlayer: 'X',
    phase: 'COIN_TOSS',
    winner: null,
    winningPattern: null,
    selectedCell: null,
    playerPieces: { X: 3, O: 3 },
    mode: 'singleplayer',
  }),
  
  // Other actions...
}));
```

### Benefits of Using Zustand
1. **Simpler API**: Less boilerplate compared to React Context + useReducer
2. **Better Performance**: Fine-grained reactivity with automatic memoization
3. **Easier Testing**: Store can be imported and tested directly
4. **DevTools Support**: Built-in Redux DevTools integration
5. **Middleware Support**: Easy to add logging, persistence, etc.
```


### Side Effects

AI moves are handled through useEffect hooks that trigger when it becomes the AI's turn:

```typescript
React.useEffect(() => {
  if (mode === 'singleplayer' && state.currentPlayer === 'O' && state.phase !== 'GAME_OVER') {
    // Trigger AI move after delay
  }
}, [state, mode]);
```

## Deployment

### Build Process

The game can be built and deployed using standard Next.js commands:

```bash
npm run build
npm run start
```

### Hosting Options

1. **Vercel**: Recommended for Next.js applications
2. **Netlify**: Alternative hosting platform
3. **Self-hosted**: Can be deployed to any Node.js server

### Performance Considerations

1. **Code Splitting**: Next.js automatically splits code for faster loading
2. **Static Generation**: Most pages are statically generated for performance
3. **Optimized Assets**: SVG graphics and minimal dependencies
4. **Caching**: Proper cache headers for static assets

### Browser Support

The game supports modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- SVG rendering
- React 18+

## Conclusion

This Tapatan implementation combines traditional game design principles with modern web development practices. The architecture is scalable, maintainable, and provides an excellent user experience while staying true to the original game's rules and spirit.

The use of Zustand for state management, TypeScript for type safety, and Tailwind CSS for styling creates a robust foundation that can be easily extended or modified. The AI implementation using the minimax algorithm provides challenging gameplay at multiple difficulty levels. Zustand offers several advantages over React Context including reduced boilerplate, better performance with fine-grained reactivity, and easier testing capabilities.