windowHeight = window.innerHeight;

const socket = io();

const startScene = document.querySelector('.start-scene');
const gameScene = document.querySelector('.game-scene');

const btnCreate = document.querySelector('.btn-create');
const btnJoin = document.querySelector('.btn-join');

const createOverlay = document.querySelector('.overlay-create');
const joinOverlay = document.querySelector('.overlay-join');

const btnFormCreate = document.querySelector('.form-btn-create');
const btnCreateCancel = document.querySelector('.form-create-btn-cancel');
const btnFormJoin = document.querySelector('.form-btn-join');
const btnJoinCancel = document.querySelector('.form-join-btn-cancel');

const createUsernameInput = document.querySelector('.username-create');
const joinUsernameInput = document.querySelector('.username-join');
const joinPinInput = document.querySelector('.pin-code');

const gameContainer = document.querySelector('.container');
const squares = document.querySelectorAll('.square');
const overlayGamePin = document.querySelector('.overlay-game-pin');
const overlayGameMsg = document.querySelector('.overlay-game-msg');
const overlayGameEnded = document.querySelector('.overlay-game-end');

const btnExit = document.querySelector('.exit');
const btnRestart = document.querySelector('.restart');

const winnerMsg = document.querySelector('.winner');

let playerOne;
let playerTwo;
let pin;

socket.on('data:to:p2', () => {
    socket.on(`p1:username:${sessionStorage.getItem('pin')}`, (data) => {
        playerOne = data.user;
        pin = sessionStorage.getItem('pin');
        document.querySelector('.player-one').innerText = data.user;
        document.querySelector('.game-state').innerText = 'WAITING';
        document.querySelector('.game-msg').innerText = `waiting for ${playerOne}'s movement ..`;
    });
});

socket.on('data:to:p1', () => {
    socket.on(`p2:username:${sessionStorage.getItem('pin')}`, (data) => {
        playerTwo = data.user;
        pin = sessionStorage.getItem('pin');
        document.querySelector('.player-two').innerText = playerTwo;
        overlayGamePin.classList.remove('overlay-show');
        document.querySelector('.game-state').innerText = 'YOUR TURN';
        socket.emit('data:from:p1', {pin: sessionStorage.getItem('pin'), user: playerOne});
    });
});

btnCreate.addEventListener('click', (evt) => {
    evt.preventDefault();
    createOverlay.classList.add('overlay-show');
    createOverlay.style.height = `${windowHeight}px`;
});

btnJoin.addEventListener('click', (evt) => {
    evt.preventDefault();
    joinOverlay.classList.add('overlay-show');
    joinOverlay.style.height = `${windowHeight}px`;
});

btnFormCreate.addEventListener('click', (evt) => {
    evt.preventDefault();

    playerOne = createUsernameInput.value;

    if(playerOne === '') { return }
    createOverlay.classList.remove('overlay-show');
    startScene.classList.remove('scene-show');
    gameScene.classList.add('scene-show');
    document.querySelector('.player-one').innerText = playerOne;
    socket.emit('generate:code', {user: playerOne});
    socket.on(`pinfor:${playerOne}`, (data) => {
        document.querySelector('.pin').innerText = data.pin;
        console.log(data.pin);
        sessionStorage.setItem('pin', data.pin);
    });
    overlayGamePin.classList.add('overlay-show');
    document.querySelector('.symbol').innerText = 'X';
});

btnCreateCancel.addEventListener('click', (evt) => {
    evt.preventDefault();
    createOverlay.classList.remove('overlay-show');
});

btnFormJoin.addEventListener('click', (evt) => {
    evt.preventDefault();

    playerTwo = joinUsernameInput.value;
    pin = joinPinInput.value;

    if(playerTwo === '') { return }
    if(pin === '') { return }

    startScene.classList.remove('scene-show');
    gameScene.classList.add('scene-show');
    document.querySelector('.player-two').innerText = playerTwo;
    
    socket.emit('data:from:p2', {pin: pin, user: playerTwo});
    overlayGameMsg.classList.add('overlay-show');
    sessionStorage.setItem('pin', pin);
    document.querySelector('.symbol').innerText = 'O';
});

btnJoinCancel.addEventListener('click', (evt) => {
    evt.preventDefault();
    joinOverlay.classList.remove('overlay-show');
});


btnExit.addEventListener('click', (evt) => {
    evt.preventDefault();
    overlayGameEnded.classList.remove('overlay-show');
    gameScene.classList.remove('scene-show');
    startScene.classList.add('scene-show');
    sessionStorage.removeItem(pin);
});

btnRestart.addEventListener('click', (evt) => {
    evt.preventDefault();
    overlayGameEnded.classList.remove('overlay-show');

    squares.forEach((item) => {
        item.classList.remove('x', 'circle', 'green');
        item.innerText = '';
    });

    socket.emit('player:play:again', {pin: pin});
    overlayGameMsg.classList.add('overlay-show');
    document.querySelector('.game-msg').innerText = `waiting for ${oppositePlayer} to press play again ..`;
});