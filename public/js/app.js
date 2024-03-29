btnCreate.addEventListener('click', (evt) => {
    evt.preventDefault();
    showOverlay(overlayCreate);
});

btnJoin.addEventListener('click', (evt) => {
    evt.preventDefault();
    showOverlay(overlayJoin);
});

btnCCancel.addEventListener('click', (evt) => {
    evt.preventDefault();
    hideOverlay(overlayCreate);
});

btnJCancel.addEventListener('click', (evt) => {
    evt.preventDefault();
    hideOverlay(overlayJoin);
});

btnCreateConfirm.addEventListener('click', (evt) => {
    evt.preventDefault();

    hideOverlay(overlayGameMsg);

    if (!validateInput(createUsernameInput)) { return; }

    setPlayerTurn('first');
    setPlayer(createUsernameInput.value);
    let player = getPlayer();

    hideOverlay(overlayCreate);
    hideOverlay(startScene);
    showOverlay(gameScene);
    setGameStateLabel('WAITING');
    setPlayerLabel('one', player);

    socketEmit('generate:pin', {player: player});
    socketOn(`${player}:pin`, (data) => {
        setPin(data.pin);
        let pin = getPin();
        setPinLabel(pin);

        showOverlay(overlayPin);
        setPlayerSymbol('X');
        let symbol = getPlayerSymbol();
        setPlayerSymbolLabel(symbol);

        socketEmit('join:game', {pin: pin});
        console.log(pin);
    });
});

btnJoinConfirm.addEventListener('click', (evt) => {
    evt.preventDefault();

    hideOverlay(overlayGameMsg);

    if (!validateInput(joinUsernameInput)) { return; }
    if (!validateInput(joinPinInput)) { return; }

    setPlayerTurn('second');
    setPlayer(joinUsernameInput.value);
    let player = getPlayer();

    setPin(joinPinInput.value.toUpperCase());
    let pin = getPin();

    hideOverlay(overlayJoin);
    hideOverlay(startScene);
    showOverlay(gameScene);
    setGameStateLabel('WAITING');
    setPlayerLabel('two', player);

    showOverlay(overlayGameMsg);
    labelGameMsg.innerText = 'Joining Game ...';

    setPlayerSymbol('O');
    let symbol = getPlayerSymbol();
    setPlayerSymbolLabel(symbol);

    socketEmit('join:game', {pin: pin});
    socketEmit('join:request', {
        pin: pin,
        player: player,
        symbol: symbol
    });
});

btnAccept.addEventListener('click', (evt) => {
    evt.preventDefault();

    hideOverlay(overlayPlayerJoined);
    setGameStateLabel('YOUR TURN');
    socketEmit('join:request:accepted', {
        pin: getPin(),
        player: getPlayer(),
        symbol: getPlayerSymbol()
    });
});

btnExit.addEventListener('click', (evt) => {
    evt.preventDefault();

    socketEmit('player:disconnected', {});

    setPlayerLabel('one', '');
    setPlayerLabel('two', '');
    clearCells();

    hideOverlay(overlayGameMsg);
    hideOverlay(overlayGameEnd);
    hideOverlay(gameScene);
    showOverlay(startScene);
});

cells.forEach((cell) => {
    cell.addEventListener('click', (evt) => {
        evt.preventDefault();

        if (cell.classList.contains('x') || cell.classList.contains('circle')) { return; }

        let playerSymbol = getPlayerSymbol();
        let currentClass = (playerSymbol === 'X') ? 'x' : 'circle';
        let oppositePlayer = (playerSymbol === 'X') ? getPlayerLabel('two') : getPlayerLabel('one');
        let activePlayer = (playerSymbol === 'X') ? getPlayerLabel('one') : getPlayerLabel('two');

        cell.innerText = playerSymbol;
        cell.classList.add(currentClass);

        socketEmit('player:movement', {
            pin: getPin(),
            player: getPlayer(),
            symbol: getPlayerSymbol(),
            position: cell.dataset.position
        });

        setGameStateLabel('WAITING');
        showOverlay(overlayGameMsg);
        labelGameMsg.innerText = `waiting for ${oppositePlayer}'s movement ..`;

        if (checkWin(currentClass)) {
            setGameStateLabel('FINISHED');
            hideOverlay(overlayGameMsg);
            showOverlay(overlayGameEnd);
            labelGameEnd.innerText = `${activePlayer} won`;
        } else if (checkDraw()) {
            setGameStateLabel('FINISHED');
            hideOverlay(overlayGameMsg);
            showOverlay(overlayGameEnd);
            labelGameEnd.innerText = `It's a draw`;
        }
    });
});

btnRestart.addEventListener('click', (evt) => {
    evt.preventDefault();
    hideOverlay(overlayGameEnd);

    socketEmit('play:again:request', {
        pin: getPin(),
        player: getPlayer(),
        symbol: getPlayerSymbol(),
    });

    let oppositePlayer = (getPlayerSymbol() === 'X') ? getPlayerLabel('two') : getPlayerLabel('one');

    showOverlay(overlayGameMsg);
    labelGameMsg.innerText = `waiting for ${oppositePlayer} to accept the play again request ..`;
});

