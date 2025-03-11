export class GameBoard {
    constructor() {
        this.mainBoard = document.querySelector('.main-board');
        this.innerBoardTemplate = document.getElementById('innerBoardTemplate');
        this.outerCells = Array.from(document.querySelectorAll('.outer-cell'));
        this.boardState = this.initializeBoardState();
        this.currentOuterCell = null;
        
        this.setupBoards();
        this.bindEvents();
    }

    initializeBoardState() {
        // Create a 9x9 array representing outer and inner boards
        return Array(9).fill(null).map(() => Array(9).fill(null));
    }

    setupBoards() {
        this.outerCells.forEach(cell => {
            const innerBoard = this.innerBoardTemplate.content.cloneNode(true);
            cell.appendChild(innerBoard);
        });
    }

    bindEvents() {
        this.mainBoard.addEventListener('click', (e) => {
            const innerCell = e.target.closest('.inner-cell');
            const outerCell = e.target.closest('.outer-cell');

            if (innerCell && outerCell) {
                const outerIndex = parseInt(outerCell.dataset.index);
                const innerIndex = parseInt(innerCell.dataset.cell);
                this.handleMove(outerIndex, innerIndex);
            }
        });
    }

    handleMove(outerIndex, innerIndex) {
        // Don't allow moves in completed outer cells
        if (this.isOuterCellWon(outerIndex)) {
            return false;
        }

        // If there's a current active cell, only allow moves in it
        if (this.currentOuterCell !== null && this.currentOuterCell !== outerIndex) {
            return false;
        }

        // Check if the cell is already taken
        if (this.boardState[outerIndex][innerIndex] !== null) {
            return false;
        }

        const currentPlayer = document.getElementById('statusMessage').textContent.includes('X') ? 'X' : 'O';
        return this.makeMove(outerIndex, innerIndex, currentPlayer);
    }

    makeMove(outerIndex, innerIndex, player) {
        // Update board state
        this.boardState[outerIndex][innerIndex] = player;

        // Update UI
        const outerCell = this.outerCells[outerIndex];
        const innerCell = outerCell.querySelector(`[data-cell="${innerIndex}"]`);
        innerCell.textContent = player;
        innerCell.classList.add(player.toLowerCase());

        // Check if the inner board is won
        if (this.checkInnerWinner(outerIndex)) {
            outerCell.classList.add(`won-${player.toLowerCase()}`);
        }

        // Determine next active cell
        this.updateActiveCell(innerIndex);

        return true;
    }

    updateActiveCell(innerIndex) {
        // Remove active class from all cells
        this.outerCells.forEach(cell => {
            cell.classList.remove('active', 'inactive');
        });

        // If the target cell is already won or full, allow any cell
        if (this.isOuterCellWon(innerIndex) || this.isInnerBoardFull(innerIndex)) {
            this.currentOuterCell = null;
            this.outerCells.forEach(cell => {
                if (!this.isOuterCellWon(parseInt(cell.dataset.index))) {
                    cell.classList.add('active');
                }
            });
        } else {
            // Set the target cell as active
            this.currentOuterCell = innerIndex;
            this.outerCells[innerIndex].classList.add('active');
            this.outerCells.forEach((cell, index) => {
                if (index !== innerIndex) {
                    cell.classList.add('inactive');
                }
            });
        }
    }

    checkInnerWinner(outerIndex) {
        const board = this.boardState[outerIndex];
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return lines.some(line => {
            const [a, b, c] = line;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }

    checkWinner() {
        const outerBoard = this.outerCells.map((cell, index) => {
            if (cell.classList.contains('won-x')) return 'X';
            if (cell.classList.contains('won-o')) return 'O';
            return null;
        });

        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            if (outerBoard[a] && outerBoard[a] === outerBoard[b] && outerBoard[a] === outerBoard[c]) {
                return outerBoard[a];
            }
        }

        return null;
    }

    isOuterCellWon(index) {
        const cell = this.outerCells[index];
        return cell.classList.contains('won-x') || cell.classList.contains('won-o');
    }

    isInnerBoardFull(outerIndex) {
        return this.boardState[outerIndex].every(cell => cell !== null);
    }

    isBoardFull() {
        return this.outerCells.every((cell, index) => 
            this.isOuterCellWon(index) || this.isInnerBoardFull(index)
        );
    }

    getGameState() {
        return {
            boardState: this.boardState,
            currentOuterCell: this.currentOuterCell,
            outerWins: this.outerCells.map(cell => {
                if (cell.classList.contains('won-x')) return 'X';
                if (cell.classList.contains('won-o')) return 'O';
                return null;
            })
        };
    }

    reset() {
        // Clear board state
        this.boardState = this.initializeBoardState();
        this.currentOuterCell = null;

        // Reset UI
        this.outerCells.forEach(cell => {
            cell.classList.remove('won-x', 'won-o', 'active', 'inactive');
            const innerCells = cell.querySelectorAll('.inner-cell');
            innerCells.forEach(innerCell => {
                innerCell.textContent = '';
                innerCell.classList.remove('x', 'o');
            });
        });
    }
}