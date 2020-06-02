const express = require('express');
const socketIO = require('socket.io');
const customId = require("custom-id");

// Initializations
const app = express();

// Settings
app.enable('trust proxy');
app.set('port', 5000);

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

    socket.on('generate:pin', (data) => {
        socket.emit(`${data.player}:pin`, {pin: customId({})});
    });

    socket.on('join:game', (data) => {
        socket.join(data.pin);
        //console.log(data);
        //console.log(socket.rooms)
    });

    socket.on('join:request', (data) => {
        socket.to(data.pin).broadcast.emit('join:request', {
            pin: data.pin,
            player: data.player,
            symbol: data.symbol
        });
    });

    socket.on('join:request:accepted', (data) => {
        socket.to(data.pin).broadcast.emit('join:request:accepted', {
            pin: data.pin,
            player: data.player,
            symbol: data.symbol
        });
    });

    socket.on('player:movement', (data) => {
        socket.to(data.pin).broadcast.emit('player:movement', {
            pin: data.pin,
            player: data.player,
            symbol: data.symbol,
            position: data.position
        });
    });

    socket.on('play:again:request', (data) => {
        socket.to(data.pin).broadcast.emit('play:again:request', {
            pin: data.pin,
            player: data.player,
            symbol: data.symbol,
        });
    });

    socket.on('play:again:accepted', (data) => {
        socket.to(data.pin).broadcast.emit('play:again:accepted', {
            pin: data.pin,
            player: data.player,
            symbol: data.symbol,
        });
    });

    socket.on('play:again:declined', (data) => {
        socket.to(data.pin).broadcast.emit('play:again:declined', {
            pin: data.pin,
            player: data.player,
            symbol: data.symbol,
        });
    });

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        // gotta emit this only to the user room (needs to be fixed)
        socket.broadcast.emit('player:disconnected', {});
    });
});