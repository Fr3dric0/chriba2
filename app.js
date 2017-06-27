const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mailgunContainer = require('mailgun-js');
const restful = require('restful-node');

const app = express();

app.disable('x-powered-by');
app.set('trust-proxy', 'loopback'); // Trust the proxy with localhost IPs

app.use(app.get('env') === 'production' ?
    morgan('combined', {
        skip: function (req, res) {
            return res.statusCode < 400 // Only log requests of type error
        }
    }) :
    morgan('dev')
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());

////////////////////////////////////////
//             LOAD CONFIG            //
////////////////////////////////////////
const config = require('./bin/config/_config.json');

// Crash server if config is missing
if (!config) {
    throw new Error('Missing config file "./bin/config/_config.json"');
}

app.use(restful.setup.settings(app, config)); // attach config to `req.settings`, and `app.restful.settings`

////////////////////////////////////////
//            STATIC PATHS            //
// In production will Nginx be        //
// responsible to serve this content  //
////////////////////////////////////////
if (app.get('env') === 'development') {
    app.use(express.static(path.join(__dirname, 'client', 'dist'))); // Angular
    app.use('/resources', express.static(path.join(__dirname, 'resources')));
}

////////////////////////////////////////
//             EMAIL SETUP            //
//  Use Mailgun as email provider     //
//  for our project, atleast under    //
//  development.                      //
////////////////////////////////////////
let mailConfig, Mailgun;
try {
    mailConfig = require('./bin/config/_email.json');
} catch (e) {
    console.warn('[WARN] Missing _email.json in config. You will not receive email warnings')
}

if (mailConfig) {
    Mailgun = mailgunContainer({
        apiKey: mailConfig['api-key'],
        domain: mailConfig.domain
    });
}

// Store mailgun in request
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
mongoose.Promise = global.Promise;
const { database } = config;
if (!database) {
    throw new Error('Database Config Error: Cannot resolve property "database" in _config.json');
}

// restful-node expects `config` to have a 'database' field,
// most of our dev code has used 'db'
if (!database.database && database.db) {
    database.database = database.db;
}

restful.database.setupMongoose(mongoose, database)
    .then((db) => console.log(`Database Connected (${new Date()})`))
    .catch((err) => {
        console.error('Database Connection Error\n');
        console.error(err);
        
        // We will only try to notify through email,
        // if env is in production (prevents spamming)
        if (Mailgun && app.get('env') === 'production') {
            Mailgun.messages().send({
                from: `Server Chriba <${mailConfig.user}>`,
                to: mailConfig.distribution.join(','),
                subject: '[Chriba] Database Connection Error',
                text: `The server could not connect to a database.\n
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
                    console.error('\nEmail Distribution Error\n');
                    console.error(err);
                }
            });
        }
    });

////////////////////////////////////////
//          REST-CONTROLLERS          //
// Loads all the restful-node         //
// controllers, and connects them     //
// to routes                          //
////////////////////////////////////////
const AdminController = require('./controllers/admin.controller');
const TokenController = require('./controllers/token.controller');
const EstateController = require('./controllers/estate.controller');
const ProjectController = require('./controllers/project.controller');
const GeneralController = require('./controllers/general.controller');

const EstateThumbController = require('./controllers/estate-thumb.controller');
const ProjectThumbController = require('./controllers/project-thumb.controller');

const tokenConfig = {
    secret: config['token-secret'],
    debug: app.get('env') !== 'production',
    ttl: 43200, // 12 hours
    root: config.media.url
};

// Register routes
restful.routes.urls(app, '/api', [
    { url: '/admin/token', controller: new TokenController(tokenConfig) },
    { url: '/admin', controller: new AdminController(tokenConfig) },
    
    { url: '/estates/thumb', controller: new EstateThumbController(tokenConfig)},
    { url: '/projects/thumb', controller: new ProjectThumbController(tokenConfig)},
    
    { url: '/estates', controller: new EstateController(tokenConfig)},
    { url: '/projects', controller: new ProjectController(tokenConfig)},
    { url: '/general', controller: new GeneralController(tokenConfig)}
]);

////////////////////////////////////////
//              DEV ROUTES            //
//                                    //
// Catches 404 errors on resources/   //
// and serves the client-code,        //
// in development mode                //
////////////////////////////////////////
if (app.get('env') === 'development') {
    app.all('/resources/*', (req, res) => {
        res.sendStatus(404);
    });
    
    // Serves the client
    // MUST be last (it catches everything)
    app.all('*', (req, res) => {
        res.sendFile(
            path.join('client', 'dist', 'index.html'),
            { root: __dirname });
    });
}

module.exports = app;
