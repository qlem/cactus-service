'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const router  = require('./controllers/index');
const tools = require('./tools/tools');

// dev URI / port mongo db
let uri = 'mongodb://root:AA6bm58Bi@localhost:27017/admin';
let port = 3000;

// dev CORS origin
let origin = 'http://localhost:8080';

// if argv == 'prod', set URI / port database and CORS origin for production.
if (process.argv.length >= 3 && process.argv[2] === 'prod') {
    uri = 'mongodb://root:AA6bm58Bi@mongodb:27017/admin';
    port = 8080;
    origin = 'https://cactus.run';
}

const app = express();

// CORS middleware
app.use(cors({
    origin: origin,
    optionsSuccessStatus: 200,
}));

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
