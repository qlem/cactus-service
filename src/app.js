'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router  = require('./controllers/index');
const tools = require('./tools/tools');
const uri = 'mongodb://root:AA6bm58Bi@localhost:27017/admin';
const port = 3000;

const app = express();

app.use(logger('common'));
app.use(bodyParser.json());
app.use(router);

async function run() {
    try {
        await mongoose.connect(uri, {useNewUrlParser: true, dbName: 'blog'});
        app.listen(port, () => console.log(`Service listening on port ${port}`));
    } catch (e) {
        console.error("Cannot run service");
        if (e.stack)
            console.error(e.stack);
        await tools.timeout(3000);
        await run()
    }
}

run().catch(() => console.error('Cannot run service'));