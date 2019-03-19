'use strict';

const express = require('express');
const router = express.Router();
const identification = require('./identification');
const blog = require('./blog');

router.use('/identification', identification);
router.use('/blog', blog);

module.exports = router;