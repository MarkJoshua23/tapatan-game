# Gemini Project Context: Tapatan Game

This document provides context for the AI agent to effectively assist in the development of this project.

## 1. Project Overview

This project is a web application for the classic Filipino game, **Tapatan**. The goal is to create a modern, playable, and visually appealing version of the game.

*   **Core Technologies:**
    *   **Framework:** Next.js
    *   **Styling:** Tailwind CSS
*   **Key Features:**
    *   **Single Player Mode:** Play against an AI opponent.
    *   **Multiplayer Mode:** "Pass-and-play" for two human players on the same device.
    *   **Responsive Design:** The app should be usable on various screen sizes.

## 2. Building and Running

This is a standard Next.js project.

*   **Install Dependencies:**
    ```bash
    npm install
    ```
*   **Run Development Server:**
    ```bash
    npm run dev
    ```
*   **Build for Production:**
    ```bash
    npm run build
    ```
*   **Run Production Server:**
    ```bash
    npm start
    ```

## 3. Development Conventions

*   **`context7` Usage:** Before implementing a feature that uses a package or installing a new package, use the `context7` tool to ensure the latest methods and best practices are being followed.
*   **Changelog:** Maintain a `changelog.md` file. Update it after each major task with a short, clear, and token-efficient summary of the changes.
*   **AI Model Preference:** Use smaller, faster models (like Flash) for API/data calls and more powerful models (like Pro) for complex code generation.

## 4. Detailed Development Plan

### Phase 1: Project Setup & Core UI

1.  **Initialize Project:** Set up a new Next.js project with Tailwind CSS.
2.  **Create `HomePage`:** A landing page with the title "Tapatan" and buttons for "Single Player" and "Multiplayer".
3.  **Create `GameBoard` Component:** A 3x3 grid with a minimal, flat, and playful design (thick, curved lines and dots).
4.  **Create `PlayerPiece` Component:** A simple, reusable colored circle.
5.  **Create `GameInfo` Component:** A display area for game status messages.
6.  **Create `ResetButton` Component:** A button to restart the game.

### Phase 2: Two-Player "Pass-and-Play" Logic

1.  **State Management:** Use React hooks to manage the board state, current player, and game phase.
2.  **Placement Logic:** Allow players to place their three pieces on empty dots in alternating turns.
3.  **Movement Logic:** After placement, allow players to select a piece and move it to a valid adjacent empty spot. Highlight valid moves on selection.
4.  **Win Condition:** After each move, check if the current player has formed a line of three.

### Phase 3: Single-Player vs. AI Logic

1.  **AI Core (Minimax):** Implement the Minimax algorithm, tailored for Tapatan, to determine the AI's best move.
2.  **Integrate AI:** Connect the Minimax function to the single-player game board. The AI will make its move after the player.
3.  **Turn Indication:** The `GameInfo` component will clearly indicate "Your Turn" or "AI's Turn".

### Phase 4: Routing & Final Polish

1.  **Routing:** Use the Next.js App Router for the following routes:
    *   `/`: The `HomePage`.
    *   `/single-player`: The AI game view.
    *   `/multiplayer`: The two-player game view.
2.  **Styling:** Finalize all styles with Tailwind CSS for a polished user experience.
