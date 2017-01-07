const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

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
//        API ROUTES       //
/////////////////////////////
const apiRoot = './controllers';
const index = require(`${apiRoot}/index`);
const users = require(`${apiRoot}/users`);

const api = '/api';
app.use(`${api}`, index);
app.use(`${api}/users`, users);

/////////////////////////////
//      CLIENT ROUTER      //
/////////////////////////////
app.all('*', (req, res, next) => {
    // Sends the HTML file, instead of using a view-engine
    res.sendFile(path.join('client', 'dist', 'index.html'), {root: __dirname});
});


/////////////////////////////
//      ERROR HANDLER      //
/////////////////////////////
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({error: err.message});
});

module.exports = app;
