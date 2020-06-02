const mongoose = require('mongoose');

const urlDatabase = 'mongodb://localhost:27017/tictactoe';

mongoose.connect(urlDatabase, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log('Database connected:', urlDatabase);
});

db.on('error', (err) => {
    console.error('connection error:', err);
});