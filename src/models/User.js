const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true, unique: true},
});

const User = mongoose.model('User', userSchema);

module.exports = User;