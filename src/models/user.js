'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: String,
    email: String,
    password: String,
    token: String
});

const User = mongoose.model('User', userSchema);

exports.get = filter => User.findOne(filter);
exports.update = user => User.updateOne(user, {_id: user._id});
