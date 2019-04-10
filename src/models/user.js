'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema that represents the user model
 */
const userSchema = new Schema({
    userName: String,
    email: String,
    password: String,
    token: String
});

const User = mongoose.model('User', userSchema);

// query used for recover a user from the db
exports.get = filter => User.findOne(filter);

// query used for update a user in the db
exports.update = user => User.updateOne({_id: user._id}, user);
