class TicTicTacToe {
    constructor() {
        this.mainBoard = Array(9).fill(null);
        this.innerBoards = Array(9).fill().map(() => Array(9).fill(null));
        this.currentPlayer = 'X';
        this.activeInnerBoard = null; // Which inner board is active (0-8 or null for any)
        this.gameOver = false;
        this.winner = null;
        this.gameMode = 'one-player'; // 'one-player' or 'two-player'
        this.difficulty = 'easy'; // 'easy', 'medium', 'hard', 'impossible'
    }

    // Set game mode
    setGameMode(mode) {
        this.gameMode = mode;
    }

    // Set AI difficulty
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    // Reset the game
    resetGame() {
        this.mainBoard = Array(9).fill(null);
        this.innerBoards = Array(9).fill().map(() => Array(9).fill(null));
        this.currentPlayer = 'X';
        this.activeInnerBoard = null;
        this.gameOver = false;
        this.winner = null;
    }

    // Make a move on an inner board
    makeMove(mainIndex, innerIndex) {
        // Check if game is over
        if (this.gameOver) {
            return false;
        }

        // Check if the main board position is already won
        if (this.mainBoard[mainIndex] !== null) {
            return false;
        }

        // Check if we're allowed to play on this inner board
        if (this.activeInnerBoard !== null && this.activeInnerBoard !== mainIndex) {
            return false;
        }

        // Check if the inner position is already taken
        if (this.innerBoards[mainIndex][innerIndex] !== null) {
            return false;
        }

        // Make the move
        this.innerBoards[mainIndex][innerIndex] = this.currentPlayer;

        // Check if the inner board is won
        const innerWinner = this.checkWinner(this.innerBoards[mainIndex]);
        if (innerWinner) {
            this.mainBoard[mainIndex] = innerWinner;
        } else if (this.isBoardFull(this.innerBoards[mainIndex])) {
            // If inner board is full with no winner, it remains null (draw)
        }

        // Set the next active inner board based on the inner position played
        this.activeInnerBoard = this.mainBoard[innerIndex] !== null ? null : innerIndex;

        // Check if the main game is won
        const mainWinner = this.checkWinner(this.mainBoard);
        if (mainWinner) {
            this.gameOver = true;
            this.winner = mainWinner;
        } else if (this.isBoardFull(this.mainBoard)) {
            this.gameOver = true;
            this.winner = 'draw';
        }

        // Switch player
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

        return true;
    }

    // Check if a board has a winner
    checkWinner(board) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return null;
    }

    // Check if a board is full
    isBoardFull(board) {
        return board.every(cell => cell !== null);
    }

    // Get valid moves for the current state
    getValidMoves() {
        const validMoves = [];

        if (this.gameOver) {
            return validMoves;
        }

        // If there's an active inner board
        if (this.activeInnerBoard !== null) {
            // If the active inner board is already won, there are no valid moves
            if (this.mainBoard[this.activeInnerBoard] !== null) {
                return validMoves;
            }

            // Add all empty cells in the active inner board
            for (let i = 0; i < 9; i++) {
                if (this.innerBoards[this.activeInnerBoard][i] === null) {
                    validMoves.push({ mainIndex: this.activeInnerBoard, innerIndex: i });
                }
            }
        } else {
            // If any inner board can be played
            for (let mainIndex = 0; mainIndex < 9; mainIndex++) {
                // Skip if the main board position is already won
                if (this.mainBoard[mainIndex] !== null) {
                    continue;
                }

                // Add all empty cells in this inner board
                for (let innerIndex = 0; innerIndex < 9; innerIndex++) {
                    if (this.innerBoards[mainIndex][innerIndex] === null) {
                        validMoves.push({ mainIndex, innerIndex });
                    }
                }
            }
        }

        return validMoves;
    }

    // Get the current game state
    getGameState() {
        return {
            mainBoard: [...this.mainBoard],
            innerBoards: this.innerBoards.map(board => [...board]),
            currentPlayer: this.currentPlayer,
            activeInnerBoard: this.activeInnerBoard,
            gameOver: this.gameOver,
            winner: this.winner,
            gameMode: this.gameMode,
            difficulty: this.difficulty
        };
    }
}

// Export the game class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TicTicTacToe;
}
