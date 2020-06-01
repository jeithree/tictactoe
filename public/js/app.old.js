let winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

let oppositePlayer;
let activePlayer;
let playerSymbol

squares.forEach((item) => {
    item.addEventListener('click', (evt) => {
        evt.preventDefault();

        if (item.classList.contains('x') || item.classList.contains('circle')) { return; }

        playerSymbol = document.querySelector('.symbol').innerText;

        item.innerText = playerSymbol;

        let squareClass = (playerSymbol === 'X') ? 'x' : 'circle';
        item.classList.add(squareClass);

        oppositePlayer = (playerSymbol === 'X') ? playerTwo : playerOne;
        activePlayer = (playerSymbol === 'X') ? playerOne : playerTwo;

        overlayGameMsg.classList.add('overlay-show');

        socket.emit(`player:movement`, {
            pin: pin,
            symbol: playerSymbol,
            position: item.dataset.position
        });

        document.querySelector('.game-state').innerText = 'WAITING';
        document.querySelector('.game-msg').innerText = `waiting for ${oppositePlayer}'s movement ..`;

        if (checkWin(squareClass)) {
            console.log(`${activePlayer} won`);
            document.querySelector('.game-state').innerText = 'FINISHED';
            overlayGameMsg.classList.remove('overlay-show');
            overlayGameEnded.classList.add('overlay-show');
            winnerMsg.innerText = `${activePlayer} won`;
        } else if (checkDraw()) {
            console.log('Its a draw');
            document.querySelector('.game-state').innerText = 'FINISHED';
            overlayGameMsg.classList.remove('overlay-show');
            overlayGameEnded.classList.add('overlay-show');
            winnerMsg.innerText = `It's a draw`;
        }
    });
});

function checkWin(currentClass) {
    return winningCombinations.some((combination) => {
        let result = combination.every((value) => { return squares[value].classList.contains(currentClass); });
        if (result) {
            combination.forEach((value) => { squares[value].classList.add('green'); })
            return result;
        }
        return result;
    });
}

function checkDraw() {
    return [...squares].every((square) => {
        return square.classList.contains('x') || square.classList.contains('circle');
    });
}

socket.on('game:movement', () => {
    socket.on(`player:movement:${pin}`, (data) => {
        document.querySelector('.game-state').innerText = 'YOUR TURN';
        overlayGameMsg.classList.remove('overlay-show');
        let squareToDrawOn = document.querySelectorAll(`[data-position="${data.position}"]`);
        let squareClass = (data.symbol === 'X') ? 'x' : 'circle';
        squareToDrawOn[0].classList.add(squareClass);
        squareToDrawOn[0].innerText = data.symbol;

        if (checkWin(squareClass)) {
            console.log(`${oppositePlayer} won`);
            document.querySelector('.game-state').innerText = 'FINISHED';
            overlayGameMsg.classList.remove('overlay-show');
            overlayGameEnded.classList.add('overlay-show');
            winnerMsg.innerText = `${oppositePlayer} won`;
        } else if (checkDraw()) {
            console.log('Its a draw');
            document.querySelector('.game-state').innerText = 'FINISHED';
            overlayGameMsg.classList.remove('overlay-show');
            overlayGameEnded.classList.add('overlay-show');
            winnerMsg.innerText = `It's a draw`;
        }
        console.log(data.symbol, data.position);
    });
});