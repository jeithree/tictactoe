const express = require('express');
const socketIO = require('socket.io');
const customId = require("custom-id");


// Initializations
const app = express();

// Settings
app.enable('trust proxy');
app.set('port', 4000);

// Middlewares
app.use(express.json());

// Static files
app.use(express.static('public'));

// Routes middlewares
app.use(require('./routes/index'));

// Server
const server = app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});

// Initializations
const io = socketIO(server);

// Websockets
io.on('connection', (socket) => {
    console.log('new connection', socket.id);

    socket.on('generate:code', (data) => {
        io.sockets.emit(`pinfor:${data.user}`, {pin: customId({})});
    });

    socket.on('data:from:p2', (data) => {
        socket.broadcast.emit('data:to:p1', {});
        socket.broadcast.emit(`p2:username:${data.pin}`, {user: data.user});
        console.log(data.pin);
    });

    socket.on('data:from:p1', (data) => {
        socket.broadcast.emit('data:to:p2', {});
        socket.broadcast.emit(`p1:username:${data.pin}`, {user: data.user});
        console.log(data.pin);
    });

    socket.on('player:movement', (data) => {
        socket.broadcast.emit('game:movement', {});
        socket.broadcast.emit(`player:movement:${data.pin}`, {symbol: data.symbol, position: data.position});
        console.log(data.symbol, data.position);
    });

    socket.on('player:play:again', (data) => {
        socket.broadcast.emit('paly:again', {});
        socket.broadcast.emit(`player:movement:${data.pin}`, {symbol: data.symbol, position: data.position});
        console.log(data.symbol, data.position);
    });
});