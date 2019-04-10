'use strict';

const express = require('express');
const router = express.Router();
const identification = require('./identification');
const blog = require('./blog');

/**
 * This is the index of the router.
 */

// prefix used for the identification
router.use('/identification', identification);

// prefix used for add / delete / update posts
router.use('/blog', blog);

module.exports = router;
