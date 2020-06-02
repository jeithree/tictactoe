const { Schema, model } = require('mongoose');

const connectionSchema = new Schema({
    connection: String,
    room: String,
});

module.exports = model('Connection', connectionSchema);