btnPlayAgainAccept.addEventListener('click', (evt) => {
    evt.preventDefault();

    let playerSymbol = getPlayerSymbol();
    let playerTurn = getPlayerTurn();
    let oppositePlayer = (playerSymbol === 'X') ? getPlayerLabel('two') : getPlayerLabel('one');

    let playerNewSymbol = (playerSymbol === 'X') ? 'O' : 'X';
    let playerNewTurn = (playerTurn === 'first') ? 'second' : 'first';
    let PlayerNewNumber = (playerNewSymbol === 'X') ? 'one' : 'two';
    let PlayerOldNumber = (playerSymbol === 'X') ? 'one' : 'two';

    setPlayerSymbol(playerNewSymbol);
    setPlayerTurn(playerNewTurn);
    setPlayerLabel(PlayerNewNumber, getPlayer());
    setPlayerLabel(PlayerOldNumber, oppositePlayer);

    socketEmit('play:again:accepted', {
        pin: getPin(),
        player: getPlayer(),
        symbol: getPlayerSymbol(),
    });

    clearCells();

    setPlayerSymbolLabel(playerNewSymbol);
    hideOverlay(overlayPlayAgain);

    if (playerNewTurn === 'second') {
        setGameStateLabel('WAITING');
        showOverlay(overlayGameMsg);
        labelGameMsg.innerText = `waiting for ${oppositePlayer}'s movement ..`;
    } else if (playerNewTurn === 'first') {
        setGameStateLabel('YOUR TURN');
    }
});

btnPlayAgainDecline.addEventListener('click', (evt) => {
    evt.preventDefault();

    socketEmit('play:again:declined', {
        pin: getPin(),
        player: getPlayer(),
        symbol: getPlayerSymbol(),
    });

    hideOverlay(overlayPlayAgain);
    showOverlay(overlayGameMsg);
    labelGameMsg.innerText = `You declined the play again request`;
});

socketOn('join:request', (data) => {
    setPlayerLabel('two', data.player);
    hideOverlay(overlayPin);
    showOverlay(overlayPlayerJoined);
    labelPlayerJoined.innerText = `${data.player} has joined`;
    //console.log(data);
});

socketOn('join:request:accepted', (data) => {
    setGameStateLabel('YOU JOINED');
    setPlayerLabel('one', data.player);
    labelGameMsg.innerText = `waiting for ${data.player}'s movement ..`;
    //console.log(data);
});

socketOn('player:movement', (data) => {
    setGameStateLabel('YOUR TURN');
    hideOverlay(overlayGameMsg);

    let cellToDrawOn = document.querySelectorAll(`[data-position="${data.position}"]`);
    let currentClass = (data.symbol === 'X') ? 'x' : 'circle';

    cellToDrawOn[0].classList.add(currentClass);
    cellToDrawOn[0].innerText = data.symbol;

    if (checkWin(currentClass)) {
        setGameStateLabel('FINISHED');
        hideOverlay(overlayGameMsg);
        showOverlay(overlayGameEnd);
        labelGameEnd.innerText = `${data.player} won`;
    } else if (checkDraw()) {
        setGameStateLabel('FINISHED');
        hideOverlay(overlayGameMsg);
        showOverlay(overlayGameEnd);
        labelGameEnd.innerText = `It's a draw`;
    }
    console.log(data.symbol, data.position);
});

socketOn('play:again:request', (data) => {
    hideOverlay(overlayGameEnd);
    showOverlay(overlayPlayAgain);
    labelPlayAgain.innerText = `${data.player} wants to play again`;
});

socketOn('play:again:accepted', (data) => {
    let playerSymbol = getPlayerSymbol();
    let playerTurn = getPlayerTurn();

    let playerNewSymbol = (playerSymbol === 'X') ? 'O' : 'X';
    let playerNewTurn = (playerTurn === 'first') ? 'second' : 'first';
    let PlayerNewNumber = (playerNewSymbol === 'X') ? 'one' : 'two';
    let PlayerOldNumber = (playerSymbol === 'X') ? 'one' : 'two';

    setPlayerSymbol(playerNewSymbol);
    setPlayerTurn(playerNewTurn);
    setPlayerLabel(PlayerNewNumber, getPlayer());
    setPlayerLabel(PlayerOldNumber, data.player);

    clearCells();

    setPlayerSymbolLabel(playerNewSymbol);
    hideOverlay(overlayGameMsg);

    if (playerNewTurn === 'second') {
        setGameStateLabel('WAITING');
        showOverlay(overlayGameMsg);
        labelGameMsg.innerText = `waiting for ${data.player}'s movement ..`;
    } else if (playerNewTurn === 'first') {
        setGameStateLabel('YOUR TURN');
    }
});

socketOn('play:again:declined', (data) => {
    labelGameMsg.innerText = `${data.player} declined your play again request`;
});

socketOn('player:disconnected', () => {
    let oppositePlayer = (getPlayerSymbol() === 'X') ? getPlayerLabel('two') : getPlayerLabel('one');

    setGameStateLabel('FINISHED');
    hideOverlay(overlayGameMsg);
    showOverlay(overlayGameMsg);
    labelGameMsg.innerText = `player ${oppositePlayer} disconnected`;
});