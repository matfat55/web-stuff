import { GameBoard } from './gameBoard.js';
import { AI } from './ai.js';

class Game {
    constructor() {
        this.gameBoard = new GameBoard();
        this.ai = new AI();
        this.currentPlayer = 'X';
        this.gameMode = '2p';
        this.difficulty = 'easy';
        this.isAITurn = false;

        this.initializeElements();
        this.bindEvents();
        this.setupGame();
    }

    initializeElements() {
        this.gameModeSelect = document.getElementById('gameMode');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameButton = document.getElementById('newGame');
        this.statusMessage = document.getElementById('statusMessage');
    }

    bindEvents() {
        this.gameModeSelect.addEventListener('change', () => {
            this.gameMode = this.gameModeSelect.value;
            this.difficultySelect.disabled = this.gameMode === '2p';
            this.setupGame();
        });

        this.difficultySelect.addEventListener('change', () => {
            this.difficulty = this.difficultySelect.value;
        });

        this.newGameButton.addEventListener('click', () => this.setupGame());
    }

    setupGame() {
        this.gameBoard.reset();
        this.currentPlayer = 'X';
        this.isAITurn = false;
        this.updateStatus();
    }

    updateStatus() {
        const winner = this.gameBoard.checkWinner();
        if (winner) {
            this.statusMessage.textContent = `Player ${winner} wins!`;
        } else if (this.gameBoard.isBoardFull()) {
            this.statusMessage.textContent = "It's a draw!";
        } else {
            this.statusMessage.textContent = `Player ${this.currentPlayer}'s turn`;
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.isAITurn = this.gameMode === 'ai' && this.currentPlayer === 'O';
        this.updateStatus();

        if (this.isAITurn) {
            this.makeAIMove();
        }
    }

    async makeAIMove() {
        const move = await this.ai.getMove(
            this.gameBoard.getGameState(),
            this.difficulty
        );
        
        if (move) {
            const [outerIndex, innerIndex] = move;
            this.gameBoard.makeMove(outerIndex, innerIndex, this.currentPlayer);
            this.switchPlayer();
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});