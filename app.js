const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mailgunContainer = require('mailgun-js');

const app = express();

////////////////////////////////////////
//             API CONFIG             //
////////////////////////////////////////
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


////////////////////////////////////////
//            STATIC PATHS            //
////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'client', 'dist'))); // Angular
app.use('/resource', express.static(path.join(__dirname, 'resources'))); // Resources folder pref: '/resource'


////////////////////////////////////////
//             EMAIL SETUP            //
//  Use Mailgun as email provider     //
//  for our project, atleast under    //
//  development.                      //
////////////////////////////////////////
const mailConfig = require('./bin/config/_email.json');
const Mailgun = mailgunContainer({
    apiKey: mailConfig['api-key'],
    domain: mailConfig.domain
});

// Store library in request object
app.use((req, res, next) => {
    req.email = {};
    req.email.Mailgun = Mailgun;

    req.email.config = {
        from: mailConfig.user,
        to: mailConfig.distribution,
        domain: mailConfig.domain
    };

    next();
});
////////////////////////////////////////
//            CONFIG SETUP            //
////////////////////////////////////////
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


////////////////////////////////////////
//           MONGOOSE SETUP           //
////////////////////////////////////////
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

    Mailgun.messages().send({
        from: `Server Chriba <${mailConfig.user}>`,
        to: mailConfig.distribution.join(','),
        subject: '[Chriba] Database Connection Error',
        text: `The server could not connect to the database.\n
               Timestamp: ${new Date()}\n
               Following error occured:\n\t${err.message}`,
        html: ` <h1>Database connection error</h1>
                <p>The server could not connect to the database.</p>
                <pre>Timestamp: ${new Date()}</pre>
                <p>Following error occured</p>
                <pre>${err.message}</pre>`
    }, (err) => {
        if (err) {
            console.error('\n\n[MongoDB Setup] Problem with email distribution');
            console.error(err);
        }
    });

});

db.on('connection', function () {
    console.log('MongoDB Connection successfully set');
});


////////////////////////////////////////
//             API ROUTES             //
////////////////////////////////////////
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


////////////////////////////////////////
//           RESOURCE ROUTER          //
//                                    //
// Responsible for catching 404 err   //
// for the static resources folder.   //
// Thus preventing us from sending    //
// the index.html file every time a   //
// resource WASN'T found              //
////////////////////////////////////////
app.all('/resource/*', (req, res) => {
    res.status(404).send();
});

////////////////////////////////////////
//           CLIENT ROUTER            //
//                                    //
// Responsible for serving the        //
// angular site on all non api- and   //
// resources- routes                  //
////////////////////////////////////////
app.all('*', (req, res) => {
    // Sends the HTML file, instead of using a view-engine
    res.sendFile(path.join('client', 'dist', 'index.html'), {root: __dirname});
});


////////////////////////////////////////
//           ERROR HANDLER            //
////////////////////////////////////////
app.use((err, req, res, next) => {
    const e = { error: err.message};
    // Show stack only when dev & if stack exists & if status-code is >=500
    if ((req.app.get('env') === 'development') && err.stack && err.status > 499) {
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
