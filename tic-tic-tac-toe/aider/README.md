# Tic-Tic-Tac-Toe

A recursive version of Tic-Tac-Toe where each square on the main board contains another complete game of Tic-Tac-Toe.

## How to Play

### Basic Rules

1. The game consists of a 3x3 main board, where each cell contains another 3x3 inner board.
2. Players take turns placing their mark (X or O) on an inner board.
3. To win a cell on the main board, a player must win the inner Tic-Tac-Toe game in that cell.
4. The first player to win three cells in a row on the main board (horizontally, vertically, or diagonally) wins the game.
5. If an inner game ends in a draw, nobody wins that cell on the main board.

### Game Flow

1. The first player can place their mark on any inner board.
2. The position where a player places their mark on an inner board determines which main board cell the next player must play in.
   - For example, if Player X places their mark in the top-right corner of an inner board, Player O must play in the top-right cell of the main board.
3. If a player is sent to a cell that has already been won or is full (drawn), they can choose any available cell on the main board.

## Game Modes

### One Player

Play against the computer AI with four difficulty levels:

- **Easy**: The AI makes random moves.
- **Medium**: The AI has a 50% chance of making a strategic move.
- **Hard**: The AI prioritizes winning inner boards and blocking your wins.
- **Impossible**: The AI uses advanced strategies to make optimal moves.

### Two Player

Play against a friend on the same device, taking turns.

## Strategy Tips

1. Think recursively - winning inner boards is important, but always keep the main board in mind.
2. Pay attention to where your move will send your opponent.
3. Try to send your opponent to boards that are already won or have limited good moves.
4. In the early game, try to win the center cell of the main board as it's part of more winning combinations.

Enjoy the game!
