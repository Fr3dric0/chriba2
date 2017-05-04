const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mailgunContainer = require('mailgun-js');
const routeProtector = require('./middleware/route-protector');

const app = express();

app.disable('x-powered-by');
app.set('trust-proxy', 'loopback'); // Trust the proxy with localhost IPs


////////////////////////////////////////
//             API CONFIG             //
////////////////////////////////////////
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());


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
//           ROUTE PROTECTOR          //
// To prevent unnecessary request to  //
// bad pages, we setup a blacklisting //
// module. to block IPs.               //
////////////////////////////////////////
app.use(routeProtector({
    allowTokenBearer: true,
    deniedFile: path.join(__dirname, 'resources', 'denied.gif')
}));

////////////////////////////////////////
//            STATIC PATHS            //
////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'client', 'dist'))); // Angular

/**
 * Because we cannot rely on every developer having nginx running,
 * we will enable nodejs to server the static-resources in 'development'
 * */
if (app.get('env') === 'development') {
    app.use('/resources', express.static(path.join(__dirname, 'resources')));
}

////////////////////////////////////////
//             EMAIL SETUP            //
//  Use Mailgun as email provider     //
//  for our project, atleast under    //
//  development.                      //
////////////////////////////////////////
let mailConfig;
try {
    mailConfig = require('./bin/config/_email.json');
} catch (e) {
    console.warn('[WARN] Missing _email.json in config. You will not receive email warnings')
}

let Mailgun;

if (mailConfig) {
    Mailgun = mailgunContainer({
        apiKey: mailConfig['api-key'],
        domain: mailConfig.domain
    });
}

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
    console.log('*********************************************\n');

    console.error(err);

    if (Mailgun) {
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
                <p></p>
                <pre>${err.message}</pre>`
        }, (err) => {
            if (err) {
                console.error('\n\n[MongoDB Setup] Problem with email distribution');
                console.error(err);
            }
        });
    }

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
//           ROBOTS ROUTER            //
// Responsible for serving the        //
// robots.txt file on a root url      //
////////////////////////////////////////
app.all('/robots.txt', (req, res) => {
    res.status(200).sendFile('robots.txt', {root: __dirname});
});

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
