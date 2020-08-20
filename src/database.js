const mongoose = require('mongoose');

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Database connected:', DB_CONNECTION_STRING);
});
connection.on('error', (err) => {
    console.error('connection error:', err);
});