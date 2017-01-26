const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

/////////////////////////////
//        API CONFIG       //
/////////////////////////////
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'dist')));

/////////////////////////////
//       CONFIG SETUP      //
/////////////////////////////
const config = require('./bin/config/_config.json');

// Crash server if config is missing
if (!config) {
    throw new Error('Missing config file "./bin/config/_config.json"');
}

// Place config in request object
app.use((req, res, next) => {
    req.config = config;
    next();
});


/////////////////////////////
//      MONGOOSE SETUP     //
/////////////////////////////
const { database } = config;
if (!database) {
    throw new Error('Missing database-config error: Cannot resolve property "database" in _config.jsons');
}
const { username, pwd, domain, port } = database;

mongoose.Promise = global.Promise; // Use ES6 promise, instead of mongoose's promise
// Setup to only include authentication, if username and password is provided
mongoose.connect(`mongodb://${ !!(username && pwd) ? (username + ':' + pwd + '@') : ''}${domain}:${port}/${database.db}`);
const db = mongoose.connection;

db.on('error', (err) => {
    // TODO:ffl - Include email warning, when this error occurs
    // TODO - This error could be a result of loss of data on the database

    console.log('\n*********************************************');
    console.error('          MongoDB Connection ERROR           ');
    console.log('*********************************************');

    console.error(err);

    console.log('\n============ POSSIBLE SOLUTIONS ============');
    console.log(`
    1. Username or password is wrong for the database
    2. Port is wrong
    3. The remote database is not set to listen on remote requests (0.0.0.0)
    4. Database has not created a remote user
    5. Check that your local instance of MongoDB is NOT running
        (Mongoose would sometimes favour the local connection over the remote)`);
    console.log('\n--------------------------------------------');

});

db.on('connection', function () {
    console.log('MongoDB Connection successfully set');
});


/////////////////////////////
//        API ROUTES       //
/////////////////////////////
const apiRoot = './controllers';
const index = require(`${apiRoot}`);
const admin = require(`${apiRoot}/admin/`);
const estates = require(`${apiRoot}/estates`);
const projects = require(`${apiRoot}/projects`);
const general = require(`${apiRoot}/general`);

const api = '/api';
app.use(`${api}/admin`, admin);
app.use(`${api}/projects`, projects);
app.use(`${api}/estates`, estates);
app.use(`${api}/general`, general);
app.use(`${api}`, index); // MUST BE LAST ROUTE!

/////////////////////////////
//      CLIENT ROUTER      //
//                         //
// Responsible for serving //
// the angular site on all //
// non api route           //
/////////////////////////////
app.all('*', (req, res) => {
    // Sends the HTML file, instead of using a view-engine
    res.sendFile(path.join('client', 'dist', 'index.html'), {root: __dirname});
});


/////////////////////////////
//      ERROR HANDLER      //
/////////////////////////////
app.use((err, req, res, next) => {
    const e = { error: err.message};
    if ((req.app.get('env') === 'development') && err.stack) {
        e.stack = err.stack;
    }

    if (err.description) {
        e.description = err.description;
    }

    // render the error page
    res.status(err.status || 500)
        .json(e);
});

module.exports = app;
