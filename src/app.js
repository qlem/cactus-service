'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const router  = require('./controllers/index');
const tools = require('./tools/tools');

let settings;

if (process.env.NODE_ENV === 'production') {
    settings = {
        uri: 'mongodb://root:AA6bm58Bi@mongodb:27017/admin',
        port: 8080,
        origin: 'https://cactus.run'
    };
} else {
    settings = {
        uri: 'mongodb://root:AA6bm58Bi@localhost:27017/admin',
        port: 3000,
        origin: 'http://localhost:8080'
    };
}

const app = express();

// CORS middleware
app.use(cors({
    origin: settings.origin,
    optionsSuccessStatus: 200,
}));

app.use(logger('common'));
app.use(bodyParser.json());
app.use(router);

async function run() {
    try {
        await mongoose.connect(settings.uri, {useNewUrlParser: true, dbName: 'blog'});
        app.listen(settings.port, () => console.log(`Service listening on port ${settings.port}`));
    } catch (e) {
        console.error("Cannot run service");
        if (e.stack)
            console.error(e.stack);
        await tools.timeout(3000);
        await run()
    }
}

run().catch(() => console.error('Cannot run service'));
