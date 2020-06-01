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

    setPlayer(createUsernameInput.value);
    let player = getPlayer();

    if (!validateInput(player)) { return; }

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

    setPlayer(joinUsernameInput.value);
    let player = getPlayer();

    setPin(joinPinInput.value);
    let pin = getPin();

    if (!validateInput(player)) { return; }
    if (!validateInput(pin)) { return; }

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
    socketEmit('join:request', {pin: pin, player: player, symbol: symbol});
});

btnAccept.addEventListener('click', (evt) => {
    evt.preventDefault();

    hideOverlay(overlayPlayerJoined);
    setGameStateLabel('YOUR TURN');
    socketEmit('join:request:accepted', {pin: getPin(), player: getPlayer(), symbol: getPlayerSymbol()});
});

btnExit.addEventListener('click', (evt) => {
    evt.preventDefault();

    hideOverlay(overlayGameEnd);
    hideOverlay(gameScene);
    showOverlay(startScene);
});

socket.on('join:request', (data) => {
    setPlayerLabel('two', data.player);
    hideOverlay(overlayPin);
    showOverlay(overlayPlayerJoined);
    labelPlayerJoined.innerText = `${data.player} has joined`;
    console.log(data);
});

socket.on('join:request:accepted', (data) => {
    setPlayerLabel('one', data.player);
    labelGameMsg.innerText = `waiting for ${data.player}'s movement ..`;
    console.log(data);
});