'use strict';

const express = require('express');
const bCrypt = require('bcryptjs');
const Token = require('jsonwebtoken');
const User = require('./../models/user');
const router = express.Router();
const secret = 'T6Y8e7Ujk';

/**
 * Middleware that checks if the request body is conform.
 * @param req
 * @param res
 * @param next
 */
const bodyCheck = (req, res, next) => {
    if (!req.body.data || !req.body.data.login || !req.body.data.password) {
        res.status(400).send('Wrong or empty body');
        return
    }
    next();
};

/**
 * Middleware that tries to recover a user on database according to the received data from the user.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const userCheck = async (req, res, next) => {
    const data = req.body.data;
    let user = await User.get({email: data.login});
    if (!user)
        user = await User.get({userName: data.login});
    if (!user) {
        res.status(400).send('Wrong email or username');
        return
    }
    if (!bCrypt.compareSync(data.password, user.password)) {
        res.status(400).send('Wrong password');
        return
    }
    req.body.data = user;
    next()
};

/**
 * POST request - full path: /identification/
 * Route that allows to the user to proceed to the identification. Two middleware are called,
 * the first checks the body request then the second tries to recover the user in the database.
 * If successful, the API returns a valid web token.
 */
router.post('/', [bodyCheck, userCheck], async (req, res) => {
    try {
        let user = req.body.data;
        try {
            Token.verify(user.token, secret);
            res.send({token: user.token})
        } catch (e) {
            user.token = Token.sign({email: user.email}, secret, {expiresIn: '10d'});
            await User.update(user);
            res.send({token: user.token})
        }
    } catch (e) {
        res.status(500).send('Internal error');
        console.error("Cannot proceed to user identification");
        if (e.stack)
            console.error(e.stack)
    }
});

module.exports = router;
