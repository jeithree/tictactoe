const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const startScene = document.querySelector('.start-scene');

const btnCreate = document.querySelector('.start-container .create');
const overlayCreate = document.querySelector('.overlay-create');
const createUsernameInput = document.querySelector('.create-container .username');
const btnCreateConfirm = document.querySelector('.create-container .create');
const btnCCancel = document.querySelector('.create-container .cancel');

const overlayJoin= document.querySelector('.overlay-join');
const btnJoin = document.querySelector('.start-container .join');
const joinUsernameInput = document.querySelector('.join-container .username');
const joinPinInput = document.querySelector('.join-container .pin');
const btnJoinConfirm = document.querySelector('.join-container .join');
const btnJCancel = document.querySelector('.join-container .cancel');

const gameScene = document.querySelector('.game-scene');

const gameState = document.querySelector('.game-state');
const labelPlayerOne = document.querySelector('.player-one');
const labelPlayerTwo = document.querySelector('.player-two');

const overlayPin = document.querySelector('.overlay-pin');
const labelPin = document.querySelector('.pin-text');

const overlayGameMsg = document.querySelector('.overlay-game-msg');
const labelGameMsg = document.querySelector('.game-msg-container p');

const overlayPlayerJoined = document.querySelector('.overlay-player-joined');
const labelPlayerJoined = document.querySelector('.player-joined-container p');
const btnAccept = document.querySelector('.player-joined-container .accept');

const overlayGameEnd = document.querySelector('.overlay-game-end');
const labelGameEnd = document.querySelector('.game-end-container p');
const btnRestart = document.querySelector('.game-end-container .restart');

const gameContainer = document.querySelector('.game-container');
const cells = document.querySelectorAll('.cell');

const LabelSymbol = document.querySelector('.symbol');
const btnExit = document.querySelector('.exit');

const socket = io();

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

window.addEventListener('load', () => {
    overlayCreate.style.height = `${windowHeight}px`;
    overlayJoin.style.height = `${windowHeight}px`;
});

function showOverlay(element) {
    element.classList.add('show');
}

function hideOverlay(element) {
    element.classList.remove('show');
}

function validateInput(input) {
    return (input === '') ? false : true;
}

function setPlayer(name) {
    sessionStorage.setItem('player', name);
}

function getPlayer() {
    return sessionStorage.getItem('player');
}

function setPlayerLabel(number, name) {
    let label = (number === 'one') ? labelPlayerOne : labelPlayerTwo;
    label.innerText = name;
}

function setPin(pin) {
    sessionStorage.setItem('pin', pin);
}

function getPin() {
    return sessionStorage.getItem('pin');
}

function setPinLabel(pin) {
    labelPin.innerText = pin;
}

function setPlayerSymbol(symbol) {
    sessionStorage.setItem('symbol', symbol);
}

function getPlayerSymbol() {
    return sessionStorage.getItem('symbol');
}

function setPlayerSymbolLabel(symbol) {
    LabelSymbol.innerText = symbol;
}

function setGameStateLabel(state) {
    gameState.innerText = state;
}

function socketEmit(evt, args) {
    socket.emit(evt, args);
}

function socketOn(evt, cb) {
    socket.on(evt, cb);
}