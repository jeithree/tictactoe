const mongoose = require('mongoose');

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

mongoose.connect(DB_CONNECTION_STRING, {
    user: DB_USER,
    pass: DB_PASSWORD,
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