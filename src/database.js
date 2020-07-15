const mongoose = require('mongoose');

const urlDatabase = 'mongodb://159.89.177.137:27017/tictactoe?authSource=admin';
//const urlDatabase = 'mongodb://localhost:27017/tictactoe';

//mongoose.connect(urlDatabase, { user: '69e3fffb1bc7', pass: 'cF1Qt08**//gayq3gn444jm05', useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(urlDatabase, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log('Database connected:', urlDatabase);
});

db.on('error', (err) => {
    console.error('connection error:', err);
});