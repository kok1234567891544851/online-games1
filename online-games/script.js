function loadGame(game) {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    if (game === 'tictactoe') {
        gameContainer.innerHTML = `
            <h2>Крестики-Нолики</h2>
            <div id="tictactoe-board">
                <div class="row">
                    <div class="cell" data-index="0"></div>
                    <div class="cell" data-index="1"></div>
                    <div class="cell" data-index="2"></div>
                </div>
                <div class="row">
                    <div class="cell" data-index="3"></div>
                    <div class="cell" data-index="4"></div>
                    <div class="cell" data-index="5"></div>
                </div>
                <div class="row">
                    <div class="cell" data-index="6"></div>
                    <div class="cell" data-index="7"></div>
                    <div class="cell" data-index="8"></div>
                </div>
            </div>
            <button onclick="resetTicTacToe()">Сбросить</button>
        `;
        initializeTicTacToe();
    } else if (game === 'snake') {
        gameContainer.innerHTML = `
            <h2>Змейка</h2>
            <canvas id="snake-canvas" width="400" height="400"></canvas>
            <button onclick="resetSnake()">Сбросить</button>
        `;
        initializeSnake();
    }
}

// Крестики-Нолики
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];

function initializeTicTacToe() {
    const cells = document.querySelectorAll('#tictactoe-board .cell');
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] === '') {
        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        if (checkWin()) {
            alert(`Игрок ${currentPlayer} выиграл!`);
            resetTicTacToe();
            return;
        }
        if (board.every(cell => cell !== '')) {
            alert('Ничья!');
            resetTicTacToe();
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // строки
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // столбцы
        [0, 4, 8], [2, 4, 6]             // диагонали
    ];
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === currentPlayer);
    });
}

function resetTicTacToe() {
    board = ['', '', '', '', '', '', '', '', ''];
    const cells = document.querySelectorAll('#tictactoe-board .cell');
    cells.forEach(cell => {
        cell.textContent = '';
    });
    currentPlayer = 'X';
}

// Змейка
let snake;
let food;
let direction;
let score;
let gameLoop;

function initializeSnake() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');

    snake = [{ x: 10, y: 10 }];
    food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    direction = { x: 0, y: 0 };
    score = 0;

    document.addEventListener('keydown', changeDirection);
    gameLoop = setInterval(() => updateGame(ctx, canvas), 100);
}

function updateGame(ctx, canvas) {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameLoop);
        alert(`Игра окончена! Счет: ${score}`);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    } else {
        snake.pop();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'lime';
    snake.forEach(segment => ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20));
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (key === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
}

function resetSnake() {
    clearInterval(gameLoop);
    initializeSnake();
}