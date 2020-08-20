const mongoose = require('mongoose');

const dbUrlConnection = process.env.DB_URL_CONNECTION;

mongoose.connect(dbUrlConnection, { user: process.env.DB_USER, pass: process.env.DB_PASSWORD, useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log('Database connected:', dbUrlConnection);
});

db.on('error', (err) => {
    console.error('connection error:', err);
});