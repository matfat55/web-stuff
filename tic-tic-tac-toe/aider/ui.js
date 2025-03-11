document.addEventListener('DOMContentLoaded', () => {
    // Initialize game and AI
    const game = new TicTicTacToe();
    const ai = new TicTicTacToeAI(game);
    
    // DOM elements
    const statusMessage = document.getElementById('status-message');
    const onePlayerBtn = document.getElementById('one-player-btn');
    const twoPlayerBtn = document.getElementById('two-player-btn');
    const difficultySelection = document.getElementById('difficulty-selection');
    const easyBtn = document.getElementById('easy-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const hardBtn = document.getElementById('hard-btn');
    const impossibleBtn = document.getElementById('impossible-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const mainCells = document.querySelectorAll('.main-cell');
    
    // Create inner boards
    function createInnerBoards() {
        for (let mainIndex = 0; mainIndex < 9; mainIndex++) {
            const innerBoard = document.getElementById(`inner-board-${mainIndex}`);
            innerBoard.innerHTML = '';
            
            for (let innerIndex = 0; innerIndex < 9; innerIndex++) {
                const innerCell = document.createElement('div');
                innerCell.className = 'inner-cell';
                innerCell.dataset.mainIndex = mainIndex;
                innerCell.dataset.innerIndex = innerIndex;
                
                innerCell.addEventListener('click', () => {
                    handleCellClick(mainIndex, innerIndex);
                });
                
                innerBoard.appendChild(innerCell);
            }
        }
    }
    
    // Handle cell click
    function handleCellClick(mainIndex, innerIndex) {
        // Make move if valid
        const moveSuccessful = game.makeMove(mainIndex, innerIndex);
        
        if (moveSuccessful) {
            updateUI();
            
            // If game is in one-player mode and it's AI's turn
            if (game.gameMode === 'one-player' && game.currentPlayer === 'O' && !game.gameOver) {
                // Add a small delay for better UX
                setTimeout(() => {
                    ai.makeMove();
                    updateUI();
                }, 500);
            }
        }
    }
    
    // Update the UI based on game state
    function updateUI() {
        const gameState = game.getGameState();
        
        // Update main board
        for (let mainIndex = 0; mainIndex < 9; mainIndex++) {
            const mainCell = document.getElementById(`main-${mainIndex}`);
            const innerBoard = document.getElementById(`inner-board-${mainIndex}`);
            
            // Clear previous win classes
            mainCell.classList.remove('won-x', 'won-o');
            
            // Mark main cell if won
            if (gameState.mainBoard[mainIndex] === 'X') {
                mainCell.classList.add('won-x');
            } else if (gameState.mainBoard[mainIndex] === 'O') {
                mainCell.classList.add('won-o');
            }
            
            // Update inner cells
            const innerCells = innerBoard.querySelectorAll('.inner-cell');
            for (let innerIndex = 0; innerIndex < 9; innerIndex++) {
                const innerCell = innerCells[innerIndex];
                
                // Clear previous marks
                innerCell.classList.remove('x', 'o');
                innerCell.textContent = '';
                
                // Mark cell if played
                if (gameState.innerBoards[mainIndex][innerIndex] === 'X') {
                    innerCell.classList.add('x');
                    innerCell.textContent = 'X';
                } else if (gameState.innerBoards[mainIndex][innerIndex] === 'O') {
                    innerCell.classList.add('o');
                    innerCell.textContent = 'O';
                }
            }
            
            // Highlight active board
            if (gameState.activeInnerBoard === mainIndex) {
                mainCell.classList.add('active-board');
                mainCell.classList.remove('inactive-board');
            } else if (gameState.activeInnerBoard !== null) {
                mainCell.classList.remove('active-board');
                mainCell.classList.add('inactive-board');
            } else {
                // If any board can be played
                mainCell.classList.remove('inactive-board');
                
                // Only highlight boards that aren't already won
                if (gameState.mainBoard[mainIndex] === null) {
                    mainCell.classList.add('active-board');
                } else {
                    mainCell.classList.remove('active-board');
                }
            }
        }
        
        // Update status message
        if (gameState.gameOver) {
            if (gameState.winner === 'X') {
                statusMessage.textContent = 'Player X wins!';
            } else if (gameState.winner === 'O') {
                statusMessage.textContent = 'Player O wins!';
            } else {
                statusMessage.textContent = 'Game ended in a draw!';
            }
        } else {
            statusMessage.textContent = `Player ${gameState.currentPlayer}'s turn`;
            
            // Add more context about which board to play on
            if (gameState.activeInnerBoard !== null) {
                statusMessage.textContent += ` (play on highlighted board ${gameState.activeInnerBoard + 1})`;
            } else {
                statusMessage.textContent += ' (play on any available board)';
            }
        }
    }
    
    // Set up game mode buttons
    onePlayerBtn.addEventListener('click', () => {
        onePlayerBtn.classList.add('active');
        twoPlayerBtn.classList.remove('active');
        difficultySelection.style.display = 'block';
        game.setGameMode('one-player');
    });
    
    twoPlayerBtn.addEventListener('click', () => {
        twoPlayerBtn.classList.add('active');
        onePlayerBtn.classList.remove('active');
        difficultySelection.style.display = 'none';
        game.setGameMode('two-player');
    });
    
    // Set up difficulty buttons
    easyBtn.addEventListener('click', () => {
        easyBtn.classList.add('active');
        mediumBtn.classList.remove('active');
        hardBtn.classList.remove('active');
        impossibleBtn.classList.remove('active');
        game.setDifficulty('easy');
    });
    
    mediumBtn.addEventListener('click', () => {
        easyBtn.classList.remove('active');
        mediumBtn.classList.add('active');
        hardBtn.classList.remove('active');
        impossibleBtn.classList.remove('active');
        game.setDifficulty('medium');
    });
    
    hardBtn.addEventListener('click', () => {
        easyBtn.classList.remove('active');
        mediumBtn.classList.remove('active');
        hardBtn.classList.add('active');
        impossibleBtn.classList.remove('active');
        game.setDifficulty('hard');
    });
    
    impossibleBtn.addEventListener('click', () => {
        easyBtn.classList.remove('active');
        mediumBtn.classList.remove('active');
        hardBtn.classList.remove('active');
        impossibleBtn.classList.add('active');
        game.setDifficulty('impossible');
    });
    
    // New game button
    newGameBtn.addEventListener('click', () => {
        game.resetGame();
        updateUI();
    });
    
    // Initialize the game
    createInnerBoards();
    updateUI();
});
