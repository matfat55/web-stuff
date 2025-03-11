class TicTicTacToeAI {
    constructor(game) {
        this.game = game;
    }

    // Make a move based on the current difficulty
    makeMove() {
        if (this.game.gameOver || this.game.currentPlayer !== 'O') {
            return false;
        }

        const difficulty = this.game.difficulty;
        let move;

        switch (difficulty) {
            case 'easy':
                move = this.makeEasyMove();
                break;
            case 'medium':
                move = this.makeMediumMove();
                break;
            case 'hard':
                move = this.makeHardMove();
                break;
            case 'impossible':
                move = this.makeImpossibleMove();
                break;
            default:
                move = this.makeEasyMove();
        }

        if (move) {
            return this.game.makeMove(move.mainIndex, move.innerIndex);
        }

        return false;
    }

    // Easy: Random valid move
    makeEasyMove() {
        const validMoves = this.game.getValidMoves();
        if (validMoves.length === 0) {
            return null;
        }
        
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    // Medium: 50% chance of making a smart move, 50% random
    makeMediumMove() {
        if (Math.random() < 0.5) {
            return this.makeHardMove();
        } else {
            return this.makeEasyMove();
        }
    }

    // Hard: Prioritize winning inner boards and blocking opponent wins
    makeHardMove() {
        const validMoves = this.game.getValidMoves();
        if (validMoves.length === 0) {
            return null;
        }

        // Check if we can win any inner board
        for (const move of validMoves) {
            // Make a hypothetical move
            const { mainIndex, innerIndex } = move;
            const innerBoard = [...this.game.innerBoards[mainIndex]];
            innerBoard[innerIndex] = 'O';
            
            // Check if this move would win the inner board
            if (this.game.checkWinner(innerBoard) === 'O') {
                return move;
            }
        }

        // Check if we need to block opponent from winning an inner board
        for (const move of validMoves) {
            // Make a hypothetical move for the opponent
            const { mainIndex, innerIndex } = move;
            const innerBoard = [...this.game.innerBoards[mainIndex]];
            innerBoard[innerIndex] = 'X';
            
            // Check if opponent would win with this move
            if (this.game.checkWinner(innerBoard) === 'X') {
                return move;
            }
        }

        // Prefer center of active inner board
        for (const move of validMoves) {
            if (move.innerIndex === 4) {
                return move;
            }
        }

        // Prefer corners of active inner board
        const corners = [0, 2, 6, 8];
        const cornerMoves = validMoves.filter(move => corners.includes(move.innerIndex));
        if (cornerMoves.length > 0) {
            return cornerMoves[Math.floor(Math.random() * cornerMoves.length)];
        }

        // Otherwise, make a random move
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    // Impossible: Use minimax algorithm for optimal play
    makeImpossibleMove() {
        const validMoves = this.game.getValidMoves();
        if (validMoves.length === 0) {
            return null;
        }

        // For performance reasons, if there are too many valid moves, use the hard strategy
        if (validMoves.length > 20) {
            return this.makeHardMove();
        }

        let bestScore = -Infinity;
        let bestMove = null;

        // Try each valid move
        for (const move of validMoves) {
            // Create a deep copy of the game state
            const gameCopy = new TicTicTacToe();
            gameCopy.mainBoard = [...this.game.mainBoard];
            gameCopy.innerBoards = this.game.innerBoards.map(board => [...board]);
            gameCopy.currentPlayer = this.game.currentPlayer;
            gameCopy.activeInnerBoard = this.game.activeInnerBoard;
            gameCopy.gameOver = this.game.gameOver;
            gameCopy.winner = this.game.winner;

            // Make the move on the copy
            gameCopy.makeMove(move.mainIndex, move.innerIndex);
            
            // Evaluate the move using minimax
            const score = this.minimax(gameCopy, 3, false);
            
            // Update best move if this is better
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    // Minimax algorithm for evaluating game states
    minimax(game, depth, isMaximizing) {
        // Terminal conditions
        if (game.gameOver || depth === 0) {
            return this.evaluateBoard(game);
        }

        const validMoves = game.getValidMoves();
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            
            for (const move of validMoves) {
                // Create a deep copy of the game state
                const gameCopy = new TicTicTacToe();
                gameCopy.mainBoard = [...game.mainBoard];
                gameCopy.innerBoards = game.innerBoards.map(board => [...board]);
                gameCopy.currentPlayer = game.currentPlayer;
                gameCopy.activeInnerBoard = game.activeInnerBoard;
                gameCopy.gameOver = game.gameOver;
                gameCopy.winner = game.winner;

                // Make the move on the copy
                gameCopy.makeMove(move.mainIndex, move.innerIndex);
                
                // Recursively evaluate
                const score = this.minimax(gameCopy, depth - 1, false);
                bestScore = Math.max(score, bestScore);
            }
            
            return bestScore;
        } else {
            let bestScore = Infinity;
            
            for (const move of validMoves) {
                // Create a deep copy of the game state
                const gameCopy = new TicTicTacToe();
                gameCopy.mainBoard = [...game.mainBoard];
                gameCopy.innerBoards = game.innerBoards.map(board => [...board]);
                gameCopy.currentPlayer = game.currentPlayer;
                gameCopy.activeInnerBoard = game.activeInnerBoard;
                gameCopy.gameOver = game.gameOver;
                gameCopy.winner = game.winner;

                // Make the move on the copy
                gameCopy.makeMove(move.mainIndex, move.innerIndex);
                
                // Recursively evaluate
                const score = this.minimax(gameCopy, depth - 1, true);
                bestScore = Math.min(score, bestScore);
            }
            
            return bestScore;
        }
    }

    // Evaluate the board state
    evaluateBoard(game) {
        // If game is over, return a high/low score
        if (game.gameOver) {
            if (game.winner === 'O') return 1000;
            if (game.winner === 'X') return -1000;
            return 0; // Draw
        }

        // Count how many inner boards each player has won
        let score = 0;
        for (let i = 0; i < 9; i++) {
            if (game.mainBoard[i] === 'O') score += 10;
            if (game.mainBoard[i] === 'X') score -= 10;
        }

        // Evaluate potential winning patterns on the main board
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            // Count O's and X's in each winning pattern
            let oCount = 0, xCount = 0;
            
            if (game.mainBoard[a] === 'O') oCount++;
            if (game.mainBoard[b] === 'O') oCount++;
            if (game.mainBoard[c] === 'O') oCount++;
            
            if (game.mainBoard[a] === 'X') xCount++;
            if (game.mainBoard[b] === 'X') xCount++;
            if (game.mainBoard[c] === 'X') xCount++;
            
            // Adjust score based on potential winning patterns
            if (oCount > 0 && xCount === 0) score += oCount * 3;
            if (xCount > 0 && oCount === 0) score -= xCount * 3;
        }

        return score;
    }
}

// Export the AI class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TicTicTacToeAI;
}
