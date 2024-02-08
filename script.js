document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.column');
    const gameStatus = document.getElementById('gameStatus');
    let currentPlayer = 1; // 1: Human, 2: Computer
    const board = Array(7).fill().map(() => Array(6).fill(0));
    let gameActive = true;

    function displayStatus(message) {
        gameStatus.textContent = message;
    }

    function checkLine(a, b, c, d) {
        return (a !== 0) && (a === b) && (a === c) && (a === d);
    }
    function checkForWin() {
        // Yatay kontrol
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 4; col++) {
                if (checkLine(board[col][row], board[col + 1][row], board[col + 2][row], board[col + 3][row])) {
                    return true;
                }
            }
        }

        // Dikey kontrol
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row < 3; row++) {
                if (checkLine(board[col][row], board[col][row + 1], board[col][row + 2], board[col][row + 3])) {
                    return true;
                }
            }
        }

        // Çapraz kontrol (sol üstten sağ alta)
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 3; row++) {
                if (checkLine(board[col][row], board[col + 1][row + 1], board[col + 2][row + 2], board[col + 3][row + 3])) {
                    return true;
                }
            }
        }

        // Çapraz kontrol (sağ üstten sol alta)
        for (let col = 0; col < 4; col++) {
            for (let row = 3; row < 6; row++) {
                if (checkLine(board[col][row], board[col + 1][row - 1], board[col + 2][row - 2], board[col + 3][row - 3])) {
                    return true;
                }
            }
        }

        return false;
    }

   
    function updateBoard(colIndex, rowIndex) {
        board[colIndex][rowIndex] = currentPlayer;
        if (checkForWin()) {
            gameActive = false;
            displayStatus(`Player ${currentPlayer} wins!`);
            return;
        }
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        if (currentPlayer === 2 && gameActive) {
            displayStatus("Computer's turn");
            setTimeout(computerMove, 500); // Bilgisayarın hamlesi için bir gecikme ekle
        } else if (gameActive) {
            displayStatus("Player's turn");
        }
    }

    function nextEmptyRow(colIndex) {
        const column = board[colIndex];
        for (let i = 5; i >= 0; i--) {
            if (column[i] === 0) {
                return i;
            }
        }
        return -1;
    }

    function dropTokenToBottom(colIndex) {
        const rowIndex = nextEmptyRow(colIndex);
        if (rowIndex !== -1) {
            const cell = document.getElementById(`${colIndex}-${rowIndex}`);
            cell.classList.add(`player${currentPlayer}`);
            updateBoard(colIndex, rowIndex);
        }
    }

    function computerMove() {
        let colIndex;
        let found = false;

        while (!found && gameActive) {
            colIndex = Math.floor(Math.random() * 7);
            if (nextEmptyRow(colIndex) !== -1) {
                found = true;
            }
        }

        if (gameActive) {
            dropTokenToBottom(colIndex);
        }
    }

    function resetGame() {
        board.forEach(column => column.fill(0));
        currentPlayer = 1;
        gameActive = true;
        displayStatus("Player's turn");
        columns.forEach(column => {
            for (let i = 0; i < column.children.length; i++) {
                column.children[i].classList.remove('player1', 'player2');
            }
        });
    }

    columns.forEach((column, colIndex) => {
        column.addEventListener('click', () => {
            if (currentPlayer === 1 && gameActive) {
                dropTokenToBottom(colIndex);
            }
        });
    });

    document.getElementById('resetButton').addEventListener('click', resetGame);

    displayStatus("Player's turn");
});