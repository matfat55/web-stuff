export class AI {
    constructor() {
        this.player = 'O';
        this.opponent = 'X';
    }

    async getMove(gameState, difficulty) {
        switch (difficulty) {
            case 'impossible':
                return this.getBestMove(gameState);
            case 'hard':
                return Math.random() < 0.8 ? this.getBestMove(gameState) : this.getMediumMove(gameState);
            case 'medium':
                return this.getMediumMove(gameState);
            case 'easy':
            default:
                return this.getRandomMove(gameState);
        }
    }

    getRandomMove(gameState) {
        const { boardState, currentOuterCell } = gameState;
        const validMoves = this.getValidMoves(boardState, currentOuterCell);
        
        if (validMoves.length === 0) return null;
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    getMediumMove(gameState) {
        const { boardState, currentOuterCell } = gameState;
        const validMoves = this.getValidMoves(boardState, currentOuterCell);
        
        if (validMoves.length === 0) return null;

        // Try to win inner boards
        for (const [outerIndex, innerIndex] of validMoves) {
            if (this.willWinInnerBoard(boardState[outerIndex], innerIndex, this.player)) {
                return [outerIndex, innerIndex];
            }
        }

        // Block opponent's winning moves
        for (const [outerIndex, innerIndex] of validMoves) {
            if (this.willWinInnerBoard(boardState[outerIndex], innerIndex, this.opponent)) {
                return [outerIndex, innerIndex];
            }
        }

        // Prefer center and corners
        const preferredMoves = validMoves.filter(([_, innerIndex]) => 
            [0, 2, 4, 6, 8].includes(innerIndex)
        );

        if (preferredMoves.length > 0) {
            return preferredMoves[Math.floor(Math.random() * preferredMoves.length)];
        }

        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    getBestMove(gameState) {
        const { boardState, currentOuterCell } = gameState;
        const validMoves = this.getValidMoves(boardState, currentOuterCell);
        
        if (validMoves.length === 0) return null;

        let bestScore = -Infinity;
        let bestMove = validMoves[0];

        for (const [outerIndex, innerIndex] of validMoves) {
            // Make the move
            const newBoardState = this.deepCloneBoard(boardState);
            newBoardState[outerIndex][innerIndex] = this.player;

            // Calculate score using minimax
            const score = this.minimax(newBoardState, 3, false, outerIndex);

            // Undo the move
            newBoardState[outerIndex][innerIndex] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = [outerIndex, innerIndex];
            }
        }

        return bestMove;
    }

    minimax(boardState, depth, isMaximizing, lastMove) {
        if (depth === 0) {
            return this.evaluateBoard(boardState);
        }

        const validMoves = this.getValidMoves(boardState, lastMove);
        if (validMoves.length === 0) {
            return this.evaluateBoard(boardState);
        }

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (const [outerIndex, innerIndex] of validMoves) {
                boardState[outerIndex][innerIndex] = this.player;
                const score = this.minimax(boardState, depth - 1, false, innerIndex);
                boardState[outerIndex][innerIndex] = null;
                maxScore = Math.max(maxScore, score);
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (const [outerIndex, innerIndex] of validMoves) {
                boardState[outerIndex][innerIndex] = this.opponent;
                const score = this.minimax(boardState, depth - 1, true, innerIndex);
                boardState[outerIndex][innerIndex] = null;
                minScore = Math.min(minScore, score);
            }
            return minScore;
        }
    }

    evaluateBoard(boardState) {
        let score = 0;
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        // Evaluate each inner board
        for (let i = 0; i < 9; i++) {
            score += this.evaluateInnerBoard(boardState[i]) * 10;
        }

        // Evaluate potential winning combinations
        for (const line of lines) {
            const [a, b, c] = line;
            score += this.evaluateLine(boardState, a, b, c);
        }

        return score;
    }

    evaluateInnerBoard(board) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        let score = 0;
        for (const line of lines) {
            const [a, b, c] = line;
            score += this.evaluateLine(board, a, b, c);
        }
        return score;
    }

    evaluateLine(board, a, b, c) {
        const line = [board[a], board[b], board[c]];
        const playerCount = line.filter(cell => cell === this.player).length;
        const opponentCount = line.filter(cell => cell === this.opponent).length;
        const emptyCount = line.filter(cell => cell === null).length;

        if (playerCount === 3) return 100;
        if (opponentCount === 3) return -100;
        if (playerCount === 2 && emptyCount === 1) return 10;
        if (opponentCount === 2 && emptyCount === 1) return -10;
        if (playerCount === 1 && emptyCount === 2) return 1;
        if (opponentCount === 1 && emptyCount === 2) return -1;
        return 0;
    }

    getValidMoves(boardState, currentOuterCell) {
        const moves = [];
        const outerIndices = currentOuterCell !== null ? [currentOuterCell] : [...Array(9).keys()];

        for (const outerIndex of outerIndices) {
            // Skip if the outer cell is won
            if (this.isInnerBoardWon(boardState[outerIndex])) continue;

            // Add all empty cells in this inner board
            for (let innerIndex = 0; innerIndex < 9; innerIndex++) {
                if (boardState[outerIndex][innerIndex] === null) {
                    moves.push([outerIndex, innerIndex]);
                }
            }
        }

        return moves;
    }

    willWinInnerBoard(board, index, player) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const line of lines) {
            if (!line.includes(index)) continue;
            const otherIndices = line.filter(i => i !== index);
            if (board[otherIndices[0]] === player && board[otherIndices[1]] === player) {
                return true;
            }
        }
        return false;
    }

    isInnerBoardWon(board) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return lines.some(([a, b, c]) => 
            board[a] && board[a] === board[b] && board[a] === board[c]
        );
    }

    deepCloneBoard(board) {
        return JSON.parse(JSON.stringify(board));
    }
}