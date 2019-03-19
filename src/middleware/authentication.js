'use strict';

const Token = require('jsonwebtoken');
const User = require('./../models/user');
const secret = 'T6Y8e7Ujk';

exports.auth = async (req, res, next) => {
    if (!req.header('token')) {
        res.status(401).send('Unauthorized');
        return
    }
    let token = req.header('token');
    let user = await User.get({token: token});
    if (!user) {
        res.status(401).send('Unauthorized');
        return
    }
    try {
        Token.verify(user.token, secret);
        req.user = user;
    } catch (e) {
        res.status(401).send('Unauthorized');
        return
    }
    next()
